export function requireFixtureValue<T>(value: T | null | undefined, label: string): T {
  if (value == null) {
    throw new Error(`${label} fixture was missing.`);
  }
  return value;
}
