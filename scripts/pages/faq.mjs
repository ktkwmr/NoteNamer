// Frequently asked questions (FAQPage structured data is made from `faq` by build-pages.mjs).
import { link, MAX_FILES } from "./parts.mjs";

const dl = (items) => `<dl class="faq">
${items.map((qa) => `<dt id="${qa.id}">${qa.q}</dt>\n<dd>${qa.a}</dd>`).join("\n")}
</dl>`;

const en = [
  { id: "phone", q: "Can I use it on a phone, an iPad, Safari, or Firefox?", a: `<p>The app is tested on Chrome and Edge 137 or later on a computer, Safari on iPhone (iOS 27.2), and Chrome on Android (137 or later). The reading engine needs a browser feature called JavaScript Promise Integration (JSPI). Browsers without it show a message instead. On an iPhone, update to iOS 27.2 or later. Firefox (153 or later) and Safari on a Mac or iPad (27 or later) have it too, but the app has not been tested on them yet, and older phones and tablets may not have enough memory for reading (about 2 GB). If it does not work, take the photo with your phone and open it on a computer.</p>` },
  { id: "free", q: "Is it free? Do I need an account?", a: `<p>It is free, with no account, no sign-up, and no ads.</p>` },
  { id: "upload", q: "Is my sheet music uploaded anywhere?", a: `<p>No. The photo, image, or PDF is read inside your browser and is never sent to a server. Photos taken with the camera are not saved. Only the notes of the last 10 scores you opened (as MusicXML), with their titles, tempo, and transposition, are kept in the browser so you can open them again. See the <a href="/notenamer/privacy/">privacy policy</a>.</p>` },
  { id: "time", q: "How long does reading take?", a: `<p>Roughly 10 to 60 seconds per page, depending on the device and the number of staves. The first time, the app also downloads its reading engine (about 130 MB) once; after that it starts right away and works offline.</p>` },
  { id: "what", q: "What kind of sheet music can it read?", a: `<p>Printed music in standard notation: a single melody or a piano score on two staves (grand staff) works best. Images (JPEG, PNG, WebP, …) and PDFs can be read, up to ${MAX_FILES} files at a time as one score. Handwritten music, tablature, and chord charts without notes cannot be read. Scores with many staves take longer and contain more mistakes.</p>` },
  { id: "pages", q: "How do I read a piece with several pages?", a: `<p>Add the photos (or PDFs) to the list one after another, up to ${MAX_FILES} files, check the order (drag the handle to change it), and press “Read the score”: the pages are read in order and joined into one score. The pages of a PDF are read in order, and a photo of two facing pages is split and read left page first. Reading takes about a minute per page; with many pages the browser may run out of memory, especially on a phone. Then read fewer pages at a time.</p>` },
  { id: "wrong", q: "Some notes are wrong. How do I fix them?", a: `<p>Switch to Edit and drag the notes to the right pitch and length, add missing ones, or delete extra ones. Measures marked “!” did not add up when they were read, so check those first. Many mistakes go away with a sharper, straighter photo. See ${link("en", "fix-errors", "how to fix reading mistakes")} and ${link("en", "photo-tips", "photo tips")}.</p>` },
  { id: "keysig", q: "Are the sharps and flats of the key signature included?", a: `<p>Yes. Each name includes the key signature, the accidentals earlier in the measure, and ties over the bar line: in G major every F is named F♯. When you transpose, the names follow the new key. If the key signature itself was read wrong, every name changes with it, so compare the first line with the paper. See ${link("en", "sharps-and-flats", "sharps, flats, and key signatures")}.</p>` },
  { id: "systems", q: "Which note names can it write?", a: `<p>Fixed names, where C is always Do: ドレミ (Japanese katakana), C D E (letters), Do Re Mi, 도레미 (Korean), German (C D E … H, with Fis and B), and Cyrillic До Ре Ми. And names in the key: ドレミ or Do Re Mi with movable Do, Chinese numbered notation (1 2 3), and Indian sargam (Sa Re Ga), where the first note of the key is Do, 1, or Sa. Choose one above the score; the first choice follows your browser\'s language. Japanese ハニホ and octave numbers (C4) are not offered. See the ${link("en", "note-name-chart", "note name chart")}.</p>` },
  { id: "noteheads", q: "Can it write the names inside the note heads, or color the notes?", a: `<p>Not yet. The names are written under the notes, like lyrics.</p>` },
  { id: "print", q: "Can I print it or send it to someone?", a: `<p>Yes. Under the score, <b>Print</b> prints A4 pages (choose “Save as PDF” in the print dialog for a PDF), <b>Save image</b> saves each page as a PNG, and <b>Share</b> sends the images through your phone's share menu. Each page has the title and a small “Made with Note Namer” line at the bottom, which can be turned off in the <b>Save / share</b> menu.</p>` },
  { id: "lyrics", q: "My score has lyrics. Are they kept?", a: `<p>The reading does not pick up lyrics or chord symbols. When you open a MusicXML file with lyrics, the screen shows only the note names in their place.</p>` },
  { id: "open-xml", q: "Can I open a MusicXML file I already have?", a: `<p>Yes. Choose or drop a <code>.musicxml</code>, <code>.mxl</code>, or <code>.xml</code> file and it opens right away with its tempo, without reading. Partwise MusicXML, which is what notation programs export, is supported.</p>` },
  { id: "kept", q: "Where did my last score go? How do I delete it?", a: `<p>The score you had open appears again when you open the app, and the last 10 scores are listed under <b>Recent scores</b> in the left panel. <b>Clear history</b> removes that list (the open score stays), and <b>Clear</b> removes the open score. They are also removed when you clear this site's data in the browser settings, and they are not kept in private browsing.</p>` },
];

