// スクロールで data-reveal の要素を表示する。
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.15 },
);

document.querySelectorAll('[data-reveal], .case-body > *').forEach((element) => observer.observe(element));

export {};
