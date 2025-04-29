// src/code-analyzer/cloneRepo.ts
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuid } from "uuid";

export const cloneRepo = (repoUrl: string): string => {
  // 1) Use the platform temp directory
  const tmpRoot = os.tmpdir();              // e.g. C:\Users\You\AppData\Local\Temp
  const outDir = path.join(tmpRoot, `sitesync-repo-${uuid()}`);

  // 2) If by any chance it already exists, remove it first
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }

  // 3) Create our fresh folder
  fs.mkdirSync(outDir, { recursive: true });

  // 4) Shallow clone only the default branch
  execSync(
    `git clone --depth 1 --single-branch ${repoUrl} ${outDir}`,
    { stdio: "inherit" }
  );

  return outDir;
};
