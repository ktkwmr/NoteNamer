# ベースラインの実施状況（Note Namer）

基準: WEBAPP_BASELINE.md（最終更新 2026-10-21 版）

ktkwmr/SheetMusicPlayer（コミット `c9bd5ee`）からコピーして作ったので、ファイルで決まる項目は流用元の状態を引き継いでいる。Cloudflare・トップページ・Search Console などリポジトリの外の作業は、このアプリ用にやり直す（👤 待ち）。
状態: ✅ 実装済み / ⚠️ 一部 / ❌ 未実装 / 👤 待ち（人間の作業） / — 対象外

## 0. 変数

| 変数 | 値 |
|---|---|
| アプリ名 | Note Namer |
| スラッグ | `notenamer` |
| ドメイン | `ktkwmr.com`（9 つ目のアプリ。§0 の **A**: 別 Worker + Route `ktkwmr.com/notenamer*`） |
| リポジトリ | `ktkwmr/NoteNamer`（公開） |
| 運営者・問い合わせ | ktkwmr / GitHub Issues |
| 言語 | en（既定）+ ja（`/ja/`） |
| Web Analytics token | ほかのアプリと同じ |
| ライセンス | **AGPL-3.0**（homr に合わせた。ベースラインの MIT とは異なる） |

## 1. アカウント

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 1-1〜1-3, 1-5, 1-6 | アカウント類・開発環境 | ✅ | 既存アプリで実施済み |
| 1-4 | Claude の GitHub App にリポジトリを許可 | ✅ | |
| 1-8 | Cloudflare の GitHub App にリポジトリを許可 | 👤 待ち | |

## 2. 土台とホスティング

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 2-1 | wrangler.jsonc | ✅ | `routes`・`workers_dev: false`・`preview_urls: true`・`previews: {}` |
| 2-2 | `/` → `/<slug>/` の転送 | — | ドメイン直下は `ktkwmr/ktkwmr.com` |
| 2-3 | 404.html | ✅ | `wrangler dev` で `/notenamer/` 以下の不明な URL が 404 になることを確認 |
| 2-4 | .gitignore | ✅ | `.engine-cache/`（エンジン作成用のダウンロード）も除外 |
| 2-5 | .gitattributes（LF） | ✅ | |
| 2-6 | 生成スクリプトの `--check` | ✅ | `build-ja.mjs`・`build-pages.mjs`・`build-engine.py --check`（ファイルの有無と 25MiB 以下） |
| 2-7 | README（英日） | ✅ | 動作環境・仕組み・エンジンの作り直しも記載 |
| 2-8 | LICENSE | ✅ | AGPL-3.0（homr のライセンス本文） |
| 2-9 | CLAUDE.md | ✅ | |
| 2-10 | バージョン番号なし・キャッシュ名固定 | ✅ | 画面にバージョンは出さない。エンジンだけはフォルダ名でバージョン管理（`engine/v3/`、中身を変えたら上げる） |
| 2-11 | Cloudflare に接続・ルート設定 | ⚠️ | 2026-11-09 にリポジトリを接続（Worker `notenamer`）。最初の `main` のビルドは、`main` がまだ流用元の設定（Worker 名 `sheetmusicplayer`、Route `ktkwmr.com/sheetmusicplayer*`）だったため、Route が本物の Sheet Music Player の Worker と重なって失敗した（本物は無事。`notenamer` には Route が付いていない）。PR #1 をマージすると `main` の設定が `notenamer` になる。プレビュー URL での確認は 👤 待ち |
| 2-13 | 自動デプロイの確認 | 👤 待ち | |
| 2-14 | 2 つ目以降のアプリの設定 | ⚠️ | sitemap は `public/notenamer/sitemap.xml`。`ktkwmr/ktkwmr.com` の `robots.txt` の `Sitemap:` 行は公開時の PR で足す |
| 2-15 | トップページ | — | `ktkwmr/ktkwmr.com` |
| 2-16 | トップページへのアプリの追加 | ❌ | 公開時に `ktkwmr/ktkwmr.com` の `home.mjs`（`APPS`・`ICON`・`PREVIEW`）を直す PR を出す |

## 3. PWA

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 3-1 | manifest.json | ✅ | |
| 3-2 | アイコン一式 | ✅ | 音符と、その下の名札（ラベル）。言語に依存しない形 |
| 3-3 | PWA/iOS 用 meta | ✅ | |
| 3-4 | sw.js（ネットワーク優先） | ✅ | 例外: 読み取りエンジン（`engine/`）はキャッシュ優先。`omr-worker.mjs` が専用のキャッシュ `notenamer-engine-<version>` に保存し、sw.js はそこから返すだけ（130MB を二重に持たない） |
| 3-5 | SW 登録 | ✅ | |
| 3-6 | `file://` 不可の説明 | ✅ | README |
| 3-7 | インストールの案内 | ❌ | 任意 |
| 3-8 | アイコン PNG の生成 | ✅ | `scripts/render-icons.mjs` |

