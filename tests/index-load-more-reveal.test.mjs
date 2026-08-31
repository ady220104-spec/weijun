import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sharedCss = readFileSync(new URL('../site-system.css', import.meta.url), 'utf8');
const source = [indexSource, sharedCss].join('\n');
const portrait = readFileSync(new URL('../images/pan-weijun-portrait.png', import.meta.url));

test('dynamically appended article cards join the shared reveal observer', () => {
  assert.match(source, /function observeReveal\(el\)\s*{[\s\S]*?io\.observe\(el\)/);
  assert.match(
    source,
    /articlesGrid\.appendChild\(card\);\s*observeReveal\(card\);/,
  );
});

test('load more does not fake network latency', () => {
  assert.doesNotMatch(source, /function renderSkeletons\(/);
  assert.match(
    source,
    /moreBtn\.addEventListener\('click',[\s\S]*?loadMoreArticles\(\);[\s\S]*?\}\);/,
  );
});

test('article filtering settles quickly without replaying reveal motion', () => {
  assert.match(source, /setTimeout\(function \(\) \{ updateArticles\(true\); \}, 80\)/);
  assert.match(source, /\.article-card\.filter-settled \{ animation: none !important; \}/);
});

test('mobile menu grows from its top-right trigger', () => {
  assert.match(source, /\.mobile-menu \{ transform-origin: top right;/);
});

test('transitions enumerate the properties they animate', () => {
  assert.doesNotMatch(source, /transition:\s*all\b/);
  assert.doesNotMatch(source, /\btransition-all\b/);
});

test('article library promotes the first visible result into the lead story', () => {
  assert.match(source, /visibleCards\[0\]\.classList\.add\('article-card--lead'\)/);
  assert.match(source, /#articles-grid \.article-card--lead \{/);
  assert.match(source, /#articles-grid \{ grid-template-columns: minmax\(0, 1fr\); gap: 16px; \}/);
});

test('about section uses the user-provided unmodified portrait', () => {
  assert.match(source, /images\/pan-weijun-portrait\.png/);
  assert.equal(
    createHash('sha256').update(portrait).digest('hex').toUpperCase(),
    '8BC761C0819F090319FE985951FE7AC698DC91FDEF1C20C31793CD42968C274F',
  );
});

test('results section prioritizes the real holdings screenshot', () => {
  assert.doesNotMatch(source, /策略净值 回测演示/);
  assert.doesNotMatch(source, /max-h-\[360px\]/);
  assert.match(source, /images\/returns-2026\.jpeg/);
  assert.match(source, /class="mt-4 block h-auto w-full/);
});

test('Emil motion tokens and compact hero timing are installed', () => {
  assert.match(source, /--ease-out: cubic-bezier\(0\.23, 1, 0\.32, 1\)/);
  assert.match(source, /--duration-press: 160ms/);
  assert.match(source, /--duration-enter: 250ms/);
  assert.match(source, /animation-delay:\.2s/);
  assert.match(source, /animation-delay:\.28s/);
  assert.doesNotMatch(source, /word-char|@keyframes word-in/);
});

test('decorative infinite and pointer-driven motion are removed', () => {
  assert.doesNotMatch(source, /animation:\s*bounce-down|@keyframes bounce-down/);
  assert.doesNotMatch(source, /hero-glow|glow\.style\.(left|top)/);
  assert.doesNotMatch(source, /animate-pulse/);
});

test('hover motion and reduced motion follow pointer and accessibility rules', () => {
  assert.match(source, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(source, /@media \(hover: none\), \(pointer: coarse\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(source, /\*, \*::before, \*::after \{ animation: none/);
  assert.match(source, /\.mobile-menu, \.dialog, #toast \{ transform: none !important/);
});

test('menu, modal, and toast handle keyboard, exit, and interruption states', () => {
  assert.match(source, /var pointerActivated = new WeakSet\(\)/);
  assert.match(source, /if \(consumePointer\(menuBtn\)\) toggleMenu\(\)/);
  assert.match(source, /openSubscribe\(!consumePointer\(b\)\)/);
  assert.match(source, /\.dialog\.is-closing/);
  assert.match(source, /subCloseTimer = setTimeout/);
  assert.match(source, /document\.addEventListener\('visibilitychange'/);
  assert.match(source, /#toast\.show[\s\S]*transition-duration: var\(--duration-enter\)/);
});
