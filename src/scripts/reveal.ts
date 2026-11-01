// スクロールで data-reveal の要素を表示し、data-count の数値をカウントアップする。
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COUNT_MS = 1400;

function countUp(element: HTMLElement) {
  const goal = Number(element.dataset.count);
  const startedAt = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - startedAt) / COUNT_MS);
    const eased = 1 - (1 - t) ** 3;
    element.textContent = Math.round(goal * eased).toLocaleString('ja-JP');
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
      if (!reduced) entry.target.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
    }
  },
  { threshold: 0.15 },
);

document.querySelectorAll('[data-reveal], .case-body > *').forEach((element) => observer.observe(element));

export {};
