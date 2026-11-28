# 利用状況の計測（Cloudflare Zaraz + Google Analytics 4）

ページの滞在時間・ボタンのタップ・設定の変更・主な機能の結果を、Cloudflare Zaraz 経由で GA4 に送る（ベースライン §17）。
**同意バナーで「すべて同意」を選んだ人だけ**が GA4 に送られる。閲覧数は今までどおり Cloudflare Web Analytics（Cookie なし）でも数える。
同意の Cookie（`zaraz-consent`）は ktkwmr.com のすべてのアプリで共通。

## しくみ

- `index.html`・記事のページ（`scripts/pages/layout.mjs`）・`public/404.html` の `<head>` で `/cdn-cgi/zaraz/i.js`（Zaraz）と `/notenamer/usage-events.js` を読む。
  Zaraz の「Auto-inject script」は切ってあるので、Zaraz が動くのはこのタグを書いたページだけ。
- `usage-events.js`（ベースラインの `templates/public/__slug__/usage-events.js` のコピー。違うのは `PREFIX` だけ）: すべてのボタン・リンクのタップ（`nn_tap`）、設定の変更（`nn_change`）、ページが見えていた時間（`nn_engaged`）を送る。`window.usage.track(name, params)`（→ `nn_<name>`）と `window.usage.playing(on)`（音が鳴っている時間）をアプリに渡す。フッターの「Cookie の設定」（`.cookie-settings`）で `zaraz.showConsentModal()` を開く。
- アプリの主な機能のイベントは `index.html` の `addFilesNow()`・`openMusicXml()`・読み取り（Sheet Music Player の `smp_open`・`smp_read` と同じ）・再生・`printNow()`・`savePngs()`・`sharePngs()`・MusicXML の保存（`track()` → `window.usage.track`）。
- Zaraz がないとき（`wrangler dev`、workers.dev のプレビュー、ブラウザがブロック）は何も送らない。`i.js` が 404 になるだけで、アプリは動く。
- 同じオリジン（`/cdn-cgi/zaraz/…`）なので CSP・COEP は変えていない。Zaraz が GA4 に送るのは Cloudflare のサーバーからで、ブラウザは Google に直接つながない。
- `sw.js` は `/cdn-cgi/` をキャッシュしない（Zaraz のスクリプトはリクエストごとに作られる）。

**楽譜の内容（タイトル・ファイル名・音符・画像・エラーの本文）は送らない。** イベントを足すときもこれを守り、プライバシーの説明（`scripts/pages/privacy.mjs`、`index.html` の `privacy.body`、README）に書いた範囲に収める。範囲を広げるときは説明も同じ PR で直す。
利用者が名前を付けたもの（曲・セット・トラックなど）が選択肢になる `<select>` には `data-track-value="off"` を付ける（変えたことだけを送り、値は送らない）。文字の入力欄の中身は送らない。

## イベント

すべてのイベントに `ui_lang`（`en` / `ja`）が付く。

| イベント | パラメーター | いつ |
|---|---|---|
| `nn_tap` | `button` | ボタン・リンク・タブを押したとき。名前は `data-track`、要素の `id`、`data-i18n`（`data-i18n-attr`）のキー（上にある id を `id:キー` の形で前に付ける）、リンクは `link:/notenamer/guide/` や `link:github.com`、「Cookie の設定」は `cookie-settings`、それ以外は「上にある id:クラス名」。アプリが自分で起こすクリック（ダウンロードなど）は数えない |
| `nn_change` | `control`, `value`, `files` | セレクト・スライダー（離したとき）・数値・チェックボックス（`on`/`off`）・ラジオを変えたとき。ファイルを選んだときは `value` が拡張子（複数は `+`）・`files` が数。名前の付け方は `nn_tap` と同じ |
| `nn_engaged` | `seconds`, `play_seconds` | ページが隠れたとき・閉じたとき。前回から、ページが見えていた秒数と音が鳴っていた秒数 |
| `nn_open` | `via`（file / camera）, `kind`（image / pdf / xml / mxl / other、複数は `+`）, `files` | ファイルを選んだとき |
| `nn_read` | `result`（ok / cancel / image / pdf / no-staff / unsupported / download / memory / render / xml / error）, `kind`, `files`, `pages`, `seconds`, `tempo`（テンポの取り方）, `system`（音名の書き方） | 読み取り（MusicXML を開くのも含む）が終わったとき |
| `nn_export` | `type`（musicxml / print / png / share）, `result`（ok / share / file / link / copied / cancel / error）, `pages`, `system` | 印刷・画像の保存・共有・MusicXML の保存 |

イベント名を足すときは `nn_` で始める（GA4 はドメインで 1 つなので、アプリで分けるため）。パラメーターの名前はほかのアプリと同じものを使い回す（GA4 のカスタム定義はディメンション・指標それぞれ 50 個まで）。

## 設定（Cloudflare・GA4）

ドメインで 1 回だけの設定（GA4 のプロパティ `ktkwmr.com`・測定 ID `G-HM6P805V7F`、Zaraz のツール・同意バナー）は Sheet Music Player の `docs/analytics.md` とベースライン §17-1〜17-6。
全アプリに入れたので、Zaraz を一部のページで止めていた Configuration Rule は消す（2026-11-28 の計画。消したかどうかは `docs/baseline-status.md` の 17-13）。

## GA4 で登録するカスタム定義

GA4 → 管理 → カスタム定義。登録しないとレポートに出ない（さかのぼっても出ない）。ほかのアプリで登録済みの名前は登録し直さなくてよい（同じ名前のパラメーターは共通）。

| 種類 | 名前（パラメーター） | 範囲・単位 |
|---|---|---|
| カスタムディメンション | `button`, `control`, `value`, `ui_lang`, `via`, `kind`, `result`, `type`, `tempo`, `system` | イベント |
| カスタム指標 | `seconds` | イベント・秒 |
| カスタム指標 | `play_seconds` | イベント・秒 |
| カスタム指標 | `files` | イベント・標準 |
| カスタム指標 | `pages` | イベント・標準 |

## 確かめ方

- ローカル: Playwright の `context.route("**/cdn-cgi/zaraz/i.js")` に `window.zaraz = { track() {…}, showConsentModal() {…} }` の代わりを返させ、送られるイベントを見る（ベースライン §17-12）。Playwright の `selectOption` などは `isTrusted` でないイベントを起こすので数えられない。キーボード（`focus` → `ArrowDown`）かクリックで操作する。
- 本番: ブラウザのコンソールで `zaraz.debug("<Debug key>")` を実行して再読み込みすると、Zaraz の送信内容が表示される。GA4 の「リアルタイム」・DebugView にも出る。
