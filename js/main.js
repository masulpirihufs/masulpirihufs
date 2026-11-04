// page loader
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('is-hidden'), 300);
  }
});

// header scroll state
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 40) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('is-open');
  mainNav.classList.toggle('is-open');
});
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('is-open');
    mainNav.classList.remove('is-open');
  });
});

// glide-in transition for snap sections (home)
const glideSections = document.querySelectorAll('.snap-section:not(.hero)');
glideSections.forEach((el) => el.setAttribute('data-glide', ''));

const glideIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  },
  { threshold: 0.35 }
);
glideSections.forEach((el) => glideIo.observe(el));

// paginated full-screen scroll — one wheel/swipe gesture moves exactly one section (home page only)
const snapSections = Array.from(document.querySelectorAll('.snap-section'));
if (snapSections.length) {
  let current = 0;
  let animating = false;
  let lockTimer = null;
  const LOCK_MS = 1000;

  const syncCurrent = () => {
    const line = window.scrollY + window.innerHeight * 0.4;
    let idx = 0;
    snapSections.forEach((sec, i) => {
      if (sec.getBoundingClientRect().top + window.scrollY <= line) idx = i;
    });
    current = idx;
  };
  syncCurrent();

  const goTo = (index) => {
    if (index < 0 || index >= snapSections.length || index === current) return;
    animating = true;
    current = index;
    snapSections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => {
      animating = false;
    }, LOCK_MS);
  };

  // at the very first/last section, release control back to native scroll
  // (lets a taller last section — CTA + full footer — scroll freely if it overflows the viewport)
  const releaseAtEdge = (goingDown) =>
    (goingDown && current === snapSections.length - 1) || (!goingDown && current === 0);

  window.addEventListener(
    'wheel',
    (e) => {
      const goingDown = e.deltaY > 0;
      if (releaseAtEdge(goingDown)) return;
      if (animating) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      goTo(current + (goingDown ? 1 : -1));
    },
    { passive: false }
  );

  let touchStartY = 0;
  window.addEventListener(
    'touchstart',
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      const goingDown = e.touches[0].clientY < touchStartY;
      if (releaseAtEdge(goingDown)) return;
      if (animating) e.preventDefault();
    },
    { passive: false }
  );
  window.addEventListener(
    'touchend',
    (e) => {
      if (animating) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      const goingDown = diff > 0;
      if (releaseAtEdge(goingDown)) return;
      goTo(current + (goingDown ? 1 : -1));
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      if (!animating) syncCurrent();
    },
    { passive: true }
  );
}

// insight folder filter
const insightTabs = document.querySelectorAll('.insight-tab');
const folderCards = document.querySelectorAll('.folder-card');
insightTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    insightTabs.forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const category = tab.dataset.category;
    folderCards.forEach((card) => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? '' : 'none';
    });
  });
});

// scroll reveal
const revealEls = document.querySelectorAll(
  '.about-text, .about-stats, .card, .section-head, .folder-card'
);
revealEls.forEach((el) => el.setAttribute('data-reveal', ''));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => io.observe(el));
