export const SITE = {
  name: 'Nakaooji Hajime - Design Portfolio',
  tagline: '中大路一　デザインポートフォリオ',
  description: '新たな視点で成果に繋げるUI/UXデザイナー、中大路一のポートフォリオ。',
  github: 'https://github.com/nakaooji-hajime',
  resumePdf: 'resume/nakaooji-hajime-resume.pdf',
  // 検索結果に載せる場合は false にする
  noindex: true,
};

// Worksの期間（例: 2026年11月〜現在）から時期の年だけを取り出す
export const workYear = (period: string) => period.match(/^\d{4}年/)?.[0] ?? period;

export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;

export const NAV = [
  { label: 'Home', href: url() },
  { label: 'Profile', href: url('#profile') },
  { label: 'Works', href: url('works') },
  { label: 'Resume', href: url('resume') },
];
