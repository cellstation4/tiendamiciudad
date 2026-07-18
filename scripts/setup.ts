import { closeSync, existsSync, mkdirSync, openSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const envFile = resolve(root, ".env");
const envExample = resolve(root, ".env.example");

if (!existsSync(envFile)) {
  throw new Error(`Falta .env. Copiá ${envExample} y configurá BETTER_AUTH_SECRET.`);
}

mkdirSync(resolve(root, "uploads"), { recursive: true });
const sqliteFile = resolve(root, "prisma", "dev.db");
if (!existsSync(sqliteFile)) closeSync(openSync(sqliteFile, "w"));

const prismaCli = resolve(root, "node_modules", "prisma", "build", "index.js");
const tsxCli = resolve(root, "node_modules", "tsx", "dist", "cli.mjs");

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", shell: false });
  if (result.status !== 0) throw new Error(`Falló: ${command} ${args.join(" ")}`);
}

run(process.execPath, [prismaCli, "generate"]);
run(process.execPath, [prismaCli, "migrate", "deploy"]);
run(process.execPath, [tsxCli, "prisma/seed.ts"]);
console.log("Entorno local preparado. Ejecutá: npm run dev");