const ja = [
  { id: "phone", q: "スマホや iPad、Safari、Firefox で使えますか？", a: `<p>動作を確認しているのは、PC の Chrome・Edge（137 以降）、iPhone の Safari（iOS 27.2）、Android の Chrome（137 以降）です。読み取りエンジンには JavaScript Promise Integration（JSPI）というブラウザの機能が必要で、この機能がないブラウザでは案内を表示します。iPhone は iOS 27.2 以降に更新してください。Firefox（153 以降）、Mac や iPad の Safari（27 以降）にもこの機能はありますが、これらでの動作はまだ確かめていません。また、古いスマホやタブレットは読み取りに必要なメモリ（約 2GB）が足りないことがあります。うまくいかないときは、写真をスマホで撮って PC で開いてください。</p>` },
  { id: "free", q: "無料ですか？ 登録は必要ですか？", a: `<p>無料です。アカウント登録は要らず、広告もありません。</p>` },
  { id: "upload", q: "楽譜はどこかにアップロードされますか？", a: `<p>されません。写真・画像・PDF はブラウザの中で読み取り、サーバーには送りません。カメラで撮った写真も保存しません。もう一度開けるよう、最近開いた 10 曲の音符（MusicXML）とタイトル・テンポ・移調の設定だけをブラウザに保存します。<a href="/notenamer/ja/privacy/">プライバシーポリシー</a>もご覧ください。</p>` },
  { id: "time", q: "読み取りにはどのくらい時間がかかりますか？", a: `<p>端末の性能と段の数によって、1 ページ 10〜60 秒ほどです。初回だけ、読み取りエンジン（約 130MB）のダウンロードが入ります。2 回目からはすぐに始まり、オフラインでも使えます。</p>` },
  { id: "what", q: "どんな楽譜を読み取れますか？", a: `<p>印刷された五線譜です。単旋律の楽譜や、ピアノの大譜表（2 段）がいちばん向いています。画像（JPEG・PNG・WebP など）と PDF を読み取れます。一度に ${MAX_FILES} 個までのファイルを 1 つの楽譜として読み取れます。手書きの楽譜、タブ譜、音符のないコード譜は読み取れません。段の多い楽譜は時間がかかり、間違いも増えます。</p>` },
  { id: "pages", q: "何ページもある曲はどうすればいいですか？", a: `<p>写真（または PDF）を続けて選んで一覧に ${MAX_FILES} 個まで追加し、順番を確かめて（ハンドルをドラッグすると変えられます）「楽譜を読み取る」を押してください。並んだ順に読み取って 1 つの楽譜につなげます。PDF はページ順に読み取り、見開き 2 ページを 1 枚に撮った写真は左右に分けて左のページから読み取ります。1 ページに 1 分ほどかかり、ページが多いと（特にスマートフォンでは）メモリが足りなくなることがあります。そのときはページを減らして読み取ってください。</p>` },
  { id: "wrong", q: "音符が間違っています。どう直せばいいですか？", a: `<p>「編集」に切り替えて、音符をドラッグして正しい高さ・長さにしたり、足りない音符を追加したり、余分な音符を削除したりします。「!」の付いた小節は拍の合計が合わなかった小節なので、先に確かめてください。はっきりした、まっすぐな写真で撮り直すと減る間違いも多くあります。${link("ja", "fix-errors", "読み取りミスの直し方")}と${link("ja", "photo-tips", "撮り方のコツ")}をご覧ください。</p>` },
  { id: "keysig", q: "調号の ♯・♭ も反映されますか？", a: `<p>されます。調号、その小節の前の臨時記号、小節線をまたぐタイを反映した高さで音名を書きます。ト長調ならファはすべて「ファ♯」です。移調すると、音名も新しい調に合わせて変わります。調号そのものを読み違えると曲全体の音名が変わるので、最初の段は元の楽譜と見比べてください。${link("ja", "sharps-and-flats", "♯・♭と調号の読み方")}もご覧ください。</p>` },
  { id: "systems", q: "どんな書き方の音名にできますか？", a: `<p>C がいつもドの音名として、ドレミ（カタカナ）・C D E・Do Re Mi・도레미（韓国語）・ドイツ式（C D E … H。Fis、B など）・До Ре Ми（ロシア語など）。調に合わせた書き方として、ドレミの移動ド・Do Re Mi の移動ド・中国の数字譜（1 2 3）・インドの Sa Re Ga（調の主音がド・1・Sa）。楽譜の上で選べ、最初はブラウザの言語に合わせます（日本語のページではカタカナ）。ハニホとオクターブ付きの表記（C4）にはまだ対応していません。${link("ja", "note-name-chart", "音名の対応表")}もご覧ください。</p>` },
  { id: "noteheads", q: "音符の玉の中に音名を書いたり、色分けしたりできますか？", a: `<p>今はできません。音名は歌詞のように音符の下に書きます。</p>` },
  { id: "print", q: "印刷したり、人に送ったりできますか？", a: `<p>できます。楽譜の下の<b>印刷</b>で A4 のページを印刷でき（印刷画面で「PDF に保存」を選ぶと PDF になります）、<b>画像を保存</b>でページごとの PNG 画像を保存、<b>共有</b>でスマホの共有メニュー（LINE など）から画像を送れます。各ページのいちばん下にはタイトルと小さな「Note Namer で作成」が入り、<b>保存・共有</b>メニューで消せます。</p>` },
  { id: "lyrics", q: "歌詞のある楽譜は、歌詞も残りますか？", a: `<p>読み取りでは歌詞とコードネームは読み取りません。歌詞の入った MusicXML を開いたときは、画面では歌詞の代わりに音名だけを表示します。</p>` },
  { id: "open-xml", q: "手元の MusicXML ファイルを開けますか？", a: `<p>開けます。<code>.musicxml</code>・<code>.mxl</code>・<code>.xml</code> のファイルを選ぶかドロップすると、読み取りなしで、ファイルに書かれたテンポですぐに開きます。楽譜ソフトが書き出す partwise 形式の MusicXML に対応しています。</p>` },
  { id: "kept", q: "前回の楽譜はどこにありますか？ 消すには？", a: `<p>開いていた楽譜は、次にアプリを開くとそのまま表示されます。最近開いた 10 曲は、左のパネルの<b>最近の楽譜</b>に並びます。<b>履歴を消去</b>で一覧を消し（開いている楽譜は残ります）、<b>クリア</b>で開いている楽譜を消せます。ブラウザの設定でこのサイトのデータを削除しても消えます。プライベートブラウズでは保存されません。</p>` },
];

