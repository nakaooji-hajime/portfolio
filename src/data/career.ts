export const career = [
  {
    period: '2011年',
    company: 'フリーランス',
    detail: 'ミュージックビデオのアニメ制作など受託。',
  },
  {
    period: '2015年',
    company: '株式会社プラスワン',
    detail: 'コンサルティング事業の立ち上げ。ライフスタイル系比較サイトのグロース。',
  },
  {
    period: '2018年',
    company: '株式会社エイチームフィナジー',
    detail: 'デザイン組織のマネジメント。金融系比較サイトのグロース。',
  },
  {
    period: '2021年',
    company: '株式会社PLAN-B',
    detail: 'MA領域のSaaSの立ち上げ。ライフスタイル系比較サイトのグロース。',
  },
  {
    period: '2022年',
    company: '株式会社エイチームライフデザイン',
    detail: '複数の比較サイトのドメイン統合と新ブランドの立ち上げ。',
  },
  {
    period: '2023年',
    company: 'Goens株式会社',
    detail: 'シニア向けマッチングサービスの立ち上げ。',
  },
];

export type SkillIconName =
  'figma' | 'react' | 'typescript' | 'tailwind' | 'observation' | 'interview' | 'survey' | 'analytics' | 'management';

export const skills: { category: string; items: { label: string; icon: SkillIconName }[] }[] = [
  { category: 'デザイン', items: [{ label: 'Figma', icon: 'figma' }] },
  {
    category: 'フロントエンド',
    items: [
      { label: 'React', icon: 'react' },
      { label: 'TypeScript', icon: 'typescript' },
      { label: 'Tailwind', icon: 'tailwind' },
    ],
  },
  {
    category: 'リサーチ',
    items: [
      { label: '行動観察', icon: 'observation' },
      { label: 'インタビュー', icon: 'interview' },
      { label: 'アンケート', icon: 'survey' },
      { label: 'データ分析', icon: 'analytics' },
    ],
  },
  { category: 'その他', items: [{ label: '職能マネジメントの経験あり', icon: 'management' }] },
];
