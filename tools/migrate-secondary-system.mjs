import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const standard = [
  'article-divergence.html', 'article-indicator.html', 'article-research.html',
  'article-review.html', 'article-shortline.html', 'article-stockpick.html',
  'article-stoploss.html', 'article-timeshare.html', 'article.html',
];
const longform = [
  'indicators.html', 'strategy.html', 'research-1.html', 'research-2.html',
  'research-3.html', 'research-4.html', 'research-5.html', 'research-6.html',
  'research-7.html', 'research-8.html', 'research-9.html',
];
const listPages = ['articles.html'];
const pages = [...standard, ...longform, ...listPages];

const read = (name) => readFileSync(join(root, name), 'utf8');
const write = (name, value) => writeFileSync(join(root, name), value, 'utf8');
const styleOf = (html) => html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const scriptsOf = (html) => [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);
const escapeAttr = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const stripTags = (value) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const baseHtml = read('article-divergence.html');
const listHtml = read('articles.html');
const indexHtml = read('index.html');
const baseStyle = styleOf(baseHtml);
const indexStyle = styleOf(indexHtml);
const baseScripts = scriptsOf(baseHtml);
const listScripts = scriptsOf(listHtml);

if (!baseStyle || !indexStyle || baseScripts.length !== 3 || listScripts.length !== 3) {
  throw new Error('Unexpected preimage: canonical style/script blocks are missing');
}

const rootBlock = indexStyle.match(/\s*:root\s*{[\s\S]*?}\s*/)?.[0] ?? '';
const typographyBlock = indexStyle.match(/\s*html\s*{\s*scrollbar-gutter:[\s\S]*?blockquote\s*{[^}]*}\s*/)?.[0] ?? '';
const componentMarker = '/* ===================== 组件系统 ===================== */';
const componentIndex = indexStyle.indexOf(componentMarker);
if (!rootBlock || !typographyBlock || componentIndex < 0) throw new Error('Unexpected index design-system preimage');
const indexComponents = indexStyle.slice(componentIndex);
const indexPageCss = indexStyle.slice(0, componentIndex)
  .replace(rootBlock, '\n')
  .replace(typographyBlock, '\n')
  .replaceAll('background: hsl(12 49% 58%);', 'background: hsl(var(--primary));');