export default {
  slug: "faq",
  faq: true,
  published: "2026-10-24",
  en: {
    title: "Note Namer FAQ: Browsers, Sharps and Flats, Name Systems, Printing",
    heading: "Frequently asked questions",
    nav: "FAQ",
    description: "Answers about Note Namer: which browsers work, whether your music is uploaded, how long reading takes, what it can read, sharps and flats from the key signature, which note names it writes, fixing wrong notes, and printing or sharing the result.",
    faq: en,
    body: () => `
<p class="lead">Common questions about adding note names to sheet music with this app. For the steps, see the ${link("en", "guide", "guide")}.</p>
${dl(en)}
`,
  },
  ja: {
    title: "よくある質問（対応ブラウザ・♯♭の反映・音名の書き方・印刷）",
    heading: "よくある質問",
    nav: "よくある質問",
    description: "Note Namer のよくある質問。対応ブラウザ（スマホ・Safari）、楽譜がアップロードされないか、読み取り時間、読める楽譜、調号の ♯・♭ の反映、音名の書き方、間違いの直し方、印刷・共有について。",
    faq: ja,
    body: () => `
<p class="lead">このアプリで楽譜にドレミを振るときの、よくある質問をまとめました。手順は${link("ja", "guide", "使い方ガイド")}をご覧ください。</p>
${dl(ja)}
`,
  },
};
