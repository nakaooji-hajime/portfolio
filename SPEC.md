# UI/UXポートフォリオサイト 最終仕様書（Claude Code用）

**リポジトリ**: https://github.com/nakaooji-hajime/portfolio  
**公開先**: GitHub Pages（パブリックリポジトリ）  
**対象者**: 中大路一（UI/UXデザイナー / 現Goens株式会社 CXO）

## 1. 技術スタック・制約
- Astro + TypeScript + React（インタラクティブ部分のみ）
- スタイリング: Tailwind CSS
- コンポーネント基盤: shadcn/uiを土台にスタイルをTailwindで置換
- **デザインハーネス制約**:
  - Tailwindの任意値（`[10px]`など）は使用禁止
  - 使用可能なカラーは **slate系のみ**（`slate-50`〜`slate-950`など）
- 画像: 生成不要。後挿入用に `<!-- 画像を挿入する -->` または具体的なファイル名コメントを入れる
- コンテンツ: Astro Content Collections（Markdown/MDX）で管理
- 開発支援: Claude Code（個人Proプラン想定）

## 2. サイトマップ
```
/                          ホーム（About + Career + Worksハイライト）
/works                     Works一覧
/works/goens               個別ケーススタディ: Goens
/works/shehub              個別ケーススタディ: SheHub
/works/creditengin         個別ケーススタディ: CreditEngin
/works/edes                個別ケーススタディ: Edes
/works/searchwrite         個別ケーススタディ: SearchWrite
/works/castme              個別ケーススタディ: Castme
/works/erabel              個別ケーススタディ: Erabel
/works/edesupro            個別ケーススタディ: EdesuPro
/works/inunavi             個別ケーススタディ: InuNavi
/works/datsumobijin        個別ケーススタディ: DatsumoBijin
/process                   Process / Approach
/resume                    Resume（PDFダウンロード）
```

## 3. デザイン方針（トンマナ）
参考: UPSIDER（https://corp.up-sider.com/ja）、みんなの銀行のコーポレートサイト（https://corporate.minna-no-ginko.com/）
- クリーンで余白多めのプロフェッショナルな印象
- slate系を基調とした落ち着いた配色（白背景 + slateテキスト + アクセントはslateの濃淡）
- タイポグラフィは読みやすさ重視、見出しはしっかり階層化
- ヒーローはシンプルにメッセージを立てる（派手なビジュアルより信頼感）

## 4. ページ別ワイヤーフレーム & 原稿

### 4.1 ホーム (`/`)
**ワイヤーフレーム**
```
[Header: ロゴ / ナビ（About, Works, Process, Resume）]
[Hero]
  キャッチコピー
  短いリード文
  <!-- 画像を挿入する: profile.png -->
[About セクション]
  自己紹介
  スキル・強み
[Career セクション]
  経歴タイムライン（要約）
[Works ハイライト]
  主要3〜4件のカード（サムネ + タイトル + 短い成果）
  「すべてのWorksを見る」リンク
[Footer]
```

**原稿（抜粋）**
- キャッチ: 「売上と体験を同時に動かすUI/UXデザイナー」
- About: 広告代理店・ITベンチャーでWEB・アプリ・SaaSのプロダクトデザイン、グロース、新規事業立ち上げを経験。現在はGoensでシニア向けマッチングサービスのCXOとして、プロダクト全体を統括。
- 強み: デザインだけでなく、ビジネス視点での施策立案、フロントエンド開発、データ分析、UXリサーチまで幅広く対応。マーケター・エンジニア・事業責任者と円滑に連携し、売上向上に貢献。
- Career要約: 2011年フリーランスイラストレーター → 2015年プラスワン（メディア立ち上げ） → 2018年エイチームフィナジー（カードローン比較サイトで月商1億円増収、デザイン組織マネジメント） → 2021年PLAN-B → 2022年エイチームライフデザイン → 2023年〜 Goens（ローンチ3年で月商2,000万円・登録者18万人）。

### 4.2 Works一覧 (`/works`)
**ワイヤーフレーム**
```
[Header]
[ページタイトル: Works]
[フィルタ or カテゴリ（任意）]
[カードグリッド]
  各カード: サムネイル / タイトル / 役割 / 短い成果 / 「詳細を見る」
[Footer]
```
Figma草案（https://www.figma.com/proto/QZSmGTrfdHG08oT3dIHNzi/Portfolio?node-id=25-545）を参考に実装。  
使用画像: 各プロジェクトの `*-thumbnail.png`

### 4.3 個別ケーススタディ（例: `/works/goens`）
**共通ワイヤーフレーム**
```
[Header]
[ヒーロー: プロジェクト名 + 役割 + 期間]
<!-- 画像を挿入する: goens-screenshot.png or goens-thumbnail.png -->
[概要]
[課題]
[プロセス（調査・設計・実装）]
[成果（数値）]
[学び・振り返り]
[Footer]
```

**原稿例（Goens）**
- タイトル: Goens - 50代以上限定マッチングサービス
- 役割: CXO / PM / UI/UX / 開発（React Native） / CS
- 概要: シニア世代の孤独解消と真剣な出会いを実現するマッチングアプリの立ち上げ・運営。
- 課題: 50代以上のユーザーにとって使いやすく、安心感のある体験をゼロから設計する必要があった。
- プロセス: ユーザーインタビューを基にシンプルなUIに集中。コミュニティ機能を組み込み、マッチング以外のつながりも提供。React Nativeで開発を進めつつ、デザインシステムを言語化してチームで共有。
- 成果: ローンチ3年で月商2,000万円、登録者数18万人を達成。
- 学び: ターゲットを明確に絞ることで、余計な機能を削ぎ落とし、コア体験に集中できた。

（他のプロジェクトも同様のフォーマットで、職務経歴書の実績を基に「課題→プロセス→成果」を記述。デザインの見た目より成果と意思決定にフォーカス）

### 4.4 Process / Approach (`/process`)
**ワイヤーフレーム**
```
[Header]
[タイトル: デザインプロセスと役割]
[セクション1: AIに任せること]
[セクション2: デザイナーが担うこと]
  - デザインシステムの言語化とデザインハーネスへの反映
  - 開発自動化の推進
[セクション3: 抽象度の高い領域での価値]
  - AIでは作れない独創的なクリエイティブ
  - あえてのUX
  - 既存外の施策・戦略提示
[Footer]
```

**原稿方向性**
基本的にAIに任せられる部分はAIに任せる。デザイナーの真価は、デザインシステムなどを言語化してハーネスに与え自動化を進めること、そして言語化しにくい抽象度の高い領域（独創的なクリエイティブ、AIでは提案できないUX、既存の枠を超えた戦略）にある。

### 4.5 Resume (`/resume`)
**ワイヤーフレーム**
```
[Header]
[タイトル: 職務経歴書]
[説明文]
[PDFダウンロードボタン]
（PDF内にメールアドレスを記載）
[Footer]
```
PDFは添付の職務経歴書を使用。

## 5. コンテンツ管理
- `src/content/works/` に各プロジェクトのMDXを配置
- スキーマ例: title, role, period, challenge, process, outcome, images[]
- 画像は `public/images/` に配置し、コメントで挿入位置を明示

## 6. 非機能要件
- Lighthouse 90+ 目標
- レスポンシブ対応
- 基本的なアクセシビリティ（コントラスト、セマンティックHTML）
- デプロイ: GitHub ActionsでAstroビルド → Pages公開

---

この仕様書をClaude Codeに渡す際は、リポジトリのルートに配置し「SPEC.mdを読んで実装して」と指示してください。