const customCss = String.raw`

/* ===================== Canonical shared site system ===================== */
.btn.hidden { display: none; }
#search-clear { position: absolute; }
#search-input { padding-left: 2.25rem; padding-right: 2.75rem; }

@media (min-width: 640px) {
  .btn.hidden.sm\:inline-flex { display: inline-flex; }
}
@media (min-width: 768px) {
  .btn.md\:hidden { display: none !important; }
}

body[data-secondary-template="list"] .card-hover {
  transition: transform 160ms cubic-bezier(.23,1,.32,1), border-color 160ms ease, box-shadow 160ms ease;
}
body[data-secondary-template="list"] .tabs {
  display: inline-flex; flex-wrap: wrap; gap: .25rem; padding: .25rem;
  background: hsl(var(--muted)); border-radius: var(--radius-sm);
}
body[data-secondary-template="list"] .tab {
  height: 2rem; padding: 0 .875rem; border-radius: calc(var(--radius-sm) - 2px);
  font-size: .875rem; font-weight: 500; color: hsl(var(--muted-foreground));
  border: 0; background: transparent; cursor: pointer;
  transition: color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}
body[data-secondary-template="list"] .tab[data-active="true"] {
  background: hsl(var(--card)); color: hsl(var(--foreground)); box-shadow: 0 1px 2px rgba(0,0,0,.05);
}
body[data-secondary-template="list"] .grid-fade { animation: secondary-grid-in 250ms cubic-bezier(.23,1,.32,1) both; }
@keyframes secondary-grid-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
body[data-secondary-template="list"] .state-box { text-align: center; padding: 3rem 1.5rem; }

/* Lead article uses an inverse surface; keep its labels readable on charcoal. */
#articles-grid .article-card--lead > .w-fit,
#articles-grid .article-card--lead > div .text-\[hsl\(var\(--primary\)\)\] {
  color: hsl(12 72% 80%);
}
#articles-grid .article-card--lead > .w-fit { background: rgba(255,255,255,.10); }

/* Standard article containment fallback; corrected markup consumes the same measure. */
article.prose > .mt-14.border-t,
article.prose > .mt-8.grid {
  width: 100%; max-width: 48rem; margin-left: auto; margin-right: auto;
  padding-left: 1rem; padding-right: 1rem;
}

/* Long-form table of contents and current-location affordance. */
.longform-toc {
  position: relative; z-index: 20; margin: 1.5rem auto 0; width: min(48rem, calc(100% - 2rem));
  border: 1px solid hsl(var(--border)); border-radius: var(--radius); background: hsl(var(--card));
  box-shadow: 0 12px 30px -24px rgba(20,15,10,.28);
}
.longform-toc summary {
  min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: .75rem 1rem; cursor: pointer; font-weight: 650; list-style: none;
}
.longform-toc summary::-webkit-details-marker { display: none; }
.longform-location { color: hsl(var(--primary)); font-size: .8125rem; font-weight: 600; }
.longform-toc nav { display: grid; gap: .25rem; padding: 0 .75rem .75rem; }
.longform-toc a {
  min-height: 44px; display: flex; align-items: center; padding: .45rem .65rem;
  border-radius: var(--radius-sm); color: hsl(var(--muted-foreground)); font-size: .875rem;
  text-decoration: none; transition: color 150ms ease, background-color 150ms ease;
}
.longform-toc a[aria-current="location"] { color: hsl(var(--foreground)); background: hsl(var(--accent)); font-weight: 650; }

.table-scroll-hint {
  margin: .5rem 0 0; color: hsl(var(--muted-foreground)); font-size: .75rem; text-align: right;
}

pre { max-width: 100%; }
pre > code { display: block; width: max-content; min-width: 100%; }
#back-top { width: 44px; height: 44px; }

@media (hover: hover) and (pointer: fine) {
  body[data-secondary-template="list"] .card-hover:hover { transform: translateY(-2px); border-color: hsl(var(--input)); }
  .longform-toc a:hover { color: hsl(var(--foreground)); background: hsl(var(--muted)); }
}

@media (min-width: 1180px) {
  .longform-toc {
    position: fixed; top: 5.75rem; right: max(1rem, calc((100vw - 88rem) / 2));
    width: 14rem; max-height: calc(100vh - 7rem); overflow: auto; margin: 0;
  }
  .longform-toc summary { cursor: default; }
}

@media (max-width: 767px) {
  body[data-secondary-template="list"] .tabs { flex-wrap: nowrap; max-width: 100%; overflow-x: auto; scroll-snap-type: x proximity; }
  body[data-secondary-template="list"] .tab { min-height: 44px; scroll-snap-align: start; }
  #search-input { min-height: 44px; }
  article.prose > .mt-14.border-t a,
  article.prose > .mt-8.grid a,
  #article-grid article a,
  #reset-filter { min-height: 44px; display: inline-flex; align-items: center; }
}

@media (prefers-reduced-motion: reduce) {
  body[data-secondary-template="list"] .grid-fade { animation: none !important; }
}
`;

const sharedCss = [
  '/* Generated canonical stylesheet for index + all secondary pages. */',
  `/* Sources before migration: secondary ${hash(baseStyle)}, index components ${hash(indexComponents)}. */`,
  baseStyle,
  rootBlock,
  typographyBlock,
  indexComponents,
  customCss,
].join('\n')
  .replaceAll('--primary: 12 49% 58%;', '--primary: 12 49% 45%;')
  .replaceAll('--muted-foreground: 40 3% 45%;', '--muted-foreground: 40 3% 40%;')
  .replaceAll('--ring: 12 49% 58%;', '--ring: 12 49% 45%;')
  .replace(/[ \t]+$/gm, '');

const baseRuntime = baseScripts[1][1];
const revealFallback = baseScripts[2][1];
const commonTailMarker = '// 下载按钮已改为直接跳转（App Store / 安卓 APK） 无需 JS 脚本';
const commonTailIndex = baseRuntime.indexOf(commonTailMarker);
if (commonTailIndex < 0) throw new Error('Unexpected canonical runtime preimage');
const commonRuntimePrefix = baseRuntime.slice(0, commonTailIndex);
const commonRuntimeTail = baseRuntime.slice(commonTailIndex);

