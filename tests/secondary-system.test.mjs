import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const protectedVisibleHashes = {
  'article-divergence.html': 'da94859b8b7f637ada5371c454b464be15d5343a0848026e5bb4e11ed0d0c09e',
  'article-indicator.html': '0e8c0ad6f787ff13dfe45896ff4e8457f27eb6674b2430b79a3d77e117e82a4d',
  'article-research.html': 'f386db3ada92fa7ad6faacb813cfdfb58e1841dd56d6395ccf354ae6ea8eec8a',
  'article-review.html': '5ce82c7ee4106bc88761a5a3106caad15efb694cac018a1528331e788a8fa049',
  'article-shortline.html': '39f99d4ab066acc195484feb8723e6fc829d7ba34d511289c015db0c87171522',
  'article-stockpick.html': 'd0dbdef349dec56c1574f2434f8e08f7171b7be32272766b8035949ce9b6984a',
  'article-stoploss.html': 'b981d875165ea73f2fb643437dfd8e7b36b78bb32f5e180e0788f9d9f880242e',
  'article-timeshare.html': '81069d9455d136fc525fcd89a2d9c142606305e7e4696d721b587976ece25f10',
  'article.html': 'f5b65e9aeb899aefb83b09b8c965419aca40d2942c207fd16b0c5dcf53544092',
  'indicators.html': '15db2f644eb972c72bfd032bc96ab772c3ad69d79b4c82fedfbbf2eb67f6cc73',
  'strategy.html': '0920d3652e06392d1e81c889cc3e11f3278780eb26039d42f3f6faf38c6121d8',
  'research-1.html': '3929b443c13962070e53978ed2f46107e5f06734e5ca49774aa5807dd96484d6',
  'research-2.html': 'bcf2b2701c3153e843c772f14cb58d8710b659e62a9109cb467f55c0f308d998',
  'research-3.html': '2c1707f1ec1f82765292a2ee6384e554e179ea0279a349243ec2627258ae7486',
  'research-4.html': '68700fdf786414c38130640946d522103818ff33be14d6f5e4227cbf22c54d89',
  'research-5.html': '1aabf9f1b77b67dcbd7e5e79235435fb9ba327e53a5b04c2f176e303c1bd5a67',
  'research-6.html': 'ecb3caca3aee44c034962efb010cec541ccaf58cd8b4ba6bdacfcb19446d25d3',
  'research-7.html': '4a70450a5f5ed399266189d4a3abe7d9b452f68cfee20f8e3fe4e0f197efd916',
  'research-8.html': '848c8ef225e73980464c746bbc414430e9faafb9386c9469b77380a1d1a3d037',
  'research-9.html': '8f669187a83d6c546fbf261960ac1f6ae8e77ce8c65dbabc1541a99ff916bf39',
  'articles.html': '65624ea62d998fa80ec52f1d19ec795f4de31c987015f73e50c6867e7fe12856',
};

const standard = Object.keys(protectedVisibleHashes).filter((name) => name.startsWith('article') && name !== 'articles.html');
const longform = ['indicators.html', 'strategy.html', ...Array.from({ length: 9 }, (_, index) => `research-${index + 1}.html`)];
const pages = [...standard, ...longform, 'articles.html'];
const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const visibleText = (source) => source
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

test('all 21 secondary routes consume the canonical design and runtime', () => {
  assert.equal(pages.length, 21);
  for (const name of pages) {
    const source = read(name);
    assert.match(source, /href="site-system\.css"/, name);
    assert.match(source, /src="site-system\.js"/, name);
    assert.doesNotMatch(source, /<style>/, name);
    assert.equal((source.match(/site-system\.css/g) ?? []).length, 1, name);
    assert.equal((source.match(/site-system\.js/g) ?? []).length, 1, name);
  }
});

