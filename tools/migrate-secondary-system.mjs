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

const customCss = String.raw`/* ===================== Canonical shared site system ===================== */
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
body[data-secondary-template="list"] #focus .text-muted-foreground\/70 {
  color: hsl(var(--muted-foreground));
}

/* ===================== Dedicated article archive ===================== */
.archive-header {
  position: fixed; inset: 0 0 auto; z-index: 60;
  border-bottom: 1px solid hsl(var(--border));
  background: hsl(var(--background) / .94);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.archive-header-inner {
  width: min(100% - 2rem, 72rem); height: 4rem; margin-inline: auto;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
}
.archive-brand { justify-self: start; font-family: "Songti SC", "Noto Serif CJK SC", serif; font-weight: 700; }
.archive-desktop-nav { display: flex; align-items: center; gap: 2rem; font-size: .875rem; }
.archive-desktop-nav a { color: hsl(var(--muted-foreground)); transition: color 150ms ease; }
.archive-desktop-nav a[aria-current="page"], .archive-desktop-nav a:hover { color: hsl(var(--foreground)); }
.archive-header-actions { justify-self: end; display: flex; align-items: center; gap: .75rem; }
.archive-mobile-menu { border-top: 1px solid hsl(var(--border)); padding: .5rem 1rem .875rem; }
.archive-mobile-menu nav { display: grid; }
.archive-mobile-menu a { min-height: 44px; display: flex; align-items: center; border-radius: .5rem; padding-inline: .75rem; }
.archive-main { padding-top: 4rem; }

.archive-hero { border-bottom: 1px solid hsl(var(--border)); }
.archive-hero-inner {
  width: min(100% - 3rem, 72rem); margin-inline: auto; padding-block: clamp(4.5rem, 8vw, 7.5rem);
  display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(18rem, .65fr); gap: clamp(3rem, 8vw, 7rem); align-items: end;
}
.archive-breadcrumb { display: flex; align-items: center; gap: .5rem; color: hsl(var(--muted-foreground)); font-size: .8125rem; }
.archive-breadcrumb a { transition: color 150ms ease; }
.archive-breadcrumb a:hover { color: hsl(var(--foreground)); }
.archive-heading h1 {
  max-width: 12ch; margin-top: 1.75rem; font-size: clamp(3.5rem, 6.5vw, 6rem);
  font-weight: 800; letter-spacing: -.035em !important; line-height: 1.05 !important;
}
.archive-heading > p { max-width: 40rem; margin-top: 1.75rem; color: hsl(var(--muted-foreground)); font-size: 1.0625rem; line-height: 1.8; }
.archive-guide { padding-block: 1.5rem; border-block: 1px solid hsl(var(--border)); }
.archive-guide h2 { font-size: 1.25rem; font-weight: 700; }
.archive-guide p { margin-top: .875rem; color: hsl(var(--muted-foreground)); font-size: .9375rem; line-height: 1.75; }
.archive-guide a {
  margin-top: 1.25rem; display: inline-flex; align-items: center; gap: .5rem;
  color: hsl(var(--primary)); font-size: .875rem; font-weight: 650;
  transition: color 150ms ease, gap 160ms var(--ease-out);
}
.archive-guide a svg { width: 1rem; height: 1rem; }

.archive-library { background: #f5f3ec; scroll-margin-top: 4rem; }
.archive-library-inner { width: min(100% - 3rem, 72rem); margin-inline: auto; padding-block: clamp(4rem, 7vw, 6.5rem); }
.archive-library-head { display: flex; align-items: end; justify-content: space-between; gap: 2rem; }
.archive-library-head h2 { font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 750; letter-spacing: -.025em !important; }
#result-count { margin-top: .65rem; color: hsl(var(--muted-foreground)); font-size: .875rem; }
.archive-search { position: relative; width: min(100%, 23rem); }
.archive-search > svg {
  position: absolute; left: 0; top: 50%; width: 1rem; height: 1rem;
  color: hsl(var(--muted-foreground)); transform: translateY(-50%); pointer-events: none;
}
.archive-search input {
  width: 100%; min-height: 48px; padding: .75rem 2.5rem .75rem 1.75rem;
  border: 0; border-bottom: 1px solid hsl(var(--input)); border-radius: 0;
  background: transparent; color: hsl(var(--foreground)); outline: none;
  transition: border-color 150ms ease;
}
.archive-search input:focus { border-bottom-color: hsl(var(--foreground)); }
.archive-search input::placeholder { color: hsl(var(--muted-foreground)); }
.archive-search button {
  position: absolute; right: 0; top: 50%; width: 44px; height: 44px;
  display: grid; place-items: center; transform: translateY(-50%); border-radius: 999px;
}
.archive-search button.hidden { display: none; }
.archive-search button svg { width: 1rem; height: 1rem; }
.archive-tabs {
  margin-top: 2.5rem; display: flex; align-items: center; gap: 1.75rem;
  overflow-x: auto; border-bottom: 1px solid hsl(var(--border)); scrollbar-width: none;
}
.archive-tabs::-webkit-scrollbar { display: none; }
.archive-tabs .tab {
  position: relative; min-height: 48px; flex: 0 0 auto; padding: 0;
  border: 0; border-radius: 0; background: transparent; box-shadow: none;
  color: hsl(var(--muted-foreground)); font-size: .875rem; font-weight: 600;
  transition: color 150ms ease;
}
.archive-tabs .tab::after {
  content: ""; position: absolute; inset: auto 0 -1px; height: 2px;
  background: hsl(var(--primary)); transform: scaleX(0); transform-origin: center;
  transition: transform 180ms var(--ease-out);
}
.archive-tabs .tab[data-active="true"] { color: hsl(var(--foreground)); }
.archive-tabs .tab[data-active="true"]::after { transform: scaleX(1); }
.archive-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(2rem, 5vw, 4.5rem); margin-top: 2.5rem;
}
.archive-featured {
  grid-column: 1 / -1; margin-bottom: 1rem; padding: clamp(2rem, 5vw, 4.25rem);
  display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); column-gap: clamp(2rem, 7vw, 6rem);
  border-radius: 1rem; background: #1d1d1f; color: #fff;
}
.archive-featured > div:first-child, .archive-featured > h3 { grid-column: 1; }
.archive-featured > h3 { align-self: center; margin-top: 1.25rem; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.14 !important; }
.archive-featured > p, .archive-featured > div:last-child { grid-column: 2; }
.archive-featured > p { align-self: end; margin-top: 0; color: rgba(255,255,255,.72); font-size: 1rem; line-height: 1.85; }
.archive-featured > div:first-child span:first-child, .archive-featured a { color: hsl(12 72% 80%); }
.archive-featured > div:first-child span:last-child, .archive-featured > div:last-child span { color: rgba(255,255,255,.60); }
.archive-featured > div:last-child { align-self: end; padding-top: 2rem; }
.archive-entry {
  min-height: 18rem; padding-block: 2rem; display: flex; flex-direction: column;
  border-top: 1px solid hsl(var(--border));
}
.archive-entry h3 { font-size: 1.125rem; line-height: 1.5 !important; }
.archive-entry p { max-width: 34rem; }
.archive-entry a { text-underline-offset: .22em; }
.archive-empty { padding: 5rem 1rem; text-align: center; }
.archive-empty > svg { width: 1.5rem; height: 1.5rem; margin-inline: auto; color: hsl(var(--muted-foreground)); }
.archive-empty h3 { margin-top: 1rem; font-size: 1.25rem; }
.archive-empty p { margin-top: .5rem; color: hsl(var(--muted-foreground)); }
.archive-empty .btn { margin-top: 1.5rem; }

.archive-author { background: #1d1d1f; color: #fff; }
.archive-author-inner {
  width: min(100% - 3rem, 72rem); margin-inline: auto; padding-block: 3.5rem;
  display: flex; align-items: center; justify-content: space-between; gap: 3rem;
}
.archive-author h2 { font-size: 1.75rem; }
.archive-author p { max-width: 42rem; margin-top: .65rem; color: rgba(255,255,255,.66); line-height: 1.75; }
.archive-author-links { display: flex; flex-wrap: wrap; justify-content: end; gap: 1.5rem; }
.archive-author-links a { color: hsl(12 72% 80%); font-size: .875rem; font-weight: 650; }
.archive-footer { border-top: 1px solid hsl(var(--border)); padding: 2.5rem 1.5rem; }
.archive-footer-inner {
  width: min(100%, 72rem); margin-inline: auto; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 2rem;
}
.archive-footer-inner > div { display: grid; gap: .2rem; }
.archive-footer-inner span, .archive-footer-inner p, .archive-footer nav { color: hsl(var(--muted-foreground)); font-size: .75rem; }
.archive-footer nav { display: flex; gap: 1.5rem; }
.archive-footer-inner > p { justify-self: end; }
.archive-disclaimer { max-width: 52rem; margin: 1.5rem auto 0; color: hsl(var(--muted-foreground)); font-size: .75rem; line-height: 1.7; text-align: center; }

@media (hover: hover) and (pointer: fine) {
  .archive-guide a:hover { gap: .75rem; color: hsl(var(--foreground)); }
  .archive-entry h3 a:hover { text-decoration: underline; }
  .archive-tabs .tab:hover { color: hsl(var(--foreground)); }
}

@media (max-width: 767px) {
  .archive-header-inner { width: min(100% - 2rem, 72rem); grid-template-columns: 1fr auto; }
  .archive-desktop-nav { display: none; }
  .archive-header-actions { grid-column: 2; }
  .archive-hero-inner { width: min(100% - 2rem, 72rem); padding-block: 3.5rem 4rem; grid-template-columns: 1fr; gap: 2.75rem; }
  .archive-heading h1 { margin-top: 1.5rem; font-size: clamp(2.75rem, 14vw, 4rem); }
  .archive-heading > p { margin-top: 1.25rem; font-size: 1rem; }
  .archive-guide { padding-block: 1.25rem; }
  .archive-library-inner { width: min(100% - 2rem, 72rem); padding-block: 3.5rem; }
  .archive-library-head { display: grid; gap: 1.75rem; }
  .archive-search { width: 100%; }
  .archive-tabs { margin-top: 1.5rem; gap: 1.5rem; }
  .archive-grid { grid-template-columns: minmax(0, 1fr); margin-top: 2rem; }
  .archive-featured { display: flex; flex-direction: column; padding: 2rem 1.5rem; }
  .archive-featured > h3 { margin-top: 1.25rem; font-size: 2rem; }
  .archive-featured > p { margin-top: 1.25rem; }
  .archive-featured > div:last-child { padding-top: 1.75rem; }
  .archive-entry { min-height: 0; padding-block: 1.75rem; }
  .archive-author-inner { width: min(100% - 2rem, 72rem); padding-block: 3rem; display: grid; gap: 2rem; }
  .archive-author-links { justify-content: start; }
  .archive-footer-inner { grid-template-columns: 1fr; justify-items: center; text-align: center; gap: 1.5rem; }
  .archive-footer-inner > p { justify-self: center; }
  .archive-footer nav { flex-wrap: wrap; justify-content: center; }
}

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

/* ===================== Inner-page editorial reading system ===================== */
html.js body[data-secondary-template] .reveal,
html.js body[data-secondary-template] .reveal.in {
  opacity: 1;
  transform: none;
  animation: none;
}

body[data-secondary-template] main > header.border-b > .max-w-3xl {
  width: min(100%, 50rem);
  max-width: 50rem;
  padding-top: 3rem;
  padding-bottom: 3.5rem;
}
body[data-secondary-template] main > header h1 {
  max-width: 19ch;
  font-size: clamp(2.25rem, 4vw, 3.25rem);
  letter-spacing: -.018em !important;
  line-height: 1.16 !important;
}
body[data-secondary-template] main > header h1 + p {
  max-width: 43rem;
  font-size: 1.0625rem;
  line-height: 1.8;
}

body[data-secondary-template="article"] article.prose > .max-w-3xl,
body[data-secondary-template="longform"] article.prose > .max-w-3xl {
  width: min(100%, 50rem);
  max-width: 50rem;
  padding-top: 3.25rem;
  padding-bottom: 5rem;
}
body[data-secondary-template] article.prose p:not([class*="text-"]),
body[data-secondary-template] article.prose li:not([class*="text-"]) {
  font-size: 1.0625rem;
  line-height: 1.85;
}
body[data-secondary-template] article.prose blockquote {
  margin-block: 1.75rem;
  padding: .15rem 0 .15rem 1.125rem;
  color: hsl(var(--foreground) / .72);
  font-size: 1rem;
  line-height: 1.8;
}
body[data-secondary-template] article.prose h2 {
  scroll-margin-top: 7.5rem;
  margin-top: 4rem;
  margin-bottom: 1.25rem;
  padding-top: 2.25rem;
  border-top: 1px solid hsl(var(--border));
  font-size: clamp(1.55rem, 2.5vw, 1.85rem);
  letter-spacing: -.012em !important;
  line-height: 1.32 !important;
}
body[data-secondary-template] article.prose section > h2:first-child {
  margin-top: 0;
}
body[data-secondary-template] article.prose h3 {
  scroll-margin-top: 7.5rem;
  margin-top: 2.75rem;
  margin-bottom: .875rem;
  font-size: 1.1875rem;
  line-height: 1.45 !important;
}
body[data-secondary-template] article.prose .space-y-8 > section + section {
  margin-top: 4rem;
}
body[data-secondary-template] article.prose figure {
  margin-block: 2.25rem;
}
body[data-secondary-template] article.prose figure img,
body[data-secondary-template] article.prose figure svg {
  border-radius: .625rem;
}
body[data-secondary-template] article.prose figcaption {
  margin-top: .75rem;
  color: hsl(var(--muted-foreground));
  font-size: .8125rem;
  line-height: 1.65;
}
body[data-secondary-template] article.prose .card {
  border-color: hsl(var(--border));
  box-shadow: 0 12px 32px -28px rgba(24,20,16,.28);
}
body[data-secondary-template] article.prose table {
  font-variant-numeric: tabular-nums;
}
body[data-secondary-template] article.prose th,
body[data-secondary-template] article.prose td {
  padding-top: .75rem;
  padding-bottom: .75rem;
  line-height: 1.55;
}
body[data-secondary-template] article.prose pre {
  margin-block: 1.75rem;
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
}

/* Long-form table of contents and current-location affordance. */
.longform-toc {
  position: sticky; top: 4rem; z-index: 45; margin: 0; width: 100%;
  border: 0; border-bottom: 1px solid hsl(var(--border)); border-radius: 0;
  background: hsl(var(--background) / .96); box-shadow: 0 10px 28px -28px rgba(20,15,10,.45);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
}
.longform-toc summary {
  min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: .75rem max(1rem, calc((100vw - 50rem) / 2)); cursor: pointer; font-weight: 650; list-style: none;
}
.longform-toc summary::-webkit-details-marker { display: none; }
.longform-location {
  max-width: 62%; overflow: hidden; color: hsl(var(--primary)); font-size: .8125rem; font-weight: 600;
  text-overflow: ellipsis; white-space: nowrap;
}
.longform-toc nav {
  display: grid; gap: .125rem; max-height: min(56vh, 28rem); overflow: auto;
  padding: .25rem max(1rem, calc((100vw - 50rem) / 2)) .875rem;
}
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
    position: fixed; top: 6rem; right: max(1.25rem, calc((100vw - 86rem) / 2));
    width: 13.5rem; max-height: calc(100vh - 7.25rem); overflow: auto; margin: 0;
    padding-left: .875rem; border: 0; border-left: 1px solid hsl(var(--border));
    background: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none;
  }
  .longform-toc summary {
    min-height: 0; display: block; padding: 0 0 .75rem; cursor: default;
    border-bottom: 1px solid hsl(var(--border));
  }
  .longform-location { display: block; max-width: 100%; margin-top: .4rem; }
  .longform-toc nav { max-height: none; overflow: visible; padding: .5rem 0 0; }
  .longform-toc a { min-height: 38px; padding: .35rem .5rem; font-size: .8125rem; }
}

@media (max-width: 767px) {
  body[data-secondary-template] main > header.border-b > .max-w-3xl {
    padding-top: 2.25rem;
    padding-bottom: 2.75rem;
  }
  body[data-secondary-template] main > header h1 {
    max-width: none;
    font-size: 2rem;
    line-height: 1.22 !important;
  }
  body[data-secondary-template] main > header h1 + p {
    font-size: 1rem;
    line-height: 1.75;
  }
  body[data-secondary-template="article"] article.prose > .max-w-3xl,
  body[data-secondary-template="longform"] article.prose > .max-w-3xl {
    padding-top: 2.5rem;
    padding-bottom: 4rem;
  }
  body[data-secondary-template] article.prose p:not([class*="text-"]),
  body[data-secondary-template] article.prose li:not([class*="text-"]) {
    font-size: 1rem;
    line-height: 1.82;
  }
  body[data-secondary-template] article.prose h2 {
    margin-top: 3.25rem;
    padding-top: 1.75rem;
    font-size: 1.4rem;
  }
  body[data-secondary-template] article.prose h3 {
    margin-top: 2.25rem;
    font-size: 1.0625rem;
  }
  body[data-secondary-template] article.prose .space-y-8 > section + section { margin-top: 3.25rem; }
  body[data-secondary-template] article.prose figure { margin-block: 1.75rem; }
  body[data-secondary-template] article.prose th,
  body[data-secondary-template] article.prose td { padding: .7rem .65rem; }
  body[data-secondary-template] article.prose .overflow-x-auto > table {
    min-width: 44rem;
  }
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
}`;

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