## 4. 多言語

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 4-1 | I18N と data-i18n | ✅ | |
| 4-2 | 言語の決め方 | ✅ | |
| 4-3 | 日本語ページの自動生成 | ✅ | |
| 4-4 | 日本語の検索用タイトル・説明 | 👤 確認待ち | `scripts/build-ja.mjs` の冒頭。「Note Namer – 楽譜にドレミを振る無料アプリ（写真・PDFから音名付きの楽譜）」 |
| 4-5 | 和文の lang 固定 | — | 和文を表示する部分はない |

## 5. SEO と SNS 表示

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 5-1〜5-3 | title・description・canonical・hreflang・OGP | ✅ | 音名のアプリとして書き直した（PR 3） |
| 5-4 | og-image.png | ✅ | `scripts/og-image.html` から生成（音符の下に C D E とドレミ） |
| 5-5 | JSON-LD | ✅ | `browserRequirements` に JSPI が必要なこと（動作確認は PC の Chrome・Edge、Firefox 153・Safari 27 は未確認） |
| 5-6 | robots.txt・sitemap | ✅ | sitemap は生成済み。robots.txt は `ktkwmr/ktkwmr.com` に記載 |
| 5-7 | h1 | ✅ | |
| 5-8 | 見えるテキスト | ✅ | 冒頭の説明と、撮影のコツ |
| 5-10 | アプリごとの sitemap | ✅ | |

## 6. セキュリティヘッダー

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 6-1, 6-2 | `_headers`・CSP の基本形 | ✅ | `wasm-unsafe-eval`（エンジン）、`worker-src 'self' blob:`、`media-src blob:`（Web カメラ）。COOP `same-origin` + COEP `credentialless` + CORP `same-origin`（スレッドで高速化） |
| 6-3 | 外部ホストの CSP | ✅ | 外部は Cloudflare Web Analytics だけ。ライブラリはすべて自サイトから配信 |
| 6-4 | CSP 違反 0 件 | ✅ | `wrangler dev` + Chromium で、読み取り・表示・再生・PDF・カメラ・About を通して違反 0 件。例外として Tesseract.js のワーカー 1 ファイルだけ `unsafe-eval` を許可（`_headers` にコメント） |
| 6-5 | Permissions-Policy | ✅ | `camera=(self)`（写真を撮る） |

## 7. プライバシー・法務

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 7-1 | アプリ内のプライバシー | ✅ | 楽譜を送らないこと、カメラ、保存するデータ |
| 7-2 | プライバシーポリシー | ✅ | 制定日 2026-10-22 |
| 7-3 | 運営者情報 | ✅ | 免責（読み取り結果の正確さ・楽譜の利用）、AGPL と homr |
| 7-4 | 問い合わせ窓口 | ⚠️ | GitHub Issues のみ |
| 7-5 | 文言のそろえ | ✅ | |
| 7-6 | 例のコンテンツ | ✅ | 楽譜を開いていないときに見本（歓喜の歌の MusicXML、`scripts/sample-score.mjs`）を表示。エンジンのダウンロードなし、保存しない |
| 7-7 | 外部リンクの確認 | 👤 待ち | |

## 8. ライセンス

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 8-1 | THIRD_PARTY_LICENSES.md | ✅ | `scripts/build-engine.py` がライブラリの本文を書く（CDN ではなく自サイト配信のため）。lamejs は MP3 の書き出しと一緒に外した |
| 8-2 | 更新スクリプト・Actions | ✅ | CDN の URL を探すスクリプトは、自サイト配信の `engine/`・`vendor/` を対象外にした |
| 8-3 | About で表示 | ✅ | |
| 8-4 | バージョン固定・遅延読み込み | ✅ | すべてバージョン固定。エンジン・OSMD・PDF.js は使うときだけ読み込む |

## 9. 共通 UI

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 9-1 | 設定メニュー | ✅ | 使い方・ガイド・記事（`/guide/` へのリンク）・プライバシー・このアプリについて |
| 9-2 | 使い方 | ✅ | |
| 9-3 | 状態の保存 | ✅ | 開いている楽譜（localStorage）と最近の楽譜 10 曲（IndexedDB）。MusicXML・タイトル・ファイル名・テンポ・移調。新しいファイルではテンポを楽譜の値に戻す |
| 9-4 | スマホ対応 | ⚠️ | 390px で横スクロールなし。ただし読み取りエンジンの動作確認は PC の Chrome・Edge のみ（JSPI が必要。JSPI のないブラウザでは案内を表示）。Android の Chrome などは JSPI があり動き出すが未確認（メモリ不足の可能性） |
| 9-5 | `accept` | ✅ | 「ファイルを選ぶ」は `accept` なし（どのファイルも選べ、中身で画像・PDF を判定）。「写真を撮る」はスマホではカメラ、PC では Web カメラ |
| 9-6, 9-7 | 印刷・保存 | ✅ | 楽譜の下の「印刷」「画像を保存」「共有」と「保存・共有」メニュー。A4 のページ（`export-pages.mjs`）を印刷・PNG（`a[download]`）・Web Share。音名入りの MusicXML。iPhone の Safari での印刷・共有は未確認 |
| 9-8 | アクセシビリティ | ✅ | |
| 9-9 | 自動テスト | ⚠️ | `score-model.mjs`・`note-names.mjs` の単体テスト（`npm test`、Actions の Test）。読み取りエンジン・表示・再生は Playwright での手動 E2E のみ |
| 9-10 | 押したときの反応 | ✅ | |
| 9-11 | ダイアログのフォーカス | ✅ | |
| 9-12 | ステータスバーのにじみ | ⚠️ | PC・タブレットはヘッダーを sticky に。スマホ（幅 900px 以下・高さ 520px 以下）は楽譜を広く見せるためヘッダーをスクロールさせ、代わりに `body::before`（高さ `env(safe-area-inset-top)`、不透明、sticky）を上端に置き、その下に再生・停止の行だけを sticky にしている。iPhone 実機での効果は未確認 |
| 9-15 | 再生コントロール | ✅ | ▶／❚❚ をアイコンだけで切り替え、■ で止めて最初に戻る。Space・Home |

