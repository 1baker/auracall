import fs from "node:fs/promises";
import path from "node:path";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const buildOutput = path.join(repositoryRoot, "dist");

await fs.rm(buildOutput, { recursive: true, force: true });
