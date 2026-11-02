export const SITE = {
  name: 'Nakaooji Hajime - Design Portfolio',
  description: '新たな視点で成果に繋げるUI/UXデザイナー、中大路一のポートフォリオ。',
  github: 'https://github.com/nakaooji-hajime',
  repoFile: 'https://github.com/nakaooji-hajime/portfolio/blob/main/',
  resumePdf: 'resume/nakaooji-hajime-resume.pdf',
  // 検索結果に載せる場合は false にする
  noindex: true,
};

export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;

export const NAV = [
  { label: 'Profile', href: url('#profile') },
  { label: 'Works', href: url('works') },
  { label: 'Vision', href: url('vision') },
  { label: 'Resume', href: url('resume') },
];
