#!/usr/bin/env node
// Nova Admin ─ Health Check Script (Sprint 1)
// Usage: node scripts/health-check.js [--watch]

const http = require('http');
const { execSync } = require('child_process');

function checkCmd(name, cmd, expectedCode = 0) {
  try {
    const out = execSync(cmd, { timeout: 5000, stdio: 'pipe' });
    return { name, status: '✅', code: 0, body: out.toString().trim().substring(0, 70) };
  } catch (e) {
    return { name, status: '⚠️', code: e.status, body: (e.stderr || '').toString().trim().substring(0, 70) || 'not running' };
  }
}

function checkHttp(name, port, path = '/') {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost', port, path, method: 'GET', timeout: 3000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ name, status: res.statusCode === 200 ? '✅' : '⚠️', code: res.statusCode, body: data.trim().substring(0, 70) }));
    });
    req.on('error', (err) => resolve({ name, status: '❌', code: 'ERR', body: err.message.substring(0, 70) }));
    req.on('timeout', () => { req.destroy(); resolve({ name, status: '❌', code: 'TIMEOUT', body: 'Connection timed out' }); });
    req.end();
  });
}

async function runChecks() {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│        Nova Admin ─ Sprint 1 Checks         │');
  console.log('├──────────────────────────────────────────────┤');

  const results = await Promise.all([
    checkHttp('Backend (8002)', 8002),
    checkHttp('Nginx (80)', 80, '/'),
    checkCmd('PostgreSQL', 'pg_isready -h localhost'),
    checkCmd('Redis', 'redis-cli ping'),
    checkCmd('Prisma Gen', 'ls node_modules/@prisma/client/index.js'),
    checkCmd('Build', 'ls packages/backend/dist/main.js'),
    checkCmd('Docker Compose', 'docker compose -f docker-compose.yml config -q'),
  ]);

  let allPassed = true;
  results.forEach(r => {
    const icon = r.status === '✅' ? '✅' : r.status === '⚠️' ? '⚠️' : '❌';
    if (r.status !== '✅') allPassed = false;
    console.log(`│  ${icon}  ${r.name.padEnd(18)} → ${String(r.code).padEnd(6)} ${r.body.padEnd(60)} │`);
  });

  console.log('├──────────────────────────────────────────────┤');
  console.log(`│  ${allPassed ? '✅ ALL CHECKS PASSED' : '⚠️ SOME CHECKS FAILED'}${' '.repeat(32)}│`);
  console.log('└──────────────────────────────────────────────┘\n');
  return allPassed;
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  console.log('Watching every 10 seconds...');
  setInterval(runChecks, 10000);
} else {
  runChecks().then(passed => process.exit(passed ? 0 : 1));
}
