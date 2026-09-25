import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';
import {
  buildModelMatchersLiteralForTest,
  buildModelSelectionExpressionForTest,
  chooseModelPickerNavigationActionForTest,
  scoreModelPickerOptionForTest,
} from '../../src/browser/actions/modelSelection.js';

const expectContains = (arr: string[], value: string) => {
  expect(arr).toContain(value);
};

describe('browser model selection matchers', () => {
  it('targets the current ChatGPT model picker button', () => {
    const expression = buildModelSelectionExpressionForTest('gpt-5.2-pro');
    expect(expression).toContain('[data-testid=\\"model-switcher-dropdown-button\\"]');
    expect(expression).toContain('button.__composer-pill');
    expect(expression).toContain('button[aria-label=\\"Select ChatGPT model\\"]');
    expect(expression).toContain('button[aria-label=\\"Switch model\\"]');
    expect(expression).not.toContain('button[aria-label*=\\"Model\\"]');
    expect(expression).not.toContain('button[aria-haspopup=\\"menu\\"][aria-label*=\\"Model\\"]');
  });

  it('prefers the exact current composer model trigger over a project-chat action', async () => {
    let modelClicks = 0;
    let actionClicks = 0;
    class FakeElement {
      constructor(public textContent: string, private readonly kind: 'model' | 'action') {}
      getAttribute(name: string) {
        if (name === 'aria-label') {
          return this.kind === 'model'
            ? 'Select ChatGPT model'
            : 'Actions for Review ModelLabs Evidence';
        }
        return null;
      }
      dispatchEvent() {
        if (this.kind === 'model') modelClicks += 1;
        else actionClicks += 1;
        return true;
      }
    }
    const modelButton = new FakeElement('5.6 Pro', 'model');
    const actionButton = new FakeElement('', 'action');
    const context: Record<string, unknown> = {
      setTimeout,
      performance: { now: () => Date.now() },
      document: {
        querySelector: (selector: string) => {
          if (selector === 'button[aria-label="Select ChatGPT model"]') return modelButton;
          if (selector.includes('aria-label*="Model"')) return actionButton;
          return null;
        },
      },
    };
    const result = runInNewContext(buildModelSelectionExpressionForTest('5.6Pro'), context) as Promise<{
      status: string; label: string;
    }>;
    await expect(result).resolves.toEqual({ status: 'already-selected', label: '5.6 Pro' });
    expect(modelClicks).toBe(0);
    expect(actionClicks).toBe(0);
  });

  it('rejects a project-chat action when no exact model trigger is present', async () => {
    vi.useFakeTimers();
    try {
      let actionClicks = 0;
      class FakeElement {
        textContent = '';
        getAttribute(name: string) {
          return name === 'aria-label' ? 'Actions for Review ModelLabs Evidence' : null;
        }
        dispatchEvent() {
          actionClicks += 1;
          return true;
        }
      }
      const actionButton = new FakeElement();
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        document: {
          querySelector: (selector: string) =>
            selector.includes('aria-label*="Model"') ? actionButton : null,
        },
      };
      const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
        status: string;
      }>;
      await vi.advanceTimersByTimeAsync(13_000);
      await expect(result).resolves.toEqual({ status: 'button-missing' });
      expect(actionClicks).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('waits for the current model picker to mount before failing closed', () => {
    const expression = buildModelSelectionExpressionForTest('Pro');
    expect(expression).toContain('const BUTTON_WAIT_MS = 12000');
    expect(expression).toContain(
      'performance.now() - buttonWaitStartedAt <= BUTTON_WAIT_MS',
    );
    expect(expression).toContain(
      'await new Promise((resolve) => setTimeout(resolve, REOPEN_INTERVAL_MS / 2))',
    );
  });

  it('accepts an exact 5.6 Pro composer pill without reopening the model menu', async () => {
    let clicks = 0;
    class FakeElement {
      textContent = '5.6\nPro';
      getAttribute() { return null; }
      dispatchEvent() { clicks += 1; return true; }
    }
    const button = new FakeElement();
    const context: Record<string, unknown> = {
      setTimeout,
      performance: { now: () => Date.now() },
      document: { querySelector: () => button },
    };
    const result = runInNewContext(buildModelSelectionExpressionForTest('5.6Pro'), context) as Promise<{
      status: string; label: string;
    }>;
    await expect(result).resolves.toEqual({ status: 'already-selected', label: '5.6\nPro' });
    expect(clicks).toBe(0);
  });

  it('accepts the observed exact 6Pro composer pill without reopening the model menu', async () => {
    let clicks = 0;
    class FakeElement {
      textContent = '6Pro';
      getAttribute() { return null; }
      dispatchEvent() { clicks += 1; return true; }
    }
    const button = new FakeElement();
    const context: Record<string, unknown> = {
      setTimeout,
      performance: { now: () => Date.now() },
      document: { querySelector: () => button },
    };
    const result = runInNewContext(buildModelSelectionExpressionForTest('6 Pro'), context) as Promise<{
      status: string; label: string;
    }>;
    await expect(result).resolves.toEqual({ status: 'already-selected', label: '6Pro' });
    expect(clicks).toBe(0);
  });

  it.each(['5.6\nPro', '6Pro'])('accepts a versioned %s composer pill for current Pro intent', async (label) => {
    let clicks = 0;
    class FakeElement {
      textContent = label;
      getAttribute() { return null; }
      dispatchEvent() { clicks += 1; return true; }
    }
    const button = new FakeElement();
    const context: Record<string, unknown> = {
      setTimeout,
      performance: { now: () => Date.now() },
      document: { querySelector: () => button },
    };
    const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
      status: string; label: string;
    }>;
    await expect(result).resolves.toEqual({ status: 'already-selected', label });
    expect(clicks).toBe(0);
  });

  it('ends a persistent submenu retry before the native broker command timeout', async () => {
    vi.useFakeTimers();
    try {
      let clicks = 0;
      class FakeElement {
        textContent = 'Pro';
        children: FakeElement[] = [];
        classList = { contains: () => false };
        getAttribute(name: string) {
          return name === 'aria-expanded' ? 'false' : null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent() { clicks += 1; return true; }
      }
      const button = new FakeElement();
      const option = new FakeElement();
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        EventTarget: FakeElement,
        Element: FakeElement,
        HTMLElement: FakeElement,
        MouseEvent: class {},
        document: {
          title: 'ChatGPT',
          body: { innerText: '' },
          querySelector: () => button,
          querySelectorAll: (selector: string) => selector.includes('[role="menu"]') ? [] : [option],
        },
        location: { href: 'https://chatgpt.com/c/test' },
      };
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('Pro'), context) as Promise<{
        status: string;
        hint?: { availableOptions: string[] };
      }>;
      await vi.advanceTimersByTimeAsync(25_000);
      await expect(result).resolves.toEqual({
        status: 'option-not-found',
        hint: { temporaryChat: false, availableOptions: ['Pro [role=-, expanded=false, checked=-, testid=-]'] },
      });
      expect(clicks).toBeGreaterThan(10);
    } finally {
      vi.useRealTimers();
    }
  });

  it('selects the observed 5.6Pro leaf without treating its expanded attribute as a submenu', async () => {
    vi.useFakeTimers();
    try {
      let selected = false;
      class FakeElement {
        textContent = '5.6Pro';
        children: FakeElement[] = [];
        classList = { contains: () => false };
        getAttribute(name: string) {
          if (name === 'role') return 'menuitemradio';
          if (name === 'aria-expanded') return 'false';
          if (name === 'aria-checked') return selected ? 'true' : 'false';
          return null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent(event: { type: string }) {
          if (this === option && event.type === 'click') selected = true;
          return true;
        }
      }
      const button = new FakeElement();
      button.textContent = 'ChatGPT';
      const option = new FakeElement();
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        document: {
          title: 'ChatGPT',
          body: { innerText: '' },
          querySelector: () => button,
          querySelectorAll: (selector: string) => selector.includes('[role="menu"]') ? [] : [option],
        },
        location: { href: 'https://chatgpt.com/c/test' },
      };
      for (const [name, value] of [
        ['EventTarget', FakeElement],
        ['Element', FakeElement],
        ['HTMLElement', FakeElement],
        ['MouseEvent', class { constructor(public type: string) {} }],
      ] as const) {
        context[name] = value;
      }
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('5.6Pro'), context) as Promise<{
        status: string;
        label: string;
      }>;
      await vi.advanceTimersByTimeAsync(700);
      await expect(result).resolves.toEqual({ status: 'already-selected', label: '5.6Pro' });
      expect(selected).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('opens an observed versioned Pro submenu for current Pro intent and then chooses its Pro leaf', async () => {
    vi.useFakeTimers();
    try {
      let expanded = false;
      let selected = false;
      class FakeElement {
        children: FakeElement[] = [];
        classList = { contains: () => false };
        constructor(public textContent: string, public role: string) {}
        getAttribute(name: string) {
          if (name === 'role') return this.role;
          if (name === 'aria-expanded') return this === parent ? String(expanded) : null;
          if (name === 'aria-checked') return this === leaf ? String(selected) : null;
          return null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent(event: { type: string }) {
          if (event.type === 'click' && this === parent) expanded = true;
          if (event.type === 'click' && this === leaf) selected = true;
          return true;
        }
      }
      const button = new FakeElement('ChatGPT', 'button');
      const parent = new FakeElement('5.6Pro', 'menuitem');
      const leaf = new FakeElement('Pro', 'menuitemradio');
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        EventTarget: FakeElement,
        Element: FakeElement,
        HTMLElement: FakeElement,
        MouseEvent: class { constructor(public type: string) {} },
        document: {
          title: 'ChatGPT', body: { innerText: '' },
          querySelector: () => button,
          querySelectorAll: (selector: string) => selector.includes('[role="menu"]')
            ? [] : expanded ? [parent, leaf] : [parent],
        },
        location: { href: 'https://chatgpt.com/c/test' },
      };
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
        status: string; label: string;
      }>;
      await vi.advanceTimersByTimeAsync(1_000);
      await expect(result).resolves.toEqual({ status: 'already-selected', label: 'Pro' });
      expect(expanded).toBe(true);
      expect(selected).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('opens the live Select model view and accepts its exact Latest radio for current Pro intent', async () => {
    vi.useFakeTimers();
    try {
      let modelViewOpen = false;
      let latestSelected = false;
      let latestClosedView = false;
      class FakeElement {
        children: FakeElement[] = [];
        classList = { contains: () => false };
        constructor(
          public textContent: string,
          public role: string | null,
          public kind: 'button' | 'menu' | 'parent' | 'view' | 'latest' | 'sol',
        ) {}
        getAttribute(name: string) {
          if (name === 'role') return this.role;
          if (name === 'aria-label' && this.kind === 'parent') return 'Select model';
          if (name === 'aria-expanded' && this.kind === 'parent') return String(modelViewOpen);
          if (name === 'aria-checked' && this.kind === 'latest') return String(latestSelected);
          if (name === 'aria-checked' && this.kind === 'sol') return String(!latestSelected);
          if (name === 'data-state' && this.kind === 'latest') return latestSelected ? 'checked' : 'unchecked';
          if (name === 'data-state' && this.kind === 'sol') return latestSelected ? 'unchecked' : 'checked';
          if (name === 'data-model-selection-view' && this.kind === 'view') return 'true';
          if (name === 'data-view' && this.kind === 'view') return modelViewOpen ? 'advanced' : 'simple';
          return null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        querySelectorAll(selector: string) {
          if (this.kind !== 'menu') return [];
          if (selector === '[role="menuitem"]') return [modelParent];
          return modelViewOpen ? [modelParent, latest, sol] : [modelParent];
        }
        closest(selector: string) {
          return this.kind === 'view' && selector === '[role="menu"]' ? menu : null;
        }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent(event: { type: string }) {
          if (event.type === 'click' && this.kind === 'parent') modelViewOpen = true;
          if (event.type === 'click' && this.kind === 'latest') {
            latestSelected = true;
            modelViewOpen = false;
            latestClosedView = true;
          }
          return true;
        }
      }
      const button = new FakeElement('High', 'button', 'button');
      const menu = new FakeElement('', 'menu', 'menu');
      const modelParent = new FakeElement('High', 'menuitem', 'parent');
      const modelView = new FakeElement('', null, 'view');
      const latest = new FakeElement('Latest', 'menuitemradio', 'latest');
      const sol = new FakeElement('GPT-5.6 Sol', 'menuitemradio', 'sol');
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        document: {
          title: 'ChatGPT',
          body: { innerText: '' },
          querySelector: (selector: string) => selector.includes('[role="menu"]') ? menu : button,
          querySelectorAll: (selector: string) => {
            if (selector === '[data-model-selection-view="true"][data-view="advanced"]') {
              return modelViewOpen ? [modelView] : [];
            }
            if (selector.includes('[role="menu"]')) return [menu];
            return modelViewOpen ? [modelParent, latest, sol] : [modelParent];
          },
        },
        location: { href: 'https://chatgpt.com/' },
      };
      for (const [name, value] of [
        ['EventTarget', FakeElement],
        ['Element', FakeElement],
        ['HTMLElement', FakeElement],
        ['MouseEvent', class { constructor(public type: string) {} }],
      ] as const) {
        context[name] = value;
      }
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
        status: string; label: string;
      }>;
      await vi.advanceTimersByTimeAsync(1_500);
      await expect(result).resolves.toEqual({ status: 'already-selected', label: 'Latest' });
      expect(latestClosedView).toBe(true);
      expect(latestSelected).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('accepts checked Latest in the flat menu opened by the exact current model trigger', async () => {
    vi.useFakeTimers();
    try {
      let menuOpen = false;
      class FakeElement {
        children: FakeElement[] = [];
        classList = { contains: () => false };
        constructor(
          public textContent: string,
          public role: string | null,
          public kind: 'button' | 'menu' | 'latest' | 'sol',
        ) {}
        getAttribute(name: string) {
          if (name === 'role') return this.role;
          if (name === 'aria-label' && this.kind === 'button') return 'Select ChatGPT model';
          if (name === 'aria-checked' && this.kind === 'latest') return 'true';
          if (name === 'aria-checked' && this.kind === 'sol') return 'false';
          return null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        querySelectorAll() { return this.kind === 'menu' ? [latest, sol] : []; }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent(event: { type: string }) {
          if (event.type === 'click' && this.kind === 'button') menuOpen = true;
          return true;
        }
      }
      const button = new FakeElement('ChatGPT', 'button', 'button');
      const menu = new FakeElement('', 'menu', 'menu');
      const latest = new FakeElement('Latest', 'menuitemradio', 'latest');
      const sol = new FakeElement('GPT-5.6 Sol', 'menuitemradio', 'sol');
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        document: {
          title: 'ChatGPT',
          body: { innerText: '' },
          querySelector: (selector: string) => {
            if (selector === 'button[aria-label="Select ChatGPT model"]') return button;
            if (selector.includes('[role="menu"]')) return menuOpen ? menu : null;
            return null;
          },
          querySelectorAll: (selector: string) => {
            if (selector === '[data-model-selection-view="true"][data-view="advanced"]') return [];
            if (selector.includes('[role="menu"]')) return menuOpen ? [menu] : [];
            return [];
          },
        },
        location: { href: 'https://chatgpt.com/' },
      };
      for (const [name, value] of [
        ['EventTarget', FakeElement],
        ['Element', FakeElement],
        ['HTMLElement', FakeElement],
        ['MouseEvent', class { constructor(public type: string) {} }],
      ] as const) {
        context[name] = value;
      }
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
        status: string; label: string;
      }>;
      await vi.advanceTimersByTimeAsync(700);
      await expect(result).resolves.toEqual({ status: 'already-selected', label: 'Latest' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects flat-menu Latest when the picker opened through a compatibility trigger', async () => {
    vi.useFakeTimers();
    try {
      let menuOpen = false;
      class FakeElement {
        children: FakeElement[] = [];
        classList = { contains: () => false };
        constructor(public textContent: string, public role: string | null) {}
        getAttribute(name: string) {
          if (name === 'role') return this.role;
          if (name === 'aria-checked' && this === latest) return 'true';
          if (name === 'aria-checked' && this === sol) return 'false';
          return null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        querySelectorAll() { return this === menu ? [latest, sol] : []; }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent(event: { type: string }) {
          if (event.type === 'click' && this === button) menuOpen = true;
          return true;
        }
      }
      const button = new FakeElement('ChatGPT', 'button');
      const menu = new FakeElement('', 'menu');
      const latest = new FakeElement('Latest', 'menuitemradio');
      const sol = new FakeElement('GPT-5.6 Sol', 'menuitemradio');
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        document: {
          title: 'ChatGPT',
          body: { innerText: '' },
          querySelector: (selector: string) => {
            if (selector === '[data-testid="model-switcher-dropdown-button"]') return button;
            if (selector.includes('[role="menu"]')) return menuOpen ? menu : null;
            return null;
          },
          querySelectorAll: (selector: string) => {
            if (selector === '[data-model-selection-view="true"][data-view="advanced"]') return [];
            if (selector.includes('[role="menu"]')) return menuOpen ? [menu] : [];
            return [];
          },
        },
        location: { href: 'https://chatgpt.com/' },
      };
      for (const [name, value] of [
        ['EventTarget', FakeElement],
        ['Element', FakeElement],
        ['HTMLElement', FakeElement],
        ['MouseEvent', class { constructor(public type: string) {} }],
      ] as const) {
        context[name] = value;
      }
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
        status: string; hint: { availableOptions: string[] };
      }>;
      await vi.advanceTimersByTimeAsync(25_000);
      await expect(result).resolves.toMatchObject({ status: 'option-not-found' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects a lone flat-menu Latest row even behind the exact current trigger', async () => {
    vi.useFakeTimers();
    try {
      let menuOpen = false;
      class FakeElement {
        children: FakeElement[] = [];
        classList = { contains: () => false };
        constructor(public textContent: string, public role: string | null) {}
        getAttribute(name: string) {
          if (name === 'role') return this.role;
          if (name === 'aria-checked' && this === latest) return 'true';
          return null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        querySelectorAll() { return this === menu ? [latest] : []; }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent(event: { type: string }) {
          if (event.type === 'click' && this === button) menuOpen = true;
          return true;
        }
      }
      const button = new FakeElement('ChatGPT', 'button');
      const menu = new FakeElement('', 'menu');
      const latest = new FakeElement('Latest', 'menuitemradio');
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        document: {
          title: 'ChatGPT',
          body: { innerText: '' },
          querySelector: (selector: string) => {
            if (selector === 'button[aria-label="Select ChatGPT model"]') return button;
            if (selector.includes('[role="menu"]')) return menuOpen ? menu : null;
            return null;
          },
          querySelectorAll: (selector: string) => {
            if (selector === '[data-model-selection-view="true"][data-view="advanced"]') return [];
            if (selector.includes('[role="menu"]')) return menuOpen ? [menu] : [];
            return [];
          },
        },
        location: { href: 'https://chatgpt.com/' },
      };
      for (const [name, value] of [
        ['EventTarget', FakeElement],
        ['Element', FakeElement],
        ['HTMLElement', FakeElement],
        ['MouseEvent', class { constructor(public type: string) {} }],
      ] as const) {
        context[name] = value;
      }
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
        status: string;
      }>;
      await vi.advanceTimersByTimeAsync(25_000);
      await expect(result).resolves.toMatchObject({ status: 'option-not-found' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects a checked Latest radio when the exact Select model view was never observed', async () => {
    vi.useFakeTimers();
    try {
      class FakeElement {
        children: FakeElement[] = [];
        classList = { contains: () => false };
        constructor(public textContent: string, public role: string) {}
        getAttribute(name: string) {
          if (name === 'role') return this.role;
          if (name === 'aria-checked' && this.role === 'menuitemradio') return 'true';
          return null;
        }
        hasAttribute() { return false; }
        querySelector() { return null; }
        getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
        dispatchEvent() { return true; }
      }
      const button = new FakeElement('High', 'button');
      const latest = new FakeElement('Latest', 'menuitemradio');
      const context: Record<string, unknown> = {
        setTimeout,
        performance: { now: () => Date.now() },
        document: {
          title: 'ChatGPT',
          body: { innerText: '' },
          querySelector: (selector: string) => selector.includes('[role="menu"]') ? {} : button,
          querySelectorAll: (selector: string) => {
            if (selector === '[data-model-selection-view="true"][data-view="advanced"]') return [];
            if (selector.includes('[role="menu"]')) return [];
            return [latest];
          },
        },
        location: { href: 'https://chatgpt.com/' },
      };
      for (const [name, value] of [
        ['EventTarget', FakeElement],
        ['Element', FakeElement],
        ['HTMLElement', FakeElement],
        ['MouseEvent', class { constructor(public type: string) {} }],
      ] as const) {
        context[name] = value;
      }
      context.window = context;
      const result = runInNewContext(buildModelSelectionExpressionForTest('Current Pro'), context) as Promise<{
        status: string; hint: { availableOptions: string[] };
      }>;
      await vi.advanceTimersByTimeAsync(25_000);
      await expect(result).resolves.toEqual({
        status: 'option-not-found',
        hint: {
          temporaryChat: false,
          availableOptions: ['Latest [role=menuitemradio, expanded=-, checked=true, testid=-]'],
        },
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the currently offered 5.6Pro row distinct from 6 Pro', () => {
    expect(scoreModelPickerOptionForTest('6 Pro', { text: '5.6Pro' }).score).toBe(0);
    expect(scoreModelPickerOptionForTest('6 Pro', { text: 'Pro' }).score).toBe(0);
    expect(scoreModelPickerOptionForTest('5.6Pro', { text: '6 Pro' }).score).toBe(0);
    expect(scoreModelPickerOptionForTest('5.6Pro', { text: 'Pro' }).score).toBe(0);
    expect(scoreModelPickerOptionForTest('5.6Pro', { text: '5.6Pro' }).score).toBeGreaterThan(0);
  });

  it('requires a versioned row for current Pro intent and prefers the newest visible version', () => {
    const six = scoreModelPickerOptionForTest('Current Pro', { text: '6 Pro' }).score;
    const fiveSix = scoreModelPickerOptionForTest('Current Pro', { text: '5.6Pro' }).score;
    expect(scoreModelPickerOptionForTest('Current Pro', { text: 'Pro' }).score).toBe(0);
    expect(scoreModelPickerOptionForTest('Current Pro', { text: 'Latest' }).score).toBe(0);
    expect(six).toBeGreaterThan(fiveSix);
    expect(fiveSix).toBeGreaterThan(0);
  });

  it('includes rich tokens for gpt-5.1 base selection', () => {
    const { labelTokens, testIdTokens, semanticTarget } =
      buildModelMatchersLiteralForTest('gpt-5.1');
    expect(semanticTarget).toBe('instant');
    expectContains(labelTokens, 'gpt-5.1');
    expectContains(labelTokens, 'gpt-5-1');
    expectContains(labelTokens, 'gpt51');
    expectContains(labelTokens, 'chatgpt 5.1');
    expectContains(labelTokens, 'instant');
    expectContains(testIdTokens, 'gpt-5-1');
    expectContains(testIdTokens, 'model-switcher-gpt-5-3');
    expect(
      testIdTokens.some(
        (t) => t.includes('gpt-5.1') || t.includes('gpt-5-1') || t.includes('gpt51'),
      ),
    ).toBe(true);
  });

  it('includes pro/research tokens for gpt-5.2-pro', () => {
    const { labelTokens, testIdTokens, semanticTarget } =
      buildModelMatchersLiteralForTest('gpt-5.2-pro');
    expect(semanticTarget).toBe('pro');
    expect(labelTokens.some((t) => t.includes('pro') || t.includes('research'))).toBe(true);
    expectContains(labelTokens, 'extended pro');
    expectContains(labelTokens, 'pro extended');
    expectContains(testIdTokens, 'pro');
    expectContains(testIdTokens, 'model-switcher-pro');
    expectContains(testIdTokens, 'model-switcher-gpt-5-4-pro');
  });

  it('includes pro + 5.2 tokens for gpt-5.2-pro', () => {
    const { labelTokens, testIdTokens } = buildModelMatchersLiteralForTest('gpt-5.2-pro');
    expect(labelTokens.some((t) => t.includes('pro'))).toBe(true);
    expect(labelTokens.some((t) => t.includes('5.2') || t.includes('5-2'))).toBe(true);
    expect(testIdTokens.some((t) => t.includes('gpt-5.2-pro') || t.includes('gpt-5-2-pro'))).toBe(
      true,
    );
  });

  it('includes thinking tokens for gpt-5.2-thinking', () => {
    const { labelTokens, testIdTokens, semanticTarget } =
      buildModelMatchersLiteralForTest('gpt-5.2-thinking');
    expect(semanticTarget).toBe('thinking');
    expect(labelTokens.some((t) => t.includes('thinking'))).toBe(true);
    expect(labelTokens.some((t) => t.includes('5.2') || t.includes('5-2'))).toBe(true);
    expect(testIdTokens).toContain('model-switcher-gpt-5-4-thinking');
    expect(testIdTokens).toContain('gpt-5.2-thinking');
  });

  it('includes Sol family tokens for gpt-5.6-sol', () => {
    const { labelTokens, testIdTokens, semanticTarget } =
      buildModelMatchersLiteralForTest('gpt-5.6-sol');
    expect(semanticTarget).toBe('sol');
    expect(labelTokens).toContain('gpt-5.6-sol');
    expect(testIdTokens).toContain('gpt-5-6-sol');
  });

  it.each([
    ['GPT-5.6 Sol', 'sol'],
    ['GPT-5.6 Terra', 'terra'],
    ['GPT-5.6 Luna', 'luna'],
    ['GPT-5.5', 'legacy'],
  ] as const)('classifies the current %s model-family row', (label, kind) => {
    const scored = scoreModelPickerOptionForTest(label, { text: label });
    expect(scored.optionKind).toBe(kind);
    expect(scored.score).toBeGreaterThan(0);
  });

  it('rejects a different GPT-5.6 family even though the version token matches', () => {
    expect(scoreModelPickerOptionForTest('GPT-5.6 Terra', { text: 'GPT-5.6 Sol' }).score).toBe(0);
    expect(scoreModelPickerOptionForTest('GPT-5.6 Luna', { text: 'GPT-5.6 Terra' }).score).toBe(0);
  });

  it('plans the provider-free compact to advanced to model submenu path', () => {
    expect(
      chooseModelPickerNavigationActionForTest([
        { text: 'Power', role: 'menuitem', expanded: null },
        { text: 'Show advanced options', role: 'menuitem', expanded: 'false' },
      ]),
    ).toEqual({ kind: 'open-advanced', index: 1 });

    expect(
      chooseModelPickerNavigationActionForTest([
        { text: 'High', ariaLabel: 'Select model', role: 'menuitem', expanded: 'false' },
        { text: 'Power', role: 'menuitem', expanded: null },
      ]),
    ).toEqual({ kind: 'open-model', index: 0 });

    expect(
      chooseModelPickerNavigationActionForTest([
        { text: 'Show compact options', role: 'menuitem', expanded: 'true' },
        { text: 'Model GPT-5.6 Sol', role: 'menuitem', expanded: 'false' },
        { text: 'Effort Light', role: 'menuitem', expanded: 'false' },
      ]),
    ).toEqual({ kind: 'open-model', index: 1 });

    expect(
      chooseModelPickerNavigationActionForTest([
        { text: 'Model GPT-5.6 Sol', role: 'menuitem', expanded: 'true' },
        { text: 'GPT-5.6 Sol', role: 'menuitemradio', expanded: null },
      ]),
    ).toBeNull();
  });

  it('embeds semantic advanced-menu navigation in the browser expression', () => {
    const expression = buildModelSelectionExpressionForTest('GPT-5.6 Terra');
    expect(() => new Function(`return ${expression}`)).not.toThrow();
    expect(expression).toContain('show advanced options');
    expect(expression).toContain("kind: 'open-advanced'");
    expect(expression).toContain("kind: 'open-model'");
    expect(expression).toContain("getAttribute('aria-expanded')");
  });

  it('includes instant tokens for gpt-5.2-instant', () => {
    const { labelTokens, testIdTokens, semanticTarget } =
      buildModelMatchersLiteralForTest('gpt-5.2-instant');
    expect(semanticTarget).toBe('instant');
    expect(labelTokens.some((t) => t.includes('instant'))).toBe(true);
    expect(labelTokens.some((t) => t.includes('5.2') || t.includes('5-2'))).toBe(true);
    expect(testIdTokens).toContain('model-switcher-gpt-5-3');
    expect(testIdTokens).toContain('gpt-5.2-instant');
  });

  it('does not satisfy a Pro request with an Instant row that mentions Pro', () => {
    const instant = scoreModelPickerOptionForTest('Pro', {
      text: 'Instant\nFast everyday answers\nUpgrade to Pro for extended reasoning',
      testId: 'model-switcher-gpt-5-3',
    });
    const extendedPro = scoreModelPickerOptionForTest('Pro', {
      text: 'Extended Pro\nAdvanced reasoning',
      testId: 'model-switcher-pro',
    });
    expect(instant.optionKind).toBe('instant');
    expect(instant.score).toBe(0);
    expect(extendedPro.optionKind).toBe('pro');
    expect(extendedPro.score).toBeGreaterThan(0);
  });

  it('recognizes updated Pro label variants without falling back to Instant', () => {
    expect(scoreModelPickerOptionForTest('Pro', { text: 'Pro Extended' }).optionKind).toBe('pro');
    expect(scoreModelPickerOptionForTest('Pro', { text: 'ChatGPT Pro' }).optionKind).toBe('pro');
    expect(scoreModelPickerOptionForTest('Pro', { text: 'Instant' }).score).toBe(0);
  });

  it('keeps effort labels separate from GPT-5.6 Sol model-family options', () => {
    expect(scoreModelPickerOptionForTest('gpt-5.6-sol', { text: 'Medium' }).optionKind).toBe(
      'thinking',
    );
    expect(scoreModelPickerOptionForTest('gpt-5.6-sol', { text: 'High' }).score).toBe(0);
    expect(scoreModelPickerOptionForTest('gpt-5.6-sol', { text: 'Extra High' }).score).toBe(0);
    expect(
      scoreModelPickerOptionForTest('gpt-5.6-sol', { text: 'GPT-5.6 Sol' }).score,
    ).toBeGreaterThan(0);
    expect(scoreModelPickerOptionForTest('gpt-5.6-sol', { text: 'Pro' }).score).toBe(0);
  });
});