function pageSpecificRuntime(runtime, name) {
  if (!runtime.startsWith(commonRuntimePrefix) || !runtime.endsWith(commonRuntimeTail)) {
    throw new Error(name + ': common runtime drifted');
  }
  return runtime.slice(commonRuntimePrefix.length, runtime.length - commonRuntimeTail.length).trim();
}
const sharedEnhancementJs = String.raw`

// ===== Shared long-form TOC + current location =====
(function () {
  if (document.body.dataset.secondaryTemplate !== 'longform') return;
  var article = document.querySelector('article.prose > .max-w-3xl');
  if (!article) return;
  var headings = Array.prototype.slice.call(article.querySelectorAll('h2'));
  if (headings.length < 1) return;
  headings.forEach(function (heading, index) {
    if (!heading.id) heading.id = 'section-' + (index + 1);
  });
  var details = document.createElement('details');
  details.className = 'longform-toc';
  if (window.matchMedia('(min-width: 1180px)').matches) details.open = true;
  details.innerHTML = '<summary><span>本页目录</span><span class="longform-location">当前：' + headings[0].textContent.trim() + '</span></summary>'
    + '<nav aria-label="长文目录">' + headings.map(function (heading) {
      return '<a href="#' + heading.id + '">' + heading.textContent.trim() + '</a>';
    }).join('') + '</nav>';
  article.parentNode.insertBefore(details, article);
  var links = Array.prototype.slice.call(details.querySelectorAll('a'));
  var location = details.querySelector('.longform-location');
  function select(id) {
    links.forEach(function (link) {
      var active = link.getAttribute('href') === '#' + id;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    var current = headings.find(function (heading) { return heading.id === id; });
    if (current) location.textContent = '当前：' + current.textContent.trim();
  }
  select(headings[0].id);
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.filter(function (entry) { return entry.isIntersecting; }).forEach(function (entry) { select(entry.target.id); });
    }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
    headings.forEach(function (heading) { observer.observe(heading); });
  }
})();

// ===== Shared horizontal-table affordance =====
(function () {
  Array.prototype.slice.call(document.querySelectorAll('.overflow-x-auto')).forEach(function (wrap) {
    if (!wrap.querySelector('table') || wrap.nextElementSibling?.classList.contains('table-scroll-hint')) return;
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', '可横向滚动的表格');
    var hint = document.createElement('p');
    hint.className = 'table-scroll-hint';
    hint.textContent = '横向滑动查看完整表格 →';
    wrap.insertAdjacentElement('afterend', hint);
  });
  Array.prototype.slice.call(document.querySelectorAll('pre')).forEach(function (code) {
    code.tabIndex = 0;
    code.setAttribute('role', 'region');
    code.setAttribute('aria-label', '可横向滚动的代码示例');
  });
})();
`;
const sharedJs = ['/* Canonical runtime for all secondary pages. */', baseRuntime, revealFallback, sharedEnhancementJs].join('\n');

const listRuntime = listScripts[1][1];
const listStart = listRuntime.indexOf('// ===== 文章数据与渲染 =====');
const listEnd = listRuntime.indexOf('// ===== 入场动效 =====');
if (listStart < 0 || listEnd < 0) throw new Error('Unexpected list runtime preimage');
function removeFakeListWait(source) {
  const skeletonStart = source.indexOf(' // 卡片骨架屏 防抖搜索期间即时反馈');
  const skeletonEnd = source.indexOf('\n\n function renderArticles', skeletonStart);
  const inputStart = source.indexOf(" input.addEventListener('input', function () {");
  const inputEnd = source.indexOf("\n clear.addEventListener('click'", inputStart);
  if (skeletonStart < 0 || skeletonEnd < 0 || inputStart < 0 || inputEnd < 0) {
    throw new Error('Unexpected list feedback preimage');
  }
  source = source.slice(0, skeletonStart) + source.slice(skeletonEnd);
  const refreshedInputStart = source.indexOf(" input.addEventListener('input', function () {");
  const refreshedInputEnd = source.indexOf("\n clear.addEventListener('click'", refreshedInputStart);
  source = source.slice(0, refreshedInputStart)
    + " input.addEventListener('input', function () {\n"
    + " searchTerm = input.value.trim();\n"
    + " clear.classList.toggle('hidden', searchTerm.length === 0);\n"
    + " applyFilter();\n"
    + " syncUrl();\n"
    + " });"
    + source.slice(refreshedInputEnd);
  return source.replace('\n let timer;', '');
}
const articlesListJs = [
  '/* Necessary difference for articles.html only. */',
  removeFakeListWait(listRuntime.slice(listStart, listEnd)).trim(),
  'applyFilter();',
].join('\n');

write('site-system.css', sharedCss);
write('site-system.js', sharedJs);
write('articles-list.js', articlesListJs);

