/* Necessary difference for articles.html only. */
// ===== 文章数据与渲染 =====
 const articles = [ { tag: '战法', date: '2026-09-02', title: '指标武器库 · 九套实战指标体系', excerpt: '天罡竞价选强 趋势猎龙波段 潜龙出海擒妖 涨停回马枪二波 分时魔镜做T 超级版面复盘 九套指标管住从看盘到下单', read: '20 分钟', url: 'indicators.html' },
 { tag: '研报', date: '2026-09-02', title: '跨年妖股备选池 · 四季度到次年一季度的妖股规律', excerpt: '妖股不是赌出来的 是筛出来的 小市值 硬题材 低位横盘 三个条件筛出备选 首板确认 二板定妖 断板离场', read: '12 分钟', url: 'research-9.html' },
 { tag: '研报', date: '2026-09-02', title: '低位潜力牛股名单 · 四季度低位补涨的筛选逻辑', excerpt: '高位的票在补跌 低位的票在蓄力 低价 深跌 小市值三重筛选 等止跌信号再进场', read: '12 分钟', url: 'research-8.html' },
 { tag: '研报', date: '2026-09-02', title: '概念重组预期名单 · 四季度央国企改革与并购重组主线', excerpt: '破净的低价央国企 是四季度重组行情的温床 市值管理考核 专业化整合 保壳转型 三条路径找催化', read: '12 分钟', url: 'research-7.html' },
 { tag: '研报', date: '2026-09-02', title: '2026 四季度算电概念前瞻 · 算力与电力共振的第一波', excerpt: '算力的尽头是电力 数据中心要用电 芯片要用电 散热要用电 四季度冬季用电高峰 算电共振逻辑最顺', read: '12 分钟', url: 'research-6.html' },

 { tag: '战法', date: '2026-09-01', title: '扶摇九天 · 短线五层看盘体系', excerpt: '一层体检 二层定线 三层看K线真相 四层看大盘天气 五层等进攻信号 把看盘变成有顺序的决策链', read: '15 分钟', url: 'strategy.html' },
 { tag: '选股', date: '2026-08-31', title: '短线选股三板斧 题材 量能 位置 三关过完再下手', excerpt: '不是所有涨停都能追 用三个硬条件 把可做与不可做的票分开', read: '12 分钟', url: 'article-stockpick.html' },
 { tag: '指标选股器', date: '2026-08-29', title: '指标选股器 把选股条件写进公式 一屏扫出符合战法的票', excerpt: '告别逐只翻盘 把量价条件固化成可复用的选股指标', read: '11 分钟', url: 'article-indicator.html' },
 { tag: '买卖点', date: '2026-08-27', title: 'A 股分时图看盘 均价线 量价配合与三个关键时点', excerpt: '选股解决买什么 分时图解决什么时候买', read: '10 分钟', url: 'article-timeshare.html' },
 { tag: '技术文章', date: '2026-08-24', title: '均线系统 5 日 10 日 20 日线的短线实战用法', excerpt: '三条均线 看懂趋势 位置与买卖信号的切换', read: '12 分钟', url: 'article.html' },
 { tag: '战法', date: '2026-08-20', title: '止损与仓位管理 让亏损可承受 让利润拿得住', excerpt: '止损不是认输 仓位不是胆量 都是用数字算出来的纪律', read: '11 分钟', url: 'article-stoploss.html' },
 { tag: '研报', date: '2026-08-16', title: '研报这么读 先拆掉套话 只留能落地盘面的信息', excerpt: '目标价和评级别急着信 先问三个问题 过滤掉不能落地的话', read: '9 分钟', url: 'article-research.html' },
 { tag: '战法', date: '2026-08-12', title: 'A 股短线实战 从选股到买卖点 一套可复用的框架', excerpt: '短线不是赌涨跌 是一套有明确规则的概率系统', read: '12 分钟', url: 'article-shortline.html' },
 { tag: '选股', date: '2026-08-08', title: '复盘你的失败交易 选股环节最容易犯的五个错', excerpt: '赚钱的单子各有各的运气 亏钱的单子总有同一类选股硬伤', read: '8 分钟', url: 'article-review.html' },
 { tag: '买卖点', date: '2026-08-03', title: '买在分歧 卖在一致 短线买卖点的一句话心法', excerpt: '情绪拐点 往往比技术指标更早给出买卖信号', read: '9 分钟', url: 'article-divergence.html' },
 { tag: '研报', date: '2026-05-15', title: '全市场只剩17只！5元以下的真科技股 2026年5月还有机会吗？', excerpt: '低价不等于便宜 把5元以下还在真赛道里的票全部挖出来 逐个看质地', read: '14 分钟', url: 'research-5.html' },
 { tag: '研报', date: '2026-05-12', title: '从A股历史10倍股“基因密码”中 我挖出了2026年5月这9只潜力黑马', excerpt: '十倍股从来不是涨出来的 是符合基因之后被资金选出来的 九个特征逐条对照', read: '14 分钟', url: 'research-4.html' },
 { tag: '研报', date: '2026-05-10', title: 'AI应用商业化落地加速 2026细分赛道与龙头公司的黄金兑现期', excerpt: '大模型烧钱结束 轮到应用赚利润 拆解四条最容易兑现的变现路径', read: '7 分钟', url: 'research-3.html' },
 { tag: '研报', date: '2026-05-06', title: '2026年A股 吃透这6大硬核赛道就够了', excerpt: '光模块万亿龙头 机器人量产元年 一文拆解超级牛股的选股密码', read: '21 分钟', url: 'research-2.html' },
 { tag: '研报', date: '2026-04-30', title: '2026年5月A股潜力牛股预测 从4月底信号看未来趋势', excerpt: '四月底的政策与量能信号 已经提前把五月的方向写在盘面上 这篇把它读出来', read: '15 分钟', url: 'research-1.html' },
 ];

 function heroCard(a) {
 return '<article class="archive-featured">' +
 '<div class="flex items-center gap-3 text-sm">' +
 '<span class="font-medium text-primary">' + a.tag + '</span>' +
 '<span class="text-muted-foreground tnum">' + a.date + '</span>' +
 '</div>' +
 '<h3 class="mt-4 text-2xl sm:text-3xl font-bold leading-snug"><a href="' + a.url + '" class="hover:text-primary transition-colors duration-200">' + a.title + '</a></h3>' +
 '<p class="mt-4 text-muted-foreground leading-[1.7]">' + a.excerpt + '</p>' +
 '<div class="mt-auto pt-8 flex items-center gap-6 text-sm">' +
 '<span class="text-muted-foreground">' + a.read + ' 阅读</span>' +
 '<a href="' + a.url + '" class="inline-flex items-center gap-1 font-medium text-primary hover:text-foreground transition-colors duration-200">阅读全文 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>' +
 '</div>' +
 '</article>';
 }
 function smallCard(a) {
 return '<article class="archive-entry">' +
 '<div class="flex items-center gap-3 text-sm">' +
 '<span class="font-medium text-primary">' + a.tag + '</span>' +
 '<span class="text-muted-foreground tnum">' + a.date + '</span>' +
 '</div>' +
 '<h3 class="mt-3 text-base font-semibold leading-[1.5]"><a href="' + a.url + '" class="hover:text-primary transition-colors duration-200">' + a.title + '</a></h3>' +
 '<p class="mt-2 text-sm text-muted-foreground leading-[1.7] line-clamp-2">' + a.excerpt + '</p>' +
 '<div class="mt-auto pt-5 flex items-center justify-between text-sm">' +
 '<span class="text-muted-foreground">' + a.read + '</span>' +
 '<a href="' + a.url + '" class="inline-flex items-center gap-1 font-medium text-primary hover:text-foreground transition-colors duration-200">阅读 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>' +
 '</div>' +
 '</article>';
 }

 const grid = document.getElementById('article-grid');
 const emptyState = document.getElementById('empty-state');

 function renderArticles(list, compact) {
 grid.removeAttribute('aria-busy');
 if (list.length === 0) {
 grid.innerHTML = '';
 emptyState.classList.remove('hidden');
 return;
 }
 emptyState.classList.add('hidden');
 // 筛选或搜索时全部用小卡均布 不做 hero 大卡 避免单结果视觉失衡
 const html = compact
 ? list.map(smallCard).join('')
 : heroCard(list[0]) + list.slice(1).map(smallCard).join('');
 grid.innerHTML = html;
 }

 // ===== Tabs + 搜索筛选 =====
 const categories = ['全部', '选股', '买卖点', '技术文章', '指标选股器', '研报', '战法'];
 // 从 URL 恢复筛选状态 筛选结果可分享 刷新不丢
 const urlParams = new URLSearchParams(location.search);
 let activeCategory = urlParams.get('tag') && categories.indexOf(urlParams.get('tag')) !== -1 ? urlParams.get('tag') : '全部';
 let searchTerm = urlParams.get('q') || '';

 function syncUrl() {
 const params = new URLSearchParams();
 if (activeCategory !== '全部') params.set('tag', activeCategory);
 if (searchTerm !== '') params.set('q', searchTerm);
 const qs = params.toString();
 // file:// 等受限环境 replaceState 会抛异常 功能不受影响 且保留 #锚点
 try {
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
 } catch (e) { /* 忽略 */ }
 }

 (function initTabs() {
 const tabs = document.getElementById('category-tabs');
 tabs.innerHTML = categories.map(function (c) {
 return '<button class="tab" role="tab" data-category="' + c + '" data-active="' + (c === activeCategory) + '" aria-selected="' + (c === activeCategory) + '" aria-controls="article-grid">' + c + '</button>';
 }).join('');
 function selectTab(tab) {
 tabs.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('data-active', 'false'); t.setAttribute('aria-selected', 'false'); });
 tab.setAttribute('data-active', 'true');
 tab.setAttribute('aria-selected', 'true');
 activeCategory = tab.getAttribute('data-category');
 applyFilter();
 syncUrl();
 }
 tabs.querySelectorAll('.tab').forEach(function (tab) {
 tab.addEventListener('click', function () { selectTab(tab); });
 tab.addEventListener('keydown', function (e) {
 if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
 e.preventDefault();
 const btns = Array.from(tabs.querySelectorAll('.tab'));
 const idx = btns.indexOf(tab);
 let next;
 if (e.key === 'ArrowRight') next = btns[(idx + 1) % btns.length];
 else if (e.key === 'ArrowLeft') next = btns[(idx + btns.length - 1) % btns.length];
 else if (e.key === 'Home') next = btns[0];
 else next = btns[btns.length - 1];
 next.focus();
 selectTab(next);
 });
 });
 })();

 (function initSearch() {
 const input = document.getElementById('search-input');
 const clear = document.getElementById('search-clear');
 // URL 带搜索词时预填输入框
 if (searchTerm !== '') {
 input.value = searchTerm;
 clear.classList.remove('hidden');
 }
 input.addEventListener('keydown', function (e) {
 if (e.key === 'Escape') clear.click();
 });
 input.addEventListener('input', function () {
 searchTerm = input.value.trim();
 clear.classList.toggle('hidden', searchTerm.length === 0);
 applyFilter();
 syncUrl();
 });
 clear.addEventListener('click', function () {
 input.value = '';
 searchTerm = '';
 clear.classList.add('hidden');
 applyFilter();
 syncUrl();
 input.focus();
 });
 })();

 function applyFilter() {
 const q = searchTerm.toLowerCase();
 // 标题命中优先 其次分类与摘要 让正文里的词也能搜到
 const scored = articles.map(function (a) {
 if (activeCategory !== '全部' && a.tag !== activeCategory) return null;
 if (q === '') return { a: a, s: 0 };
 let s = 0;
 if (a.title.toLowerCase().indexOf(q) !== -1) s = 2;
 else if (a.tag.toLowerCase().indexOf(q) !== -1) s = 1;
 else if ((a.excerpt || '').toLowerCase().indexOf(q) !== -1) s = 1;
 else return null;
 return { a: a, s: s };
 }).filter(Boolean);
 scored.sort(function (x, y) { return y.s - x.s; });
 const list = scored.map(function (x) { return x.a; });
 const countEl = document.getElementById('result-count');
 if (countEl) {
 countEl.textContent = q !== ''
 ? '「' + searchTerm + '」共找到 ' + list.length + ' 篇'
 : (activeCategory === '全部' ? '共 ' + list.length + ' 篇' : activeCategory + ' 共 ' + list.length + ' 篇');
 countEl.classList.remove('hidden');
 }
 renderArticles(list, q !== '' || activeCategory !== '全部');
 }

 document.getElementById('reset-filter').addEventListener('click', function () {
 activeCategory = '全部';
 searchTerm = '';
 document.getElementById('search-input').value = '';
 document.getElementById('search-clear').classList.add('hidden');
 document.querySelectorAll('.tab').forEach(function (t, i) { t.setAttribute('data-active', i === 0); t.setAttribute('aria-selected', i === 0); });
 applyFilter();
 syncUrl();
 });

 // 下载按钮已改为直接跳转（App Store / 安卓 APK） 无需 JS 脚本
applyFilter();
