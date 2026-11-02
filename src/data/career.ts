export const career = [
  {
    period: '2011年',
    company: 'フリーランス',
    detail: 'イラストレーターとして、ゲームイラストやアニメーションを制作。',
  },
  {
    period: '2015年',
    company: '株式会社プラスワン',
    detail: 'メディアはローンチ1年で月商300万円、コンサルティング事業は立ち上げ1年で年商2,000万円を達成。',
  },
  {
    period: '2018年',
    company: '株式会社エイチームフィナジー',
    detail: 'カードローン比較サイトのLPOで、半年で月商1億円を増収。10名規模のデザイン組織をマネジメント。',
  },
  {
    period: '2021年',
    company: '株式会社PLAN-B',
    detail: 'MA領域のSaaSでUI/UXとUXリサーチを担当。比較サイトのLPOでは、月商を30万円から100万円に増収。',
  },
  {
    period: '2022年',
    company: '株式会社エイチームライフデザイン',
    detail: 'PMとして、メディアのドメイン統合と新ブランドの立ち上げを推進。社内にUXデザイナー職を新設。',
  },
  {
    period: '2023年',
    company: 'Goens株式会社',
    detail: 'CXOとして、50代以上向けマッチングサービスを統括。ローンチ3年で月商2,000万円、登録者数18万人を達成。',
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
  { category: 'その他', items: [{ label: '職能マネジメント経験あり', icon: 'management' }] },
];
