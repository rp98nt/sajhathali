const https = require('https');

const secret = process.env.BOOTSTRAP_SECRET;
const baseUrl = process.argv[2] || 'https://mealnet.vercel.app';

if (!secret) {
  console.error('BOOTSTRAP_SECRET not set in environment');
  process.exit(1);
}

const url = new URL('/api/admin/bootstrap', baseUrl);
const req = https.request(
  url,
  { method: 'POST', headers: { 'x-bootstrap-secret': secret } },
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