// ===== Inner pages are reading surfaces: content is visible without scroll choreography =====
(function () {
  if (!document.body.dataset.secondaryTemplate) return;
  Array.prototype.slice.call(document.querySelectorAll('.reveal')).forEach(function (element) {
    element.classList.add('in');
  });
})();

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
  var desktopToc = window.matchMedia('(min-width: 1180px)');
  details.open = desktopToc.matches;
  details.innerHTML = '<summary><span>本页目录</span><span class="longform-location">当前：' + headings[0].textContent.trim() + '</span></summary>'
    + '<nav aria-label="长文目录">' + headings.map(function (heading) {
      return '<a href="#' + heading.id + '">' + heading.textContent.trim() + '</a>';
    }).join('') + '</nav>';
  article.parentNode.insertBefore(details, article);
  var links = Array.prototype.slice.call(details.querySelectorAll('a'));
  var location = details.querySelector('.longform-location');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      if (!desktopToc.matches) details.open = false;
    });
  });
  var syncTocMode = function (event) { details.open = event.matches; };
  if (desktopToc.addEventListener) desktopToc.addEventListener('change', syncTocMode);
  else if (desktopToc.addListener) desktopToc.addListener(syncTocMode);
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
function applyArchiveListLayout(source) {
  return removeFakeListWait(source)
    .replace('card card-hover p-7 sm:p-8 flex flex-col sm:col-span-2 lg:col-span-2 lg:row-span-2', 'archive-featured')
    .replace('card card-hover p-6 flex flex-col', 'archive-entry')
    .replace(/\n\s*grid\.classList\.remove\('grid-fade'\);\n\s*void grid\.offsetWidth;\n\s*grid\.classList\.add\('grid-fade'\);/, '');
}
const articlesListJs = [
  '/* Necessary difference for articles.html only. */',
  applyArchiveListLayout(listRuntime.slice(listStart, listEnd)).trim(),
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
