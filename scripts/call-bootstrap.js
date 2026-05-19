const fs = require('fs');
const https = require('https');

const envFile = '.env.vercel.production';
const baseUrl = process.argv[2] || 'https://mealnet.vercel.app';

for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
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

const secret = process.env.BOOTSTRAP_SECRET;
if (!secret) {
  console.error('BOOTSTRAP_SECRET missing in', envFile);
  process.exit(1);
}

const url = new URL('/api/admin/bootstrap', baseUrl);
const req = https.request(
  url,
  {
    method: 'POST',
    headers: { 'x-bootstrap-secret': secret },
  },
  (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log(res.statusCode, body);
      process.exit(res.statusCode >= 200 && res.statusCode < 300 ? 0 : 1);
    });
  }
);
req.on('error', (e) => {
  console.error(e);
  process.exit(1);
});
req.end();