## 10〜15

| # | 項目 | 状態 | メモ |
|---|---|---|---|
| 10-1 | 生成の仕組み | ✅ | `scripts/pages/<slug>.mjs`（英日を別々に書く）、共通部品は `parts.mjs` |
| 10-2 | 最初の記事 | ✅ | 使い方ガイド・音名の対応表・五線譜の音の読み方・♯♭と調号・FAQ・撮り方のコツ・読み取りミスの直し方（7 本）。流用元の速度記号・MusicXML・OMR の記事は削除 |
| 10-3 | 表は計算で | ✅ | 速度記号の表はアプリの `TEMPO_TERMS` から（範囲外ならビルドが止まる）。撮り方の比較表は実測（`photo-results.json`） |
| 10-4 | 画面写真 | ⚠️ | `scripts/render-guide-images.mjs`（PC・日英）。スマホはアプリの動作が未確認のため撮らない |
| 10-5 | 導線 | ✅ | 記事末尾の「アプリを開く」、フッターに全記事、日英切り替え。アプリ側は設定メニューと「使い方」の 2 か所 |
| 10-6 | 公開前の UX レビュー | ⚠️ | 390px で横スクロールが出ないことを Playwright で確認（sharps-and-flats・guide）。全記事の目視は人間の確認で |
| 10-7 | 人間の内容確認 | 👤 待ち | PR のプレビューで確認（`docs/article-review.md`） |
| 11-1〜11-3 | Web Analytics | ✅ | 同じ token |
| 11-4 | 本番での beacon 確認 | 👤 待ち | COEP（credentialless）の下で beacon が読み込めるかも確認する |
| 12-1, 12-2 | Actions | ✅ | |
| 13 | 公開直前の確認 | 👤 待ち | |
| 14 | Search Console など | 👤 待ち | |
| 15 | 広告 | — | |

## このアプリで見つかった、ベースラインに足す候補

- 既存アプリのリポジトリをコピーして新しいアプリを作るときは、Cloudflare に接続する前に `main` の `wrangler.jsonc`（Worker 名・Route）を新しいアプリの値にしておく。古い値のままだと、Workers Builds は Worker 名を接続先に置き換えてアップロードし、Route だけが元のアプリと重なって失敗する（Route が空いていれば、元のアプリの URL を奪うおそれがある）。また、空のリポジトリは最初の PR の前に `main` を push しておく必要がある。

- 大きなファイル（WebAssembly・モデル）を配信するアプリ: Cloudflare Workers の 1 ファイル 25MiB 制限、キャッシュ優先の専用キャッシュ、バージョン付きフォルダ。
- `SharedArrayBuffer`（スレッド）が要るアプリ: `_headers` に COOP/COEP。COEP は `credentialless` にすると Web Analytics の beacon をそのまま使える。
- Playwright で検証するときは、毎回新しいプロファイルを使う（Cache Storage・IndexedDB の古いデータで結果が変わる）。
- `<base href>` を使う生成ページ（`ja/index.html` など）では、JS で URL を組み立てるときに `location.href` ではなく `document.baseURI` を基準にする。このアプリでは日本語ページで PDF.js のワーカーと Tesseract.js が 404 になり、PDF が開けずテンポも読めていなかった。
- COEP のページで、Service Worker がキャッシュから作り直したレスポンスでワーカーのスクリプトを返すと、COEP ヘッダーがないためワーカーが起動しない。キャッシュに入れるときに元のヘッダーを残すか、返すときに付ける。
- 記事の画面写真や比較表は、同じ見本から Playwright で作り直せるスクリプトにしておく（`render-guide-images.mjs`）。実測値を本文で言葉にするときは、値が変わったらビルドが止まるようにする。
- 実際に E2E で 2 回目以降の訪問（Service Worker が制御している状態）と日本語ページも通す。初回・英語だけの確認では上の 2 つは見つからなかった。
