/* Canonical runtime for all secondary pages. */

 // ===== 移动端菜单 =====
 (function () {
 const btn = document.getElementById('menu-btn');
 const menu = document.getElementById('mobile-menu');
 if (!btn || !menu) return;
 function closeMenu(restoreFocus) {
 menu.classList.add('hidden');
 btn.setAttribute('aria-expanded', 'false');
 if (restoreFocus) btn.focus();
 }
 btn.addEventListener('click', function () {
 const open = menu.classList.toggle('hidden') === false;
 btn.setAttribute('aria-expanded', String(open));
 // 打开时焦点移入菜单 方便键盘用户直接导航
 if (open) {
 const first = menu.querySelector('a');
 if (first) first.focus();
 }
 });
 menu.querySelectorAll('.mobile-link').forEach(function (a) {
 a.addEventListener('click', function () {
 closeMenu(false);
 });
 });
 // Esc 关闭菜单并归还焦点到按钮
 document.addEventListener('keydown', function (e) {
 if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
 closeMenu(true);
 }
 });
 })();

 // ===== Toast 系统 =====
 const Toast = (function () {
 const container = document.getElementById('toast-container');
 const icons = {
 success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
 error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
 default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
 };
 const colors = {
 success: 'hsl(var(--success))',
 error: 'hsl(var(--destructive))',
 default: 'hsl(var(--primary))',
 };
 function show(message, type) {
 type = type || 'default';
 const el = document.createElement('div');
 el.className = 'toast';
 el.innerHTML =
 '<span class="toast-icon" style="color:' + colors[type] + '">' + icons[type] + '</span>' +
 '<div class="flex-1 text-sm leading-[1.6] pt-0.5">' + message + '</div>' +
 '<button class="toast-close text-muted-foreground hover:text-foreground transition-colors" aria-label="关闭" style="background:none;border:none;cursor:pointer;margin-top:2px"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
 container.appendChild(el);
 const remove = function () {
 el.classList.add('leaving');
 setTimeout(function () { el.remove(); }, 200);
 };
 el.querySelector('.toast-close').addEventListener('click', remove);
 setTimeout(remove, 4000);
 }
 return { show: show };
 })();

 // 下载按钮已改为直接跳转（App Store / 安卓 APK） 无需 JS 脚本

 // ===== 入场动效 =====
 (function () {
 const revealEls = document.querySelectorAll('.reveal');
 if (!('IntersectionObserver' in window)) {
 revealEls.forEach(function (el) { el.classList.add('in'); });
 return;
 }
 const io = new IntersectionObserver(function (entries) {
 entries.forEach(function (e) {
 if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
 });
 }, { threshold: 0, rootMargin: '0px 0px -10px 0px' });
 revealEls.forEach(function (el) { io.observe(el); });
 })();
 // ===== 智能下载 自动识别平台 =====
 // iOS 用 itms-apps 协议即时唤起 App Store 3 秒未唤起则回落 App Store 网页
 // 安卓 直接下载 APK 安装包（国内安卓标准方式）
 // 微信内 无法直接下载 提示用系统浏览器打开
 // 桌面 无法安装 滚动到下载模块并提示在手机上打开
 (function () {
 var APPLE = 'https://apps.apple.com/cn/app/id6789065192';
 var APPLE_APP = 'itms-apps://apps.apple.com/cn/app/id6789065192';
 var APK = 'https://www.tongyuesyt.com/predownload/tongyuesyt.apk';
 var ua = navigator.userAgent;
 var isWechat = /MicroMessenger/i.test(ua);
 var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 var isAndroid = /Android/.test(ua);
 var iosFallback = null;
 // App Store 唤起后页面隐藏 清理回落定时器 避免来回跳
 document.addEventListener('visibilitychange', function () {
 if (iosFallback) { clearTimeout(iosFallback); iosFallback = null; }
 });
 function scrollToDownload() {
 var d = document.getElementById('download');
 if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' });
 }
 function lockBtn(el) {
  el.classList.add('btn-loading');
  el.setAttribute('disabled', 'disabled');
  setTimeout(function () {
   el.classList.remove('btn-loading');
   el.removeAttribute('disabled');
  }, 2500);
 }
 document.querySelectorAll('.js-download').forEach(function (el) {
 el.addEventListener('click', function (e) {
 e.preventDefault();
 lockBtn(el);
 if (isWechat) {
 Toast.show('微信内无法下载 请点右上角「在浏览器打开」');
 return;
 }
 if (isAndroid) {
 window.location.href = APK;
 Toast.show('已开始下载 约 172MB 建议 WiFi 下进行');
 } else if (isIOS) {
 Toast.show('即将前往 App Store');
 iosFallback = setTimeout(function () {
 if (!document.hidden) { window.location.href = APPLE; }
 iosFallback = null;
 }, 3000);
 window.location.href = APPLE_APP;
 } else {
 Toast.show('请在手机上打开本页下载 App');
 scrollToDownload();
 }
 });
 });
 })();

 // ===== 阅读进度条 + 回到顶部 =====
 (function () {
 var bar = document.getElementById('reading-progress');
 if (bar) {
 var ticking = false;
 var update = function () {
 var max = document.documentElement.scrollHeight - window.innerHeight;
 bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
 ticking = false;
 };
 window.addEventListener('scroll', function () {
 if (!ticking) { ticking = true; requestAnimationFrame(update); }
 }, { passive: true });
 window.addEventListener('resize', update, { passive: true });
 update();
 }
 var topBtn = document.getElementById('back-top');
 if (topBtn) {
 var toggle = function () { topBtn.classList.toggle('hidden', window.scrollY < 600); };
 window.addEventListener('scroll', toggle, { passive: true });
 topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
 toggle();
 }
 })();



/* reveal 兜底: 快速滚动/锚点跳转/刷新恢复滚动位置时 IO 可能漏触发,
     元素顶部一旦进入过视口即强制显示, 防止内容永久透明 */
  (function () {
    var els = document.querySelectorAll('.reveal:not(.in)');
    function scan() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.classList.contains('in') && el.getBoundingClientRect().top < vh) {
          el.classList.add('in');
        }
      }
    }
    window.addEventListener('scroll', scan, { passive: true });
    window.addEventListener('resize', scan, { passive: true });
    setTimeout(scan, 300);
    setTimeout(scan, 1000);
    scan();
  })();




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
