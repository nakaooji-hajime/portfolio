export const SITE = {
  name: 'Hajime Nakaooji',
  description: '売上と体験を同時に動かすUI/UXデザイナー、中大路一のポートフォリオ。',
  github: 'https://github.com/nakaooji-hajime',
  resumePdf: 'resume/nakaooji-hajime-resume.pdf',
  // 検索結果に載せる場合は false にする
  noindex: true,
};

export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;
