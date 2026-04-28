/**
 * ES 모듈 페이지를 IIFE 번들로 만들어 file://(파일 직접 열기)에서도 동작하게 함.
 * 실행: npm run build
 */
const esbuild = require('esbuild');
const path = require('path');

const root = path.join(__dirname, '..');

const builds = [
  { entry: 'js/products/index.js', outfile: 'js/products.bundle.js' },
  { entry: 'js/price/index.js', outfile: 'js/price.bundle.js' },
  { entry: 'js/recommend/entry-bundle.js', outfile: 'js/recommend.bundle.js' },
];

async function main() {
  for (const b of builds) {
    await esbuild.build({
      entryPoints: [path.join(root, b.entry)],
      bundle: true,
      format: 'iife',
      platform: 'browser',
      outfile: path.join(root, b.outfile),
      logLevel: 'info',
    });
    console.log('OK:', b.outfile);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
