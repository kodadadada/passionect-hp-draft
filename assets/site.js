// メニューを変えるときはここだけ直せば全ページに反映される。
// 制作・活動実績ページを追加するときも NAV に1行足す。
const NAV = [
  ['index.html', 'トップ'],
  ['business.html', '事業紹介'],
  ['products.html', '商品'],
  ['support.html', '配信支援'],
  ['about.html', 'パスコネについて'],
];
// 全ページ共通のファイルタブ。今いるページのタブが手前に出る
const TABS = [
  ['business.html', '事業紹介'],
  ['products.html', '商品一覧'],
  ['support.html', '配信支援'],
  ['about.html', 'パスコネについて'],
  ['contact.html', 'お問い合わせ'],
];
// TODO: ショップURLに変更
const BOOTH_URL = 'https://booth.pm/';

document.documentElement.classList.add('js');
const here = location.pathname.split('/').pop() || 'index.html';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function navLink(href, label, className) {
  const a = el('a', className, label);
  a.href = href;
  if (href === here) a.setAttribute('aria-current', 'page');
  return a;
}

function renderHeader() {
  const slot = document.getElementById('site-header');
  if (!slot) return;
  const draft = el('p', 'draft');
  const draftText = el('span', 'wrap', '初稿です。黄色の部分は、いただいた内容に差し替えます。');
  draftText.style.display = 'block';
  draft.append(draftText);

  const header = el('header', 'site-head');
  const wrap = el('div', 'wrap');
  const brand = el('a', 'brand', 'Passionect');
  brand.href = 'index.html';
  const nav = el('nav', 'site-nav');
  nav.setAttribute('aria-label', 'メインメニュー');
  const ul = el('ul');
  NAV.forEach(([href, label]) => {
    const li = el('li');
    li.append(navLink(href, label));
    ul.append(li);
  });
  const cta = el('li');
  cta.append(navLink('contact.html', 'お問い合わせ', 'nav-cta'));
  ul.append(cta);
  nav.append(ul);
  wrap.append(brand, nav);
  header.append(wrap);
  slot.replaceWith(draft, header);
}

function renderFooter() {
  const slot = document.getElementById('site-footer');
  if (!slot) return;
  const footer = el('footer', 'site-foot');
  const wrap = el('div', 'wrap');
  const name = el('div');
  name.append(el('p', 'foot-name', 'Passionect'), el('p', 'foot-catch', '好きをつなげて、未来を広げる'));
  const ul = el('ul');
  NAV.concat([['contact.html', 'お問い合わせ']]).forEach(([href, label]) => {
    const li = el('li');
    li.append(navLink(href, label));
    ul.append(li);
  });
  const booth = el('li');
  const boothLink = el('a', '', 'BOOTH');
  boothLink.href = BOOTH_URL;
  boothLink.target = '_blank';
  boothLink.rel = 'noopener';
  booth.append(boothLink);
  ul.append(booth);
  wrap.append(name, ul, el('small', '', '© パスコネ（Passionect）'));
  footer.append(wrap);
  slot.replaceWith(footer);
}

function renderTabs() {
  let nav = document.querySelector('[data-tabs]');
  if (!nav) {
    const head = document.querySelector('.page-head .wrap');
    if (!head) return;
    nav = el('nav', 'tabs');
    nav.setAttribute('aria-label', 'ページの切り替え');
    head.append(nav);
  }
  nav.replaceChildren(...TABS.map(([href, label]) => navLink(href, label)));
}

// sample: true の項目はサンプルなので黄色で表示する
function text(tag, value, sample) {
  const node = el(tag);
  if (sample) node.append(el('span', 'ph', value));
  else node.textContent = value;
  return node;
}

// 商品画像が届くまでの配信画面の見本
function miniStream(index) {
  const mini = el('div', `mini v${(index % 3) + 1}`);
  mini.setAttribute('data-ui', '');
  mini.setAttribute('role', 'img');
  mini.setAttribute('aria-label', '配信画面の見本');
  const side = el('div', 'mini-side');
  side.append(el('i'), el('i'), el('i'), el('i'));
  mini.append(el('div', 'mini-stage', '見本'), side);
  return mini;
}

function picture(item, index) {
  if (!item.image) return miniStream(index);
  const img = el('img');
  img.src = item.image;
  img.alt = item.name;
  img.loading = 'lazy';
  return img;
}

