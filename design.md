# Design System & Implementation Rules

## 運用ルール（必須遵守）

以下のルールはすべて**MUST**とする。違反する場合は実装前に必ず承認を得ること。

1. **スタイリング手法**
   - 当サイトのスタイリングは**Tailwind CSSのみ**を使用すること
   - Tailwind以外のCSSフレームワークの使用は禁止とする
   - 独自classの定義、およびインラインスタイル（`style`属性）の使用は禁止とする
   - 例外：後述「動き」の演出用class（`src/styles/global.css`）と、演出の順番を渡す `style="--i:0"` は既存のものに限り使用してよい

2. **デザインシステム優先**
   - 後述する「デザインシステム詳細」を最優先で遵守すること
   - デザインシステムに定義されていない値・スタイルを使用する場合は、実装前に承認を得ること

3. **Tailwindクラスの記述ルール**
   - セクションは境界が分かるように交互に背景色を設定すること
   - カスタム値（`[16px]` や `[1.35]` などの任意値）の使用は避けること
   - 可能な限りTailwindの標準クラス（`text-base`、`leading-snug` など）を使用すること
   - クラスの並び順は「上位概念→下位概念」の順とすること
     例：`display` → `margin` → `font-size` → `leading` → `color`
   - レスポンシブ指定は「デフォルト値 → ブレイクポイント指定」の順で記述すること
     例：`text-base md:text-lg`
   - grid-gapやflex-gapで優先しスタイリングし、marginは多用しないこと
   - 簡素なdom構造を意識しすること

4. **アクセシビリティ**
   - WEBアクセシビリティを意識し、可能な限り遵守すること
   - コントラスト比、キーボード操作、`focus-visible` などの基本的な配慮を行うこと
   - 画像には内容が分かる代替テキストを付けること
   - `prefers-reduced-motion` とWebGL非対応の環境では、動きなしで内容をすべて表示すること

## デザインシステム詳細

### 原則

- 余白とタイポグラフィで階層を作る。装飾で目立たせない
- 色味は作品画像に任せ、UIはgrayの濃淡で構成する
- ヘッダー、フッター、セクションの境界にボーダーを使わない。背景色の差と余白で区切る

### Color

Light mode

- Site background: `white`
- Text: `gray-950`
- Note: `gray-500`
- Border: `gray-200`
- Content bg, Modal bg: `gray-50`
- Accent: `teal-400`

Dark mode

- Site background: `black`
- Text: `gray-50`
- Note: `gray-500`
- Border: `gray-800`
- Content bg, Modal bg: `gray-950`
- Accent: `teal-400`

使い方

- セクションの背景は `white` と `gray-50` を交互にする（ホームはメッセージ `white` → Profile `gray-50` → Career `white` → Works `gray-50`）
- コンテンツ（カード）の背景は、`white` のセクションでは `gray-50`、`gray-50` のセクションでは `white`
- ファーストビューの暗い面の文字は `gray-50`
- `teal-400` は背景、オーバーレイ、演出（ホバーの染め）にだけ使い、文字色（`text-teal-400`）には使わない
- 白背景の文字に `gray-400` 以下の薄い色を使わない

### Typography

Font

- Japanese: Noto Sans JP
- English: Plus Jakarta Sans

Font size（スマートフォン → `md:` 以上）

- Site title: `text-4xl` → `md:text-8xl`
- Section title: `text-4xl` → `md:text-6xl`
- Content title: `text-2xl`
- Strong: `text-lg`
- Base: `text-base`
- Note: `text-xs`

Font bold

- Title, Strong: `font-bold`（700）
- Base, Note: `font-normal`（400）

Leading

- Title, Strong: `leading-snug`
- Base, Note: `leading-loose`

### Style

Break point

- PC, Tablet: `md:`
- スマートフォン幅では1カラムを基本にする

Max width

- Section: `w-full`
- Content - wide: `max-w-6xl`（一覧を含む中身）
- Content - narrow: `max-w-4xl`（読み物、本文）

Spacing

- Section: `m-24`, `p-24`, `gap-24`
- Content - wide: `m-12`, `p-12`, `gap-12`
- Content - narrow: `m-8`, `p-8`, `gap-8`
- Block - wide: `m-4`, `p-4`, `gap-4`
- Block - narrow: `m-2`, `p-2`, `gap-2`
- Tip: `m-1`, `p-1`, `gap-1`
- 画面の左右の余白は `px-6`
- ホームのセクションは上下 `py-24`、見出しと中身の間は `gap-12`

Radius

- Modal, Content: `rounded-3xl`
- Default, Button: `rounded-lg`
- Tip: `rounded-sm`

Border

- Default: `border`

### Components

- Astroコンポーネントで作る。JavaScriptは必要な箇所にだけ使う
- 2箇所以上で同じ見た目を使う要素は、`src/components/` のコンポーネントを呼び出す
- 主要なボタンは `bg-gray-950` に `text-white`、角は `rounded-lg`
- テキストリンクの色は `white` か `gray-950` に統一し、grayの中間色にしない。下線は付けない
- Worksのカードは画像、見出し、制作時期（`制作時期：2026年` のように年だけ）、担当範囲のタグの順に並べ、カード全体をリンクにする
- 事例の詳細ページは、サムネイル、見出し、メタ情報、スクリーンショット、本文の順に並べる。画像にボーダーを付けない

### 動き

- 演出は `src/styles/global.css` と `src/scripts/` にまとめる
- ホームのファーストビュー：ロゴのフェード → キャッチコピー、マウスに追従するぼかしとノイズの光
- ロゴの演出は、同じタブで開いている間は最初の1回だけ再生する
- 光はgrayの濃淡で作り、中央だけ白くする。文字を避ける処理は入れない
- ホームのメッセージの背景：ファーストビューの光を反転して使う。周囲を `white` に近づけ、最も濃い中央を `gray-300` までに抑える
- フッターの背景：ファーストビューと同じ暗い面と光を使う
- 光はすべてのセクションで同じ座標を共有し、境目をまたいで移動させる。マウスが止まっても光を自動で動かさない
- 2つのセクションの境界は常に動かない直線にする。光が境界を跨いだときだけ、その地点の線を水に垂らしたインクのように上下で混ぜ、約3秒で直線へ戻す
- スクロールで表示する要素には `data-reveal` を付ける
- テキストリンクはホバーで文字を左から `teal-400` に染める（`.text-fill`）。元の色はファーストビューとフッターの上で `white`、それ以外で `gray-950`
- Worksのカードは、ホバーでカード全体を少し拡大し（`hover:scale-102`）、見出しの文字だけを左から `teal-400` に染める。画像は拡大せず、制作時期とタグは染めない
- ボタンとパネルは文字を変えず、ホバーで背景だけを左から `teal-400` に染める（`.bg-fill`）
- フッター上の職務経歴書への導線：Worksのサムネイルを横に自動でループさせ、下へ `white` にフェードさせる

### 画像

- `src/assets/` に置き、最適化を通す
