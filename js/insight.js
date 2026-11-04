(() => {
  const categories = {
    consumer: ['소비자 의사결정', '●'],
    branding: ['브랜드와 정체성', '◆'],
    social: ['소셜미디어 마케팅', '◉'],
    pricing: ['가격과 프로모션', '▲'],
    ai: ['AI와 마케팅', '✦']
  };
  const grid = document.getElementById('folderGrid');
  const empty = document.getElementById('insightEmpty');
  const filters = [...document.querySelectorAll('.insight-filter')];
  if (!grid || !empty) return;
  const instagramLink = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' &&
        ['instagram.com', 'www.instagram.com'].includes(url.hostname) &&
        /^\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname) ? url.href : null;
    } catch { return null; }
  };
  const localImage = value => typeof value === 'string' &&
    /^assets\/[\w\-./]+\.(png|jpe?g|webp|avif)$/i.test(value) &&
    !value.split('/').includes('..');
  const data = Array.isArray(window.MAPI_INSIGHTS) ? window.MAPI_INSIGHTS : [];
  const seen = new Set();
  const entries = data.filter(item => {
    if (!item || item.isPublished !== true || !item.id || seen.has(item.id) ||
      !categories[item.category] || typeof item.title !== 'string' || !item.title.trim() ||
      (item.image && !localImage(item.image)) || !instagramLink(item.instagramUrl)) return false;
    seen.add(item.id);
    return true;
  }).sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  const node = (tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value) el.textContent = value;
    return el;
  };
  function render(category) {
    const visible = entries.filter(item => category === 'all' || item.category === category);
    grid.replaceChildren();
    for (const item of visible) {
      const [label, shape] = categories[item.category];
      const card = node('a', 'folder-card');
      card.href = instagramLink(item.instagramUrl);
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', `${item.title} · 인스타그램 게시물, 새 탭에서 열림`);
      const badge = node('span', 'insight-category');
      const mark = node('span', 'insight-category-shape', shape);
      mark.setAttribute('aria-hidden', 'true');
      badge.append(mark, document.createTextNode(label));
      const folder = node('div', 'folder-icon');
      if (item.image) {
      const img = node('img', 'insight-cover');
      img.src = item.image;
      img.alt = `${item.title} 표지`;
      img.loading = 'lazy';
      img.addEventListener('error', () => img.remove(), { once: true });
      folder.append(img);
      }
      card.append(badge, folder, node('h2', 'insight-card-title', item.title));
      if (typeof item.paperTitle === 'string' && item.paperTitle.trim()) {
        const paper = node('div', 'insight-paper');
        paper.append(node('p', 'insight-paper-label', '논문'), node('p', 'insight-paper-title', item.paperTitle));
        if (typeof item.paperAuthors === 'string' && item.paperAuthors.trim()) {
          paper.append(node('p', 'insight-paper-authors', `저자: ${item.paperAuthors}${item.paperYear ? ` (${item.paperYear})` : ''}`));
        }
        card.append(paper);
      }
      const meta = node('p', 'insight-card-meta');
      if (typeof item.author === 'string' && item.author.trim()) {
        meta.append(node('span', '', item.author));
      }
      card.append(meta);
      grid.append(card);
    }
    empty.hidden = visible.length > 0;
    empty.textContent = entries.length === 0 ? '아직 등록된 인사이트가 없습니다' :
      '이 주제에는 아직 등록된 인사이트가 없습니다';
  }
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    render(button.dataset.category);
  }));
  render('all');
})();
