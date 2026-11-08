// Build-time synchronization of the Cloudflare Pages guard with public Common Test records.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const db = readFileSync(join(root, 'src/app/data/testDatabase.ts'), 'utf8');
const matched = db.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);
if (!matched) throw new Error('Cannot parse examination database');
const allowed = [...new Set(matched[1].split('\n').map(x => x.split('\t'))
  .filter(x => /^\d{4}$/.test(x[0]) && Number(x[0]) >= 2021 && x[3])
  .map(x => x[3]))].sort((a,b) => a.localeCompare(b,'ja'));
if (!allowed.length) throw new Error('Refusing to publish an empty allowlist');

// Preserve the same implementation as the tracked generated file.
const runtime = "// Generated from the examination database. See scripts/generate-test-route.js.\n// This edge guard blocks direct requests before React or archived HTML can render.\nconst ALLOWED_PDFS = new Set(__ALLOWED_DATA__);\n\nconst notFoundHtml = '<!doctype html><html lang=\"ja\"><head><meta charset=\"utf-8\">' +\n  '<meta name=\"robots\" content=\"noindex,nofollow\">' +\n  '<title>この個別ページは公開していません｜共通テスト過去問総集</title></head>' +\n  '<body><main style=\"max-width:640px;margin:4rem auto;font-family:system-ui,sans-serif;padding:1rem\">' +\n  '<h1>この個別ページは現在公開していません</h1>' +\n  '<p>年度別・科目別一覧から問題・解答資料を閲覧できます。</p>' +\n  '<p><a href=\"/overview\">試験一覧に戻る</a></p></main></body></html>';\n\nexport function onRequest({ request, next }) {\n  const pathname = new URL(request.url).pathname;\n  const rest = pathname.startsWith('/test/') ? pathname.slice('/test/'.length) : '';\n  // Accept exactly a PDF detail URL, with an optional trailing slash or index.html.\n  const match = /^([^/]+)(?:\\/(?:index\\.html)?)?$/.exec(rest);\n  let filename = '';\n  if (match) {\n    try { filename = decodeURIComponent(match[1]); } catch { /* reject malformed escapes */ }\n  }\n  if (ALLOWED_PDFS.has(filename)) return next();\n  return new Response(request.method === 'HEAD' ? null : notFoundHtml, {\n    status: 404,\n    headers: {\n      'Content-Type': 'text/html; charset=utf-8',\n      'X-Robots-Tag': 'noindex, nofollow',\n      'Cache-Control': 'no-store',\n    },\n  });\n}\n";
const source = runtime.replace('__ALLOWED_DATA__', JSON.stringify(allowed,null,2));
const target = join(root, 'functions/test/[[path]].js');
mkdirSync(dirname(target), { recursive:true });
writeFileSync(target, source, 'utf8');
console.log('Allowed Common Test individual pages:', allowed.length);