function productRow(item, index) {
  const card = el('li', 'product');
  const thumb = el('div', 'thumb');
  thumb.append(picture(item, index));
  const body = el('div', 'product-body');
  body.append(text('h3', item.name, item.sample), text('p', item.summary, item.sample));
  const spec = el('dl', 'spec');
  [['用途', item.use], ['対応ソフト', item.software], ['動作環境', item.environment], ['利用条件', item.terms]].forEach(([label, value]) => {
    const row = el('div');
    row.append(el('dt', '', label), text('dd', value, item.sample));
    spec.append(row);
  });
  const link = el('a', 'btn', 'BOOTHで見る');
  link.href = item.boothUrl || BOOTH_URL;
  link.target = '_blank';
  link.rel = 'noopener';
  body.append(spec, link);
  card.append(thumb, body);
  return card;
}

// トップの商品一覧。行を指すと右の画面が切り替わり、スマホでは行の中に画像を出す
function renderIndex(root, items) {
  const rows = el('ul', 'index-rows');
  const plate = el('div', 'index-plate');
  const frames = items.map((item, i) => {
    const frame = picture(item, i);
    frame.classList.add('mini-frame');
    if (!item.image) frame.classList.add('mini');
    plate.append(frame);
    return frame;
  });
  const links = items.map((item, i) => {
    const li = el('li');
    const a = el('a');
    a.href = item.boothUrl || BOOTH_URL;
    a.target = '_blank';
    a.rel = 'noopener';
    const inline = el('div', 'row-plate');
    inline.append(picture(item, i));
    a.append(text('h3', item.name, item.sample), text('p', item.summary, item.sample), inline);
    li.append(a);
    rows.append(li);
    return a;
  });
  const show = (i) => {
    frames.forEach((frame, n) => frame.classList.toggle('on', n === i));
    links.forEach((a, n) => a.classList.toggle('on', n === i));
  };
  links.forEach((a, i) => {
    a.addEventListener('pointerenter', () => show(i));
    a.addEventListener('focus', () => show(i));
  });
  show(0);
  root.replaceChildren(rows, plate);
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(path);
  return res.json();
}

async function renderProducts() {
  const list = document.querySelector('[data-products]');
  const index = document.querySelector('[data-product-index]');
  if (!list && !index) return;
  try {
    const items = await loadJson('data/products.json');
    if (list) list.replaceChildren(...items.map(productRow));
    if (index) renderIndex(index, items.filter((item) => item.featured).slice(0, 3));
  } catch {
    (list || index).replaceChildren(el('p', '', '商品情報を読み込めませんでした。BOOTHのショップページをご覧ください。'));
  }
  setupReveal();
}

async function renderNews() {
  const list = document.querySelector('[data-news]');
  if (!list) return;
  try {
    const items = await loadJson('data/news.json');
    list.replaceChildren(...items.slice(0, 5).map((item) => {
      const li = el('li');
      const time = el('time', '', item.date);
      time.dateTime = item.date.replaceAll('.', '-');
      li.append(time, text('span', item.title, item.sample));
      return li;
    }));
  } catch {
    list.replaceChildren(el('li', '', 'お知らせを読み込めませんでした。'));
  }
}

function setupBoothLinks() {
  document.querySelectorAll('[data-booth]').forEach((a) => { a.href = BOOTH_URL; });
}

// TODO: フォームのURLが決まったら、contact.htmlのbuttonをaタグに置き換えてこの処理を削除
function setupFormButton() {
  const button = document.getElementById('form-open');
  if (!button) return;
  button.addEventListener('click', () => {
    document.getElementById('form-note').hidden = false;
  });
}

// トップの配信画面: 訪問者の「好き」がコメントとして流れる。送信はせず、この画面の中だけで完結する
function setupStream() {
  const form = document.getElementById('say');
  if (!form) return;
  form.hidden = false;
  const list = document.getElementById('stream-comments');
  const count = document.getElementById('stream-count');
  const input = document.getElementById('say-text');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    const li = el('li', 'mine');
    li.append(el('b', '', 'あなた'), document.createTextNode(`${value}が好き！`));
    list.append(li);
    while (list.children.length > 4) list.firstElementChild.remove();
    count.textContent = String(Number(count.textContent) + 1);
    input.value = '';
  });
}

let observer;
function setupReveal() {
  const parts = document.querySelectorAll('main .page-head h1, main .page-head p, main h2, main .prose, main .sheet, main .card, main .news, main .index-rows li, main .index-plate, main .product, main .facts, main .bullets, main .steps, main .cta p, main .actions');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  observer ??= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  parts.forEach((part) => {
    if (part.classList.contains('rise')) return;
    const siblings = [...part.parentElement.children].indexOf(part);
    part.style.setProperty('--d', `${Math.min(siblings, 4) * 75}ms`);
    part.classList.add('rise');
    observer.observe(part);
  });
}

renderHeader();
renderFooter();
renderTabs();
setupBoothLinks();
setupFormButton();
setupStream();
renderProducts();
renderNews();
setupReveal();
