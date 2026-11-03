# design.md

このサイトのデザインルール。実装するときは必ず従う。`npm run harness` で検査できる項目には「検査あり」と記す。ここにない値やスタイルを使う場合は、実装前に承認を得る。

## 実装

- **スタイリング**
  - Tailwind CSSの標準クラスだけを使い、任意値（`[16px]` など）は使わない（検査あり）
  - 独自classとインラインスタイルは使わない。例外は「動き」の演出用class（`src/styles/global.css`）と、演出の順番を渡す `style="--i:0"`
  - クラスは上位概念から並べる（例：`display` → `margin` → `font-size` → `leading` → `color`）
  - レスポンシブ指定は、デフォルト値、ブレイクポイントの順に書く（例：`text-base md:text-lg`）
  - 余白は `gap` を優先し、marginは多用しない。DOMは簡素にする
- **コンポーネント**
  - Astroで作り、JavaScriptは必要な箇所にだけ使う
  - 2箇所以上で同じ見た目を使う要素は、`src/components/` のコンポーネントにする
  - 画像は `src/assets/` に置き、最適化を通す
- **アクセシビリティ**
  - コントラスト比、キーボード操作、`focus-visible` に配慮する
  - 画像には内容が分かる代替テキストを付ける
  - `prefers-reduced-motion` とWebGL非対応の環境では、動きなしで内容をすべて表示する
- **Markdown**
  - 入れ子のインデントは半角スペース2個にする。Prettierが3個に揃えるため、番号付きリストの下に入れ子を作らない

## 原則

- 余白とタイポグラフィで階層を作る。装飾で目立たせない
- 色味は作品画像に任せ、UIはgrayの濃淡で構成する
- ヘッダー、フッター、セクションの境界にボーダーを使わない。セクションの背景を交互に変えて区切る

## Color

| 用途                 | Light      | Dark       |
| -------------------- | ---------- | ---------- |
| Site background      | `white`    | `black`    |
| Text                 | `gray-950` | `gray-50`  |
| Note                 | `gray-500` | `gray-500` |
| Border               | `gray-200` | `gray-800` |
| Content bg, Modal bg | `gray-50`  | `gray-950` |
| Accent               | `teal-400` | `teal-400` |

- 表にない色は使わない（gray以外の色は検査あり）
- セクションの背景は `white` と `gray-50` を交互にし、カードはその逆の色にする
- ファーストビューとフッターの暗い面には、Darkの色を使う
- `teal-400` は背景と演出にだけ使い、文字色にしない（検査あり）

## Typography

- 日本語は Noto Sans JP、英数字は Plus Jakarta Sans

| 用途          | サイズ                 | 太さ          | 行間            |
| ------------- | ---------------------- | ------------- | --------------- |
| Site title    | `text-4xl md:text-8xl` | `font-bold`   | `leading-snug`  |
| Section title | `text-4xl md:text-6xl` | `font-bold`   | `leading-snug`  |
| Content title | `text-2xl`             | `font-bold`   | `leading-snug`  |
| Strong        | `text-lg`              | `font-bold`   | `leading-snug`  |
| Base          | `text-base`            | `font-normal` | `leading-loose` |
| Note          | `text-xs`              | `font-normal` | `leading-loose` |

## Style

- ブレイクポイントは `md:` だけを使い、スマートフォン幅では1カラムを基本にする
- セクションは `w-full`、`px-6`、`py-24`。中身の幅は、一覧を含むものが `max-w-6xl`、読み物が `max-w-4xl`
- 余白（`m`、`p`、`gap`）の数値は、Section `24`、Content - wide `12`、Content - narrow `8`、Block - wide `4`、Block - narrow `2`、Tip `1`
- 角丸は、Modal・Content が `rounded-3xl`、Default・Button が `rounded-lg`、Tip が `rounded-sm`
- ボーダーは `border`

## 部品

- 主要なボタンは `bg-gray-950` に `text-white`
- テキストリンクは `white` か `gray-950` にし、下線は付けない
- 外部リンクは `ExternalLink` で、新しいタブで開き、外部リンクのアイコンを付ける
- Worksのカードは、画像、見出し、制作時期（`制作時期：2026年` のように年だけ）、担当範囲のタグの順に並べ、カード全体をリンクにする
- 事例の詳細ページは、サムネイル、見出し、メタ情報、スクリーンショット、本文の順に並べる。画像にボーダーを付けない

## 動き

- 演出は `src/styles/global.css` と `src/scripts/` にまとめる
- ファーストビュー：ロゴのフェード（同じタブでは最初の1回だけ）→ キャッチコピー。マウスに追従するぼかしとノイズの光
- 光はgrayの濃淡で作り、中央だけ白くする。文字を避けず、マウスが止まっても自動で動かさない
- メッセージの背景は光を反転し、周囲を `white` に近づけ、最も濃い中央を `gray-300` までに抑える。フッターはファーストビューと同じ暗い面と光
- 光はすべてのセクションで同じ座標を共有する。境界は動かない直線とし、光が跨いだ地点だけ水に垂らしたインクのように上下で混ぜ、約3秒で戻す
- スクロールで表示する要素には `data-reveal` を付ける
- ホバー：テキストリンクは文字を左から `teal-400` に染める（`.text-fill`、暗い面では `.text-fill-overlay`）。ボタンとパネルは背景だけを染める（`.bg-fill`）。Worksのカードは全体を `hover:scale-102` で拡大し、見出しの文字だけを染める
- フッター上の導線は、Worksのサムネイルを横に自動でループさせ、下へ `white` にフェードさせる