test('the three template families are explicit and complete', () => {
  for (const name of standard) assert.match(read(name), /data-secondary-template="article"/, name);
  for (const name of longform) assert.match(read(name), /data-secondary-template="longform"/, name);
  assert.match(read('articles.html'), /data-secondary-template="list"/);
  assert.match(read('articles.html'), /src="articles-list\.js"/);
});

test('protected visible titles and article content remain byte-stable after normalization', () => {
  for (const [name, expected] of Object.entries(protectedVisibleHashes)) {
    const actual = createHash('sha256').update(visibleText(read(name))).digest('hex');
    assert.equal(actual, expected, name);
  }
});

test('known broken article wrappers are corrected without duplicating the old close marker', () => {
  for (const name of ['article-divergence.html', 'article-review.html']) {
    const source = read(name);
    assert.doesNotMatch(source, /<\/div><\/div><!-- ===================== 作者 \/ 上一篇下一篇/);
    assert.match(source, /<\/div><\/article><!-- ===================== 下载 App/);
  }
});

test('longform pages have generated navigation hooks and meaningful image alternatives', () => {
  const runtime = read('site-system.js');
  assert.match(runtime, /className = 'longform-toc'/);
  assert.match(runtime, /aria-current/);
  assert.match(runtime, /table-scroll-hint/);
  for (const name of longform) assert.doesNotMatch(read(name), /<img[^>]+alt=""/i, name);
});

test('shared interaction CSS avoids transition-all and provides coarse-pointer targets', () => {
  const css = read('site-system.css');
  const listRuntime = read('articles-list.js');
  assert.doesNotMatch(css, /transition:\s*all\b|\btransition-all\b/);
  assert.doesNotMatch(listRuntime, /skeletonHtml|setTimeout\(/);
  assert.match(css, /@media \(hover: none\), \(pointer: coarse\)/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /#search-clear \{ position: absolute; \}/);
  assert.match(css, /\.btn\.hidden\.sm\\:inline-flex \{ display: inline-flex; \}/);
  assert.match(css, /\.btn\.md\\:hidden \{ display: none !important; \}/);
});

test('inner-page reading content is visible without scroll choreography', () => {
  const css = read('site-system.css');
  const runtime = read('site-system.js');
  assert.match(css, /html\.js body\[data-secondary-template\] \.reveal,[\s\S]*?opacity: 1;/);
  assert.match(css, /body\[data-secondary-template\] article\.prose h2[\s\S]*?border-top:/);
  assert.match(runtime, /Inner pages are reading surfaces:[\s\S]*?element\.classList\.add\('in'\)/);
});

test('longform navigation stays compact and closes after a mobile section jump', () => {
  const css = read('site-system.css');
  const runtime = read('site-system.js');
  assert.match(css, /\.longform-toc \{[\s\S]*?position: sticky; top: 4rem;/);
  assert.match(css, /@media \(min-width: 1180px\)[\s\S]*?position: fixed;/);
  assert.match(css, /\.overflow-x-auto > table \{[\s\S]*?min-width: 44rem;/);
  assert.match(runtime, /if \(!desktopToc\.matches\) details\.open = false/);
  assert.match(runtime, /desktopToc\.addEventListener\('change', syncTocMode\)/);
});

test('article archive uses the dedicated layout while preserving all article records', () => {
  const archive = read('articles.html');
  const data = read('articles-list.js');
  assert.match(archive, /class="archive-hero"/);
  assert.match(archive, /id="article-library"/);
  assert.doesNotMatch(archive, /id="about"|id="focus"/);
  assert.equal((data.match(/\{ tag:/g) ?? []).length, 20);
  for (const route of ['strategy.html', 'indicators.html', 'article-divergence.html', 'research-1.html', 'research-9.html']) {
    assert.ok(data.includes("url: '" + route + "'"), route);
  }
  assert.match(data, /class="archive-featured"/);
  assert.match(data, /class="archive-entry"/);
  assert.doesNotMatch(data, /grid\.classList\.add\('grid-fade'\)/);
});
