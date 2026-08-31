async (page) => {
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
  const routes = [...standard, ...longform, 'articles.html'];
  const baseUrl = 'http://127.0.0.1:4173/';
  const evidenceRoot = 'output/playwright/secondary-evidence';
  const results = [];

  await page.addInitScript(() => {
    if (window.__gp158VitalsInstalled) return;
    window.__gp158VitalsInstalled = true;
    window.__gp158Vitals = { lcp: 0, cls: 0, inp: 0 };
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const latest = entries[entries.length - 1];
        if (latest) window.__gp158Vitals.lcp = latest.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__gp158Vitals.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.interactionId) window.__gp158Vitals.inp = Math.max(window.__gp158Vitals.inp, entry.duration);
        }
      }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (error) {
      window.__gp158Vitals.observerError = String(error);
    }
  });

  async function scrollThroughPage() {
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      for (let y = 0; y <= max; y += Math.max(560, innerHeight * 0.75)) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 12));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(60);
  }

  async function checkRoute(route, family, viewport) {
    const mobile = viewport === 'mobile';
    const width = mobile ? 390 : 1440;
    const height = mobile ? 844 : 1000;
    const slug = route.replace('.html', '');
    const consoleMessages = [];
    const network5xx = [];
    const failedRequests = [];
    const interactions = [];

    await page.setViewportSize({ width, height });
    page.removeAllListeners('console');
    page.removeAllListeners('response');
    page.removeAllListeners('requestfailed');
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        consoleMessages.push({ type: message.type(), text: message.text() });
      }
    });
    page.on('response', (response) => {
      if (response.status() >= 500) network5xx.push({ status: response.status(), url: response.url() });
    });
    page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? 'unknown' }));

    try {
      await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);
      const beforePath = `${evidenceRoot}/${slug}-${viewport}-before.jpg`;
      const afterPath = `${evidenceRoot}/${slug}-${viewport}-after.jpg`;
      await page.screenshot({ path: beforePath, type: 'jpeg', quality: 55 });

      if (mobile) {
        const menuButton = page.locator('#menu-btn');
        if (await menuButton.count()) {
          await menuButton.click();
          const menuOpened = await page.locator('#mobile-menu').isVisible();
          await page.keyboard.press('Escape');
          const menuClosed = !(await page.locator('#mobile-menu').isVisible());
          interactions.push({ id: 'mobile-menu', pass: menuOpened && menuClosed });
        }
      } else {
        const menuButton = page.locator('#menu-btn');
        const desktopDownload = page.locator('header .js-download.btn-primary').first();
        interactions.push({
          id: 'desktop-header',
          pass: (!(await menuButton.count()) || !(await menuButton.isVisible()))
            && (!(await desktopDownload.count()) || await desktopDownload.isVisible()),
        });
      }

      if (family === 'article') {
        const tocLink = page.locator('nav[aria-label="本页目录"] a').first();
        const target = await tocLink.getAttribute('href');
        await tocLink.click();
        interactions.push({ id: 'article-section-jump', pass: Boolean(target && page.url().endsWith(target)) });

        const siblingLinks = page.locator('article .mt-8.grid a');
        const siblingCount = await siblingLinks.count();
        const siblingIndex = mobile ? Math.min(1, siblingCount - 1) : 0;
        if (siblingIndex >= 0) {
          const sibling = siblingLinks.nth(siblingIndex);
          const href = await sibling.getAttribute('href');
          await sibling.click();
          await page.waitForLoadState('domcontentloaded');
          interactions.push({
            id: mobile ? 'next-article' : 'previous-article',
            pass: Boolean(href && page.url().endsWith('/' + href)),
          });
          await page.goBack({ waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(50);
        }
      } else if (family === 'longform') {
        const toc = page.locator('.longform-toc');
        await toc.waitFor({ state: 'visible' });
        if (mobile && !(await toc.evaluate((node) => node.open))) await toc.locator('summary').click();
        const links = toc.locator('a');
        const linkCount = await links.count();
        const link = links.nth(mobile ? linkCount - 1 : 0);
        const target = await link.getAttribute('href');
        await link.click();
        interactions.push({ id: mobile ? 'toc-last-section' : 'toc-first-section', pass: Boolean(target && page.url().endsWith(target)) });
      } else {
        const input = page.locator('#search-input');
        const initialCards = await page.locator('#article-grid article').count();
        await input.fill('指标');
        await page.waitForTimeout(30);
        const filteredCards = await page.locator('#article-grid article').count();
        const clear = page.locator('#search-clear');
        const clearVisible = await clear.isVisible();
        const searchGeometry = await input.evaluate((node) => {
          const parent = node.parentElement;
          const icon = parent?.querySelector('svg');
          const clearButton = parent?.querySelector('#search-clear');
          const inputRect = node.getBoundingClientRect();
          const iconRect = icon?.getBoundingClientRect();
          const clearRect = clearButton?.getBoundingClientRect();
          const overlaps = iconRect && clearRect
            ? !(iconRect.right <= clearRect.left || clearRect.right <= iconRect.left || iconRect.bottom <= clearRect.top || clearRect.bottom <= iconRect.top)
            : true;
          return { overlaps, inputWidth: inputRect.width, iconLeft: iconRect?.left ?? null, clearLeft: clearRect?.left ?? null };
        });
        interactions.push({ id: 'search', pass: filteredCards > 0 && filteredCards < initialCards });
        interactions.push({ id: 'search-icons', pass: clearVisible && !searchGeometry.overlaps, detail: searchGeometry });
        await clear.click();
        interactions.push({ id: 'clear-search', pass: (await page.locator('#article-grid article').count()) === initialCards });
        const secondTab = page.locator('#category-tabs .tab').nth(1);
        if (await secondTab.count()) {
          await secondTab.click();
          interactions.push({ id: 'filter-tab', pass: (await secondTab.getAttribute('aria-selected')) === 'true' });
          await page.locator('#category-tabs .tab').first().click();
        }
      }

      await scrollThroughPage();
      const backTop = page.locator('#back-top');
      if (await backTop.count()) {
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(80);
        await backTop.click();
        let reachedTop = false;
        try {
          await page.waitForFunction(() => scrollY < 24, null, { timeout: 2500 });
          reachedTop = true;
        } catch (error) {
          reachedTop = false;
        }
        interactions.push({ id: 'back-to-top', pass: reachedTop });
      }

      const diagnostics = await page.evaluate(() => {
        const images = Array.from(document.images);
        const brokenImages = images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src);
        const tableWrappers = Array.from(document.querySelectorAll('.overflow-x-auto')).filter((wrap) => wrap.querySelector('table'));
        const wideTables = tableWrappers.filter((wrap) => wrap.scrollWidth > wrap.clientWidth + 1);
        const missingTableHints = wideTables.filter((wrap) => !wrap.nextElementSibling?.classList.contains('table-scroll-hint')).length;
        const touchSelectors = '#menu-btn, #search-input, #search-clear, .tab, .longform-toc summary, .longform-toc a, #back-top';
        const undersizedTouchTargets = Array.from(document.querySelectorAll(touchSelectors))
          .filter((node) => {
            const style = getComputedStyle(node);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            const rect = node.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
          })
          .map((node) => ({ tag: node.tagName, id: node.id, className: node.className, rect: node.getBoundingClientRect().toJSON() }));
        const navigation = performance.getEntriesByType('navigation')[0];
        const productResources = performance.getEntriesByType('resource').filter((entry) => !entry.name.includes('axe-core'));
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim() ?? '',
          overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
          brokenImages,
          h2Count: document.querySelectorAll('h2').length,
          tocLinks: document.querySelectorAll('.longform-toc a').length,
          wideTables: wideTables.length,
          missingTableHints,
          undersizedTouchTargets,
          performance: {
            lcp: window.__gp158Vitals?.lcp ?? 0,
            cls: window.__gp158Vitals?.cls ?? 0,
            inp: window.__gp158Vitals?.inp ?? 0,
            domContentLoaded: navigation?.domContentLoadedEventEnd ?? 0,
            load: navigation?.loadEventEnd ?? 0,
            transferBytes: productResources.reduce((sum, entry) => sum + (entry.transferSize || 0), navigation?.transferSize || 0),
          },
        };
      });

      let axe = { critical: 0, serious: 0, moderate: 0, minor: 0, violations: [] };
      try {
        await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.10.3/axe.min.js' });
        axe = await page.evaluate(async () => {
          const report = await window.axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
          });
          const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
          for (const violation of report.violations) counts[violation.impact] = (counts[violation.impact] || 0) + 1;
          return {
            ...counts,
            violations: report.violations.map((violation) => ({
              id: violation.id,
              impact: violation.impact,
              nodes: violation.nodes.length,
              targets: violation.nodes.slice(0, 4).map((node) => node.target),
            })),
          };
        });
      } catch (error) {
        axe = { error: String(error), critical: -1, serious: -1, moderate: -1, minor: -1, violations: [] };
      }

      await page.screenshot({ path: afterPath, type: 'jpeg', quality: 55 });
      const performancePass = diagnostics.performance.lcp <= 2500
        && diagnostics.performance.cls <= 0.1
        && (diagnostics.performance.inp === 0 || diagnostics.performance.inp <= 200)
        && diagnostics.performance.load <= 1500
        && diagnostics.performance.transferBytes <= 2 * 1024 * 1024;
      const pass = consoleMessages.length === 0
        && network5xx.length === 0
        && failedRequests.length === 0
        && diagnostics.overflowPx === 0
        && diagnostics.brokenImages.length === 0
        && diagnostics.missingTableHints === 0
        && (!mobile || diagnostics.undersizedTouchTargets.length === 0)
        && axe.critical === 0
        && axe.serious === 0
        && interactions.every((item) => item.pass)
        && performancePass;
      results.push({ route, family, viewport, pass, interactions, diagnostics, axe, consoleMessages, network5xx, failedRequests, screenshots: [beforePath, afterPath] });
    } catch (error) {
      results.push({ route, family, viewport, pass: false, error: String(error), interactions, consoleMessages, network5xx, failedRequests });
    }
  }

  for (const route of routes) {
    const family = standard.includes(route) ? 'article' : longform.includes(route) ? 'longform' : 'list';
    await checkRoute(route, family, 'desktop');
    await checkRoute(route, family, 'mobile');
  }

  return {
    generatedAt: new Date().toISOString(),
    budgets: { lcpMs: 2500, cls: 0.1, inpMs: 200, loadMs: 1500, transferBytes: 2097152 },
    routes: routes.length,
    runs: results.length,
    passed: results.filter((result) => result.pass).length,
    failed: results.filter((result) => !result.pass).length,
    results,
  };
}
