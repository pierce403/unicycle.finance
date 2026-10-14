import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
const revision = process.env.CF_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: root, encoding: 'utf8',
}).trim();
if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid source revision');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const path of ["index.html", "index-bak.html", "poach.html", "poach.js", "app.js", "js", "css", "static", "piper.gif", "favicon.ico", "manifest.json", "logo192.png", "vault"]) cpSync(resolve(root, path), resolve(output, path), { recursive: true });
writeFileSync(resolve(output, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found</title><h1>Page not found</h1><p><a href="/">Return home</a></p></html>\n');
mkdirSync(resolve(output, '.well-known'), { recursive: true });
writeFileSync(resolve(output, '.well-known/cloudflare-build.json'), JSON.stringify({ repository: "pierce403/unicycle.finance", revision }, null, 2) + '\n');
writeFileSync(resolve(output, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n/vault/ETH/USDT\n  Content-Type: text/html; charset=utf-8\n/.well-known/cloudflare-build.json\n  Cache-Control: no-store\n');
console.log('Built public assets at ' + revision);
