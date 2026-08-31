async (page) => {
  const baseUrl = 'http://127.0.0.1:4173/index.html';
  const results = [];
  for (const viewport of ['desktop', 'mobile']) {
    const mobile = viewport === 'mobile';
    await page.setViewportSize({ width: mobile ? 390 : 1440, height: mobile ? 844 : 1000 });
    const consoleMessages = [];
    const network5xx = [];
    const failedRequests = [];
    page.removeAllListeners('console');
    page.removeAllListeners('response');
    page.removeAllListeners('requestfailed');
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') consoleMessages.push({ type: message.type(), text: message.text() });
    });
    page.on('response', (response) => {
      if (response.status() >= 500) network5xx.push({ status: response.status(), url: response.url() });
    });
    page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? 'unknown' }));

    await page.goto(baseUrl + '?audit=' + Date.now(), { waitUntil: 'networkidle' });
    await page.waitForTimeout(120);
    await page.screenshot({ path: `output/playwright/home-${viewport}-before.jpg`, type: 'jpeg', quality: 60 });
    const interactions = [];

    if (mobile) {
      await page.locator('#menu-btn').click();
      const opened = (await page.locator('#menu-btn').getAttribute('aria-expanded')) === 'true';
      await page.keyboard.press('Escape');
      await page.waitForTimeout(220);
      const closed = (await page.locator('#menu-btn').getAttribute('aria-expanded')) === 'false';
      interactions.push({ id: 'mobile-menu', pass: opened && closed });
    }

    const initialCards = await page.locator('#articles-grid .article-card').count();
    const more = page.locator('#load-more-btn');
    if (await more.isVisible()) {
      await more.click();
      await page.waitForTimeout(50);
      interactions.push({ id: 'load-more', pass: (await page.locator('#articles-grid .article-card').count()) > initialCards });
    }
    const search = page.locator('#article-search');
    await search.fill('止损');
    await page.waitForTimeout(120);
    const visibleAfterSearch = await page.locator('#articles-grid .article-card:visible').count();
    interactions.push({ id: 'article-search', pass: visibleAfterSearch > 0 && visibleAfterSearch < (await page.locator('#articles-grid .article-card').count()) });
    await search.fill('');
    await page.waitForTimeout(120);

    const subscribe = page.locator(mobile ? '#subscribe-btn-mobile' : '#subscribe-btn');
    if (mobile) await page.locator('#menu-btn').click();
    await subscribe.click();
    const dialogOpened = await page.locator('#subscribe-dialog').evaluate((dialog) => dialog.open);
    await page.locator('[data-close-dialog]').click();
    await page.waitForTimeout(220);
    const dialogClosed = !(await page.locator('#subscribe-dialog').evaluate((dialog) => dialog.open));
    interactions.push({ id: 'subscribe-dialog', pass: dialogOpened && dialogClosed });

    await page.evaluate(async () => {
      for (let y = 0; y <= document.documentElement.scrollHeight - innerHeight; y += Math.max(560, innerHeight * 0.75)) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 12));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(100);

    const diagnostics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource').filter((entry) => !entry.name.includes('axe-core'));
      return {
        overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        brokenImages: Array.from(document.images).filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        performance: {
          lcp: window.__gp158Vitals?.lcp ?? 0,
          cls: window.__gp158Vitals?.cls ?? 0,
          inp: window.__gp158Vitals?.inp ?? 0,
          load: navigation?.loadEventEnd ?? 0,
          transferBytes: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), navigation?.transferSize || 0),
        },
      };
    });
    await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.10.3/axe.min.js' });
    const axe = await page.evaluate(async () => {
      const report = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
      return report.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
        targets: violation.nodes.slice(0, 8).map((node) => node.target),
      }));
    });
    await page.screenshot({ path: `output/playwright/home-${viewport}-after.jpg`, type: 'jpeg', quality: 60 });
    const serious = axe.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
    const performancePass = diagnostics.performance.lcp <= 2500
      && diagnostics.performance.cls <= 0.1
      && (diagnostics.performance.inp === 0 || diagnostics.performance.inp <= 200)
      && diagnostics.performance.load <= 1500
      && diagnostics.performance.transferBytes <= 2 * 1024 * 1024;
    results.push({
      viewport,
      pass: interactions.every((item) => item.pass)
        && consoleMessages.length === 0
        && network5xx.length === 0
        && failedRequests.length === 0
        && diagnostics.overflowPx === 0
        && diagnostics.brokenImages.length === 0
        && serious.length === 0
        && performancePass,
      interactions,
      diagnostics,
      axe,
      consoleMessages,
      network5xx,
      failedRequests,
    });
  }
  return { generatedAt: new Date().toISOString(), passed: results.filter((result) => result.pass).length, failed: results.filter((result) => !result.pass).length, results };
}