function addSystemLink(html) {
  if (html.includes('href="site-system.css"')) return html;
  return html.replace('<link rel="stylesheet" href="tailwind.css">', '<link rel="stylesheet" href="tailwind.css"><link rel="stylesheet" href="site-system.css">');
}

function setTemplate(html, template) {
  if (/\bdata-secondary-template=/.test(html)) return html;
  return html.replace(/<body\b/, '<body data-secondary-template="' + template + '"');
}

function meaningfulAlts(html) {
  return html.replace(/<img([^>]*?)alt=""([^>]*)>/g, function (match, before, after, offset) {
    var prefix = html.slice(0, offset);
    var headings = Array.from(prefix.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g));
    var heading = headings.length ? stripTags(headings[headings.length - 1][1]) : stripTags(html.match(/<title>(.*?)<\/title>/)?.[1] ?? '正文配图');
    return '<img' + before + 'alt="配图：' + escapeAttr(heading) + '"' + after + '>';
  });
}

function localImageSize(src) {
  if (/^(?:data:|https?:|\/\/)/.test(src)) return null;
  const path = join(root, src.replaceAll('/', '\\'));
  if (!existsSync(path)) return null;
  const data = readFileSync(path);
  if (data.length >= 24 && data.toString('ascii', 1, 4) === 'PNG') {
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }
  if (data.length >= 4 && data[0] === 0xff && data[1] === 0xd8) {
    var offset = 2;
    while (offset + 9 < data.length) {
      if (data[offset] !== 0xff) { offset += 1; continue; }
      var marker = data[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
      }
      var length = data.readUInt16BE(offset + 2);
      if (!length) break;
      offset += length + 2;
    }
  }
  return null;
}

function intrinsicImageDimensions(html) {
  return html.replace(/<img\b([^>]*?)>/g, function (match, attributes) {
    if (/\bwidth=/.test(attributes) && /\bheight=/.test(attributes)) return match;
    var src = attributes.match(/\bsrc="([^"]+)"/)?.[1];
    var size = src ? localImageSize(src) : null;
    return size ? '<img width="' + size.width + '" height="' + size.height + '"' + attributes + '>' : match;
  });
}

function fixBrokenArticleWrapper(html, name) {
  if (!['article-divergence.html', 'article-review.html'].includes(name)) return html;
  var marker = '</div></div><!-- ===================== 作者 / 上一篇下一篇 ===================== -->';
  if (!html.includes(marker)) throw new Error(name + ': broken-wrapper marker drifted');
  html = html.replace(marker, '</div><!-- ===================== 作者 / 上一篇下一篇 ===================== -->');
  var end = '</article><!-- ===================== 下载 App';
  if (!html.includes(end)) throw new Error(name + ': article closing marker drifted');
  return html.replace(end, '</div></article><!-- ===================== 下载 App');
}

for (const name of pages) {
  var html = read(name);
  var scripts = scriptsOf(html);
  if (scripts.length !== 3) throw new Error(name + ': expected exactly three inline scripts');
  var second = scripts[1][1];
  var extras = '';
  if (name !== 'articles.html') {
    extras = pageSpecificRuntime(second, name);
  }
  html = html.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="site-system.css">');
  html = setTemplate(html, listPages.includes(name) ? 'list' : longform.includes(name) ? 'longform' : 'article');
  html = fixBrokenArticleWrapper(html, name);
  if (/^research-[1-5]\.html$/.test(name)) html = meaningfulAlts(html);
  html = intrinsicImageDimensions(html);
  html = html.replace(scripts[1][0], '').replace(scripts[2][0], '');
  var runtimeTags = '<script src="site-system.js"></script>';
  if (name === 'articles.html') runtimeTags += '<script src="articles-list.js"></script>';
  if (extras) runtimeTags += '<script>\n' + extras + '\n</script>';
  html = html.replace('</body>', runtimeTags + '</body>');
  write(name, html);
}

var migratedIndex = addSystemLink(indexHtml);
migratedIndex = migratedIndex.replace(/<style>[\s\S]*?<\/style>/, '<style>' + indexPageCss + '</style>');
migratedIndex = intrinsicImageDimensions(migratedIndex);
write('index.html', migratedIndex);

console.log(JSON.stringify({
  pages: pages.length,
  standard: standard.length,
  longform: longform.length,
  list: listPages.length,
  outputs: ['site-system.css', 'site-system.js', 'articles-list.js'],
  sharedCssHash: hash(sharedCss),
  sharedJsHash: hash(sharedJs),
}, null, 2));
