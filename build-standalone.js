const fs = require('fs');
const path = require('path');

const root = __dirname;
const assetsDir = path.join(root, 'assets');
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp3': 'audio/mpeg' };
const encoded = {};
for (const name of fs.readdirSync(assetsDir)) {
  const ext = path.extname(name).toLowerCase();
  encoded[name] = `data:${mime[ext] || 'application/octet-stream'};base64,${fs.readFileSync(path.join(assetsDir, name)).toString('base64')}`;
}
const dataFor = (name) => encoded[name] || `assets/${name}`;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/url\('assets\/([^']+)'\)/g, (_, name) => `url('${dataFor(name)}')`);
html = html.replace(/src="assets\/([^"]+)"/g, (_, name) => `src="${dataFor(name)}"`);
const game = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const assetBootstrap = `window.EMBEDDED_ASSETS=${JSON.stringify(encoded)};`;
html = html.replace('<script src="game.js"></script>', `<script>${assetBootstrap}</script><script>${game}</script>`);
const target = path.resolve(root, '..', '看山冰淇淋小屋-修复版-20260915-单文件.html');
fs.writeFileSync(target, html);
console.log(`Created ${target} (${Math.round(fs.statSync(target).size / 1024 / 1024)} MB)`);
