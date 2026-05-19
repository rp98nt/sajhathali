/**
 * Run a command with variables from an env file (overrides existing env).
 * Usage: node scripts/run-with-env.js .env.vercel.production npx prisma migrate deploy
 */
const fs = require('fs');
const { spawnSync } = require('child_process');

const envFile = process.argv[2];
const command = process.argv.slice(3);

if (!envFile || command.length === 0) {
  console.error('Usage: node scripts/run-with-env.js <env-file> <command...>');
  process.exit(1);
}

const text = fs.readFileSync(envFile, 'utf8');
for (const line of text.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  let val = trimmed.slice(eq + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
}

const result = spawnSync(command[0], command.slice(1), {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
