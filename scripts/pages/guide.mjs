// How to use the app, step by step, with screenshots (scripts/render-guide-images.mjs).
import { shot, image, link, MAX_FILES } from "./parts.mjs";

export default {
  slug: "guide",
  published: "2026-11-08",
  en: {
    title: "How to Add Note Names (C D E, Do Re Mi) to Sheet Music from a Photo",
    heading: "How to add note names to sheet music from a photo",
    nav: "How to use Note Namer",
    description: "Step-by-step guide to Note Namer: photograph sheet music, let the app read it in your browser, get the name under every note (C D E, Do Re Mi, ドレミ, 도레미) with sharps and flats, check it by ear, fix mistakes, and print, save, or share it.",
    body: () => `
<p class="lead">Note Namer reads printed sheet music from a photo, an image, or a PDF and writes the name of every note under it: C D E, Do Re Mi, ドレミ, or 도레미, with the sharps and flats of the key signature. Print the page for practice, or send it to someone who is learning to read music. This guide walks through each step with screenshots.</p>

<nav class="toc" aria-label="Contents"><b>Contents</b><ol>
  <li><a href="#need">What you need</a></li>
  <li><a href="#sample">The first screen</a></li>
  <li><a href="#open">Open your score</a></li>
  <li><a href="#read">Wait for the reading</a></li>
  <li><a href="#names">Note names: choose how they are written</a></li>
  <li><a href="#listen">Check by ear</a></li>
  <li><a href="#edit">Fix mistakes</a></li>
  <li><a href="#transpose">Transpose</a></li>
  <li><a href="#print">Print, save as images, share</a></li>
  <li><a href="#recent">Recent scores</a></li>
  <li><a href="#trouble">When it does not work</a></li>
</ol></nav>

<h2 id="need">What you need</h2>
<ul>
  <li><b>An iPhone with Safari (iOS 27.2 or later), an Android phone with Chrome (137 or later), or a computer with Chrome or Edge (137 or later).</b> The reading engine needs a browser feature called JavaScript Promise Integration (JSPI); browsers without it show a message instead. Newer Firefox (153+) and Safari on a Mac or iPad (27+) also have it, but are untested.</li>
  <li><b>An internet connection the first time you read a photo.</b> The app downloads its reading engine once (about 130 MB) and keeps it in the browser. After that it also works offline.</li>
  <li><b>Printed sheet music</b> in standard notation. Handwritten music and tablature are not supported.</li>
</ul>
<p>The app is free and needs no account. The notes are read inside your browser, so your sheet music is never uploaded.</p>

<h2 id="sample">1. The first screen</h2>
${shot("en", "app-start", "The app when it opens: the Open a score panel with Choose a file and Take a photo, and the sample Ode to Joy with a letter name under every note", "The first screen, with the sample.")}
<p>When no score is open, the app shows a sample, “Ode to Joy”, with a name under every note, so you can see what it does before using your own music. It needs no download. Opening your own score replaces it; the sample is not kept in Recent scores.</p>

<h2 id="open">2. Open your score</h2>
<p>There are three ways to open sheet music:</p>
<ul>
  <li><b>Take a photo</b>: on a phone, the camera opens. Hold the page flat, straight on, and fill the frame with it.</li>
  <li><b>Choose a file</b>: images (JPEG, PNG, WebP, …) or PDFs.</li>
  <li><b>Drop a file</b> on the panel (on a computer).</li>
</ul>
<p>The files are added to a list (up to ${MAX_FILES}), numbered in the order you chose them. Drag the handle to change the order, then press <b>Read the score</b>: the files are read in that order and joined into one score. A MusicXML file (<code>.musicxml</code>, <code>.mxl</code>, <code>.xml</code>) opens immediately without reading.</p>
${shot("en", "app-list", "The list of files to read: two photos numbered 1 and 2, each with a delete button and a handle, and the Read the score button", "The files to read, in order. Drag the handle (≡) to change the order.")}
<p>How you take the photo makes a difference. See ${link("en", "photo-tips", "how to photograph sheet music for better results")}.</p>

<h2 id="read">3. Wait for the reading</h2>
${shot("en", "app-reading", "The app while reading: a progress bar says Reading the staves", "While the app reads, the panel shows each step and a progress bar.")}
<p>The app finds the staves and notes, then reads the staves one by one. This takes roughly 10 to 60 seconds per page, depending on the device and the number of staves. The first time, the download of the engine comes before this. You can cancel at any time.</p>

<h2 id="names">4. Note names: choose how they are written</h2>
${shot("en", "app-names", "The score read from the photo, with a letter name under every note, and the Note names choice above it", "The score with its names. Above it: how the names are written.")}
<p>When the reading is done, the score is drawn again with a name under every note:</p>
<ul>
  <li>The sharps and flats of the <b>key signature</b> and of the <b>accidentals</b> are included: in G major every F is named F♯. See ${link("en", "sharps-and-flats", "sharps, flats, and key signatures")}.</li>
  <li><b>Chords</b> get their names stacked, the highest note on top.</li>
  <li>A note <b>tied</b> from the one before gets no name (it is the same sound held on). Rests get no name.</li>
  <li>In a piano score, both staves get names.</li>
</ul>
<p>Above the score, <b>Note names</b> chooses the system. Pitch names, where C is always Do: ドレミ (katakana), C D E, Do Re Mi, 도레미, German (C D E … H), or До Ре Ми. Names in the key, where the first note of the key is Do: ドレミ or Do Re Mi with movable Do, Chinese numbered 1 2 3, or Indian Sa Re Ga. The app remembers your choice. For what each system means, see the ${link("en", "note-name-chart", "note name chart")}.</p>

<h2 id="listen">5. Check by ear</h2>
<p>The reading can contain mistakes, and a wrong note gets a wrong name. Press ▶ to hear the score while a blue cursor moves along the staff: a wrong pitch or rhythm is easier to hear than to see. ❚❚ pauses, ■ stops and goes back to the beginning, and clicking a note moves the cursor there. Change the tempo with −5 / +5, the number, or the slider.</p>

<h2 id="edit">6. Fix mistakes</h2>
${shot("en", "app-edit", "The editor: a piano roll with the notes of the upper staff as black boxes and measure 4 highlighted with an exclamation mark", "The editor. Measures whose beats did not add up are marked with “!”.")}
<p>Switch to <b>Edit</b> to see the notes as boxes on a piano roll: up and down is the pitch, left to right is time. Drag a box to move it, drag its right edge to change its length, click an empty spot to add a note, and right-click (or press <kbd>Delete</kbd>) to remove one. Measures marked <b>!</b> had too many or too few beats when they were read, so start with those. Switch back to <b>Score</b>: the staff and the names are drawn again with your changes. See ${link("en", "fix-errors", "how to fix reading mistakes")}.</p>

<h2 id="transpose">7. Transpose</h2>
${shot("en", "app-practice", "Practice mode with Transpose +2: the key signature has two sharps and the names include F♯ and C♯", "Transposed up 2 semitones: the names follow the new key.")}
<p>Press <b>Practice mode</b>, then − and + next to <b>Transpose</b> to move the music down or up a semitone at a time (up to an octave). The key signature changes, and the names are written for the new pitches. Practice mode also has a metronome and a count-in.</p>

<h2 id="print">8. Print, save as images, share</h2>
${shot("en", "app-actions", "The three large buttons under the score: Print, Save image, and Share, and under them Save as MusicXML and the Made with Note Namer checkbox", "Under the score: Print, Save image, Share.")}
<p>The three buttons under the score turn the score with its names into A4 pages:</p>
<ul>
  <li><b>Print</b>: prints the pages only (no buttons). To make a PDF, choose “Save as PDF” in the print dialog.</li>
  <li><b>Save image</b>: saves each page as a PNG image.</li>
  <li><b>Share</b>: sends the page images through your phone's share menu (messages, mail, …). If the browser asks for another tap, press Share again. Where images cannot be shared, they are saved and the app's link is shared or copied.</li>
</ul>
${image("page-en.webp", 700, 990, "An A4 page: the title Ode to Joy, the score on two staves with a name under every note, and a small line at the bottom", "A saved page. The line at the bottom gives the title and “Made with Note Namer”.", "shot")}
<p>Each page has a small line at the bottom with the title and “Made with Note Namer”, so people who get the picture can find the app. To leave out the app's name, untick <b>Add “Made with Note Namer” under printed and saved pages</b> under the buttons. <b>Save as MusicXML (with note names)</b>, next to it, saves a file that opens in MuseScore and most notation programs with the names as lyrics.</p>

<h2 id="recent">9. Recent scores</h2>
<p>The title of the score is shown above it: the title written in a MusicXML file, or the date and time it was read. Click it to rename it; the printed pages use it. The last 10 scores are kept in the browser and listed under <b>Recent scores</b>; tap one to open it again. <b>Clear history</b> removes the list, and <b>Clear</b> removes the open score.</p>

<h2 id="trouble">When it does not work</h2>
<div class="table-wrap">
<table class="text stack">
<thead><tr><th scope="col">Message or problem</th><th scope="col">What to try</th></tr></thead>
<tbody>
<tr><th scope="row">“This browser cannot run the reading engine”</th><td>Update your iPhone to iOS 27.2 or later and use Safari, or use the latest Chrome on Android or Chrome or Edge on a computer.</td></tr>
<tr><th scope="row">“No staves or notes were found”</th><td>Use a sharper photo or a scan, with the whole page in the frame and the page filling most of it.</td></tr>
<tr><th scope="row">“The browser ran out of memory”</th><td>Close other tabs, or read fewer pages at a time.</td></tr>
<tr><th scope="row">All the names are a sharp or flat off</th><td>The key signature may have been read wrong. Compare the first line with the paper (see ${link("en", "fix-errors", "how to fix reading mistakes")}).</td></tr>
<tr><th scope="row">Share does not send the images</th><td>Press Share again. Some browsers can share only the link; the images are then saved to your downloads.</td></tr>
</tbody>
</table>
</div>
<p>More answers are in the ${link("en", "faq", "FAQ")}.</p>
`,
  },
  ja: {
    title: "楽譜にドレミを振る方法：写真を撮るだけで音名付きの楽譜に（使い方ガイド）",
    heading: "楽譜にドレミを振る方法（使い方ガイド）",
    nav: "使い方ガイド",
    description: "Note Namer の使い方を画面つきで解説。楽譜を写真に撮ると、すべての音符の下にドレミ（音名）を書きます。♯・♭ も反映。書き方の選び方、聴いて確かめる、間違いの直し方、印刷・画像保存・共有まで。",
    body: () => `
<p class="lead">Note Namer は、印刷された楽譜の写真・画像・PDF を読み取って、すべての音符の下に音名（ドレミ・C D E・Do Re Mi・도레미）を書くアプリです。調号や臨時記号の ♯・♭ も反映します。練習用に印刷したり、楽譜を読むのが苦手な人に送ったりできます。このガイドでは、画面を見ながら順に使い方を説明します。</p>

<nav class="toc" aria-label="目次"><b>目次</b><ol>
  <li><a href="#need">必要なもの</a></li>
  <li><a href="#sample">最初の画面</a></li>
  <li><a href="#open">自分の楽譜を開く</a></li>
  <li><a href="#read">読み取りを待つ</a></li>
  <li><a href="#names">音名の書き方を選ぶ</a></li>
  <li><a href="#listen">聴いて確かめる</a></li>
  <li><a href="#edit">間違いを直す</a></li>
  <li><a href="#transpose">移調する</a></li>
  <li><a href="#print">印刷・画像で保存・共有</a></li>
  <li><a href="#recent">最近の楽譜</a></li>
  <li><a href="#trouble">うまくいかないとき</a></li>
</ol></nav>

<h2 id="need">必要なもの</h2>
<ul>
  <li><b>iPhone の Safari（iOS 27.2 以降）、Android の Chrome（137 以降）、または PC の Chrome・Edge（137 以降）。</b>読み取りエンジンには JavaScript Promise Integration（JSPI）というブラウザの機能が必要で、ないブラウザでは案内を表示します。新しい Firefox（153 以降）・Mac や iPad の Safari（27 以降）にもこの機能はありますが、動作は確認していません。</li>
  <li><b>初めて写真を読み取るときだけインターネット接続。</b>読み取りエンジン（約 130MB）を 1 回だけダウンロードしてブラウザに保存します。次からはオフラインでも使えます。</li>
  <li><b>印刷された五線譜。</b>手書きの楽譜とタブ譜には対応していません。</li>
</ul>
<p>無料で、登録も要りません。読み取りはブラウザの中で行うので、楽譜がアップロードされることはありません。</p>

<h2 id="sample">1. 最初の画面</h2>
${shot("ja", "app-start", "開いたときの画面。「ファイルを選ぶ」「写真を撮る」のある「楽譜を開く」パネルと、すべての音符にドレミが付いた見本の「歓喜の歌」", "最初の画面。見本の楽譜が表示されています。")}
<p>楽譜を開いていないときは、見本の「歓喜の歌」を、すべての音符にドレミが付いた状態で表示します。自分の楽譜で試す前に、どんなふうになるかを見られます。ダウンロードは要りません。自分の楽譜を開くと入れ替わり、見本は「最近の楽譜」には残りません。</p>

<h2 id="open">2. 自分の楽譜を開く</h2>
<p>楽譜の開き方は 3 つあります。</p>
<ul>
  <li><b>写真を撮る</b>：スマホではカメラが開きます。楽譜を平らにして、正面から、枠いっぱいに撮ってください。</li>
  <li><b>ファイルを選ぶ</b>：画像（JPEG・PNG・WebP など）や PDF。</li>
  <li>パネルにファイルを<b>ドロップ</b>する（PC）。</li>
</ul>
<p>選んだファイルは一覧に（${MAX_FILES} 個まで）、選んだ順に番号が付いて並びます。ハンドルをドラッグすると順番を変えられます。「<b>楽譜を読み取る</b>」を押すと、並んだ順に読み取って 1 つの楽譜につなげます。MusicXML のファイル（<code>.musicxml</code>・<code>.mxl</code>・<code>.xml</code>）は、読み取りなしですぐに開きます。</p>
${shot("ja", "app-list", "読み取るファイルの一覧。1・2 の番号が付いた 2 枚の写真に、それぞれ削除ボタンとハンドルがあり、その下に「楽譜を読み取る」ボタンがある", "読み取るファイルが順番に並びます。ハンドル（≡）をドラッグすると順番を変えられます。")}
<p>写真の撮り方で結果が変わります。${link("ja", "photo-tips", "楽譜をきれいに読み取る撮り方のコツ")}もご覧ください。</p>

<h2 id="read">3. 読み取りを待つ</h2>
${shot("ja", "app-reading", "読み取り中の画面。「段ごとに読み取り中」と進み具合が出ている", "読み取り中は、パネルに今の作業と進み具合が出ます。")}
<p>アプリは五線と音符の位置を見つけ、段ごとに音符を読み取ります。端末の性能と段の数によって、1 ページ 10〜60 秒ほどかかります。初回は、その前にエンジンのダウンロードが入ります。途中で「キャンセル」もできます。</p>

<h2 id="names">4. 音名の書き方を選ぶ</h2>
${shot("ja", "app-names", "写真から読み取った楽譜。すべての音符の下にドレミが書かれ、上に「音名」の選択がある", "音名付きの楽譜。上で書き方を選べます。")}
<p>読み取りが終わると、すべての音符の下に音名を書いた楽譜が表示されます。</p>
<ul>
  <li><b>調号</b>と<b>臨時記号</b>の ♯・♭ を反映します。ト長調の楽譜なら、ファはすべて「ファ♯」です。${link("ja", "sharps-and-flats", "♯・♭と調号の読み方")}もご覧ください。</li>
  <li><b>和音</b>は、高い音から順に縦に並べます。</li>
  <li><b>タイ</b>でつながった後ろの音（同じ音をのばしているだけ）と休符には書きません。</li>
  <li>ピアノの楽譜では、上下両方の五線に書きます。</li>
</ul>
<p>楽譜の上の<b>音名</b>で書き方を選べます。C がいつもドの音名（ドレミ（カタカナ）・C D E・Do Re Mi・도레미・ドイツ式・До Ре Ми）と、調の主音をドにする書き方（ドレミの移動ド・Do Re Mi の移動ド・数字譜・インドの Sa Re Ga）があります。選んだ書き方は次に開いたときも残っています。書き方の違いは${link("ja", "note-name-chart", "音名の対応表")}をご覧ください。</p>

<h2 id="listen">5. 聴いて確かめる</h2>
<p>読み取りには間違いが含まれることがあり、音符を読み違えると音名も違ってしまいます。▶ を押すと、青いカーソルが五線の上を進みながら音が鳴ります。音の高さやリズムの間違いは、見るより聴くほうが見つけやすいものです。❚❚ で一時停止、■ で止めて最初に戻り、音符をクリックするとカーソルがそこに移ります。テンポは −5／+5、数字、スライダーで変えられます。</p>

<h2 id="edit">6. 間違いを直す</h2>
${shot("ja", "app-edit", "編集画面。上段の音符が黒い四角でピアノロールに並び、4 小節目が「!」付きで色づけされている", "編集画面。拍の合計が合わなかった小節には「!」が付きます。")}
<p><b>編集</b>に切り替えると、音符がピアノロールの上の四角で表示されます。上下が音の高さ、左右が時間です。四角をドラッグで移動、右端をドラッグで長さを変更、空いている所をクリックで追加、右クリック（または <kbd>Delete</kbd>）で削除できます。<b>!</b> の付いた小節は、読み取ったときに拍の数が合わなかった小節なので、そこから確かめてください。<b>楽譜</b>に戻ると、直した内容で五線譜と音名を描き直します。${link("ja", "fix-errors", "読み取りミスの見つけ方と直し方")}もご覧ください。</p>

<h2 id="transpose">7. 移調する</h2>
${shot("ja", "app-practice", "練習モードで移調 +2 にした画面。調号が ♯ 2 つになり、音名にファ♯ やド♯ がある", "半音 2 つ上に移調したところ。音名も新しい調に合わせて変わります。")}
<p><b>練習モード</b>を押し、<b>移調</b>の −／+ で半音ずつ（上下 1 オクターブまで）移調できます。調号も変わり、音名は移調した高さで書き直します。練習モードにはメトロノームとカウントインもあります。</p>

<h2 id="print">8. 印刷・画像で保存・共有</h2>
${shot("ja", "app-actions", "楽譜の下の大きな 3 つのボタン（印刷、画像を保存、共有）と、その下の「MusicXML（音名入り）で保存」と「Note Namer で作成」のチェック", "楽譜の下の「印刷」「画像を保存」「共有」。")}
<p>楽譜の下の 3 つのボタンで、音名付きの楽譜を A4 のページにします。</p>
<ul>
  <li><b>印刷</b>：ページだけを印刷します（ボタン類は印刷されません）。PDF にするときは、印刷画面で「PDF に保存」を選んでください。</li>
  <li><b>画像を保存</b>：ページごとに PNG 画像で保存します。</li>
  <li><b>共有</b>：スマホの共有メニュー（LINE・メッセージ・メールなど）でページの画像を送ります。もう一度押すよう案内が出たら、もう一度「共有」を押してください。画像を共有できないブラウザでは、画像を保存してからアプリのリンクを共有（またはコピー）します。</li>
</ul>
${image("page-ja.webp", 700, 990, "A4 のページ。タイトル「歓喜の歌」、2 段の楽譜のすべての音符の下にドレミ、いちばん下に小さな文字", "保存したページ。いちばん下にタイトルと「Note Namer で作成」が入ります。", "shot")}
<p>各ページのいちばん下には、タイトルと「Note Namer で作成」を小さく入れています（画像を受け取った人がアプリにたどり着けるように）。アプリ名を入れたくないときは、ボタンの下の<b>印刷・保存するページの下に「Note Namer で作成」と入れる</b>のチェックを外してください。その隣の <b>MusicXML（音名入り）で保存</b>は、音名を歌詞として入れた楽譜のファイルで、MuseScore などの楽譜ソフトで開けます。</p>

<h2 id="recent">9. 最近の楽譜</h2>
<p>楽譜の上には、タイトルを表示します。MusicXML に書かれたタイトルか、なければ読み取った日時です。クリックすると名前を変えられ、印刷するページにもこのタイトルが入ります。最近開いた 10 曲はブラウザに保存され、<b>最近の楽譜</b>から開き直せます。<b>履歴を消去</b>で一覧を消し、<b>クリア</b>で開いている楽譜を消します。</p>

<h2 id="trouble">うまくいかないとき</h2>
<div class="table-wrap">
<table class="text stack">
<thead><tr><th scope="col">メッセージ・症状</th><th scope="col">試すこと</th></tr></thead>
<tbody>
<tr><th scope="row">「このブラウザでは読み取りエンジンを動かせません」</th><td>iPhone を iOS 27.2 以降に更新して Safari で開くか、Android か PC の最新の Chrome（PC は Edge も可）で開いてください。</td></tr>
<tr><th scope="row">「五線や音符が見つかりませんでした」</th><td>ページ全体が入り、画面の大部分を楽譜が占める、はっきりした写真かスキャンでお試しください。</td></tr>
<tr><th scope="row">「ブラウザのメモリが足りなくなりました」</th><td>ほかのタブを閉じるか、一度に読むページを減らしてください。</td></tr>
<tr><th scope="row">音名がどれも ♯・♭ の分だけずれている</th><td>調号を読み違えた可能性があります。最初の段を元の楽譜と見比べてください（${link("ja", "fix-errors", "読み取りミスの直し方")}）。</td></tr>
<tr><th scope="row">「共有」で画像が送れない</th><td>もう一度「共有」を押してください。リンクしか共有できないブラウザでは、画像はダウンロードフォルダに保存されます。</td></tr>
</tbody>
</table>
</div>
<p>ほかの疑問は${link("ja", "faq", "よくある質問")}にまとめています。</p>
`,
  },
};
