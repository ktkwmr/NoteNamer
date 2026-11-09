// How to read the pitch of a note on the staff (treble and bass clef), with pictures made by
// scripts/render-guide-images.mjs (staff-treble-*.webp, staff-bass-*.webp).
import { link, image } from "./parts.mjs";

// Lines and spaces, bottom to top, as [letter name, katakana]
const TREBLE_LINES = [["E", "ミ"], ["G", "ソ"], ["B", "シ"], ["D", "レ"], ["F", "ファ"]];
const TREBLE_SPACES = [["F", "ファ"], ["A", "ラ"], ["C", "ド"], ["E", "ミ"]];
const BASS_LINES = [["G", "ソ"], ["B", "シ"], ["D", "レ"], ["F", "ファ"], ["A", "ラ"]];
const BASS_SPACES = [["A", "ラ"], ["C", "ド"], ["E", "ミ"], ["G", "ソ"]];

function table(L, i) {
  const r = (head, list) => `<tr><th scope="row">${head}</th><td>${list.map((n) => n[i]).join(" – ")}</td></tr>`;
  return `<div class="table-wrap"><table class="text">
<thead><tr><th scope="col">${L.where}</th><th scope="col">${L.bottomUp}</th></tr></thead>
<tbody>
${r(L.tLines, TREBLE_LINES)}
${r(L.tSpaces, TREBLE_SPACES)}
${r(L.bLines, BASS_LINES)}
${r(L.bSpaces, BASS_SPACES)}
</tbody></table></div>`;
}

export default {
  slug: "reading-notes",
  published: "2026-11-08",
  en: {
    title: "How to Read Notes on the Staff: Treble and Bass Clef (with Pictures)",
    heading: "How to read notes on the staff",
    nav: "Reading notes on the staff",
    description: "Learn the names of the notes on the treble and bass clef: the lines and spaces, middle C and ledger lines, easy ways to remember them, and pictures with every note named.",
    body: () => `
<p class="lead">The height of a note on the five lines of the staff tells you its pitch. Once you know where one note is, you can count up and down to the others, one step for each line and space. This page shows the notes of the treble and bass clef, with a name under every note.</p>

<h2 id="staff">Lines and spaces</h2>
<p>The staff has five lines and four spaces between them. A note sits either on a line (the line goes through it) or in a space. Going up from a line to the next space, or from a space to the next line, is one step in the alphabet: C, D, E, F, G, A, B, and then C again.</p>
<p>The clef at the start of the staff says which note is where. Without it, the lines have no names.</p>

<h2 id="treble">Treble clef (G clef)</h2>
${image("staff-treble-en.webp", 1100, 143, "A treble staff with the notes from middle C up to high C, each named: C D E F G A B C D E F G A B C", "The treble clef from middle C to high C.")}
<p>The treble clef curls around the second line from the bottom: that line is <b>G</b> (the G above middle C), which is why it is also called the G clef. It is used for the right hand on the piano, for most singers, and for violin, flute, trumpet, and recorder.</p>
<ul>
  <li>Lines, from the bottom: <b>E G B D F</b>, “<b>E</b>very <b>G</b>ood <b>B</b>oy <b>D</b>oes <b>F</b>ine”.</li>
  <li>Spaces, from the bottom: <b>F A C E</b>, which spells “FACE”.</li>
</ul>

<h2 id="bass">Bass clef (F clef)</h2>
${image("staff-bass-en.webp", 1100, 143, "A bass staff with the notes from low C up to middle C, each named: C D E F G A B C D E F G A B C", "The bass clef from low C to middle C.")}
<p>The two dots of the bass clef sit on either side of the fourth line from the bottom: that line is <b>F</b> (the F below middle C), so it is also called the F clef. It is used for the left hand on the piano, and for cello, bassoon, trombone, and low voices.</p>
<ul>
  <li>Lines, from the bottom: <b>G B D F A</b>, “<b>G</b>ood <b>B</b>oys <b>D</b>o <b>F</b>ine <b>A</b>lways”.</li>
  <li>Spaces, from the bottom: <b>A C E G</b>, “<b>A</b>ll <b>C</b>ows <b>E</b>at <b>G</b>rass”.</li>
</ul>
${table({ where: "Where", bottomUp: "Notes, from the bottom", tLines: "Treble clef, lines", tSpaces: "Treble clef, spaces", bLines: "Bass clef, lines", bSpaces: "Bass clef, spaces" }, 0)}

<h2 id="middle-c">Middle C and ledger lines</h2>
<p>Notes above or below the staff get short extra lines, called <b>ledger lines</b>. <b>Middle C</b> (the C near the middle of the piano, C4) is written on one ledger line just below the treble staff, and on one ledger line just above the bass staff. In a piano score the two staves meet at middle C, so it is a good note to find first.</p>

<h2 id="tips">Reading faster</h2>
<ul>
  <li><b>Use landmarks.</b> Learn a few notes by heart (middle C, the G of the treble clef, the F of the bass clef) and count steps from the nearest one.</li>
  <li><b>Read the shape.</b> Notes that move line → space → line go up or down one step at a time; a jump from line to line skips one note.</li>
  <li><b>Check the key signature.</b> The sharps and flats at the start of each line change some notes everywhere in the piece. See ${link("en", "sharps-and-flats", "sharps, flats, and key signatures")}.</li>
</ul>

<h2 id="app">Let the app write the names</h2>
<p>Note Namer writes the name under every note of a photographed score, with the sharps and flats of the key signature already included. Use it to check your own reading: name a line yourself, then compare. The names can be letters (C D E), Do Re Mi, ドレミ, or 도레미 (see the ${link("en", "note-name-chart", "note name chart")}), and the page can be printed. See ${link("en", "guide", "the guide")}.</p>
`,
  },
  ja: {
    title: "五線譜の音の読み方：ト音記号とヘ音記号（図つき）",
    heading: "五線譜の音の読み方（ト音記号・ヘ音記号）",
    nav: "五線譜の音の読み方",
    description: "ト音記号とヘ音記号の楽譜で、音の高さ（ドレミ）を読む方法。線と間の音、真ん中のドと加線、覚え方のコツを、すべての音符にドレミを書いた図で説明します。",
    body: () => `
<p class="lead">五線の上のどの高さに音符があるかで、音の高さが決まります。1 つの音の位置がわかれば、線と間を 1 つずつ数えてほかの音もわかります。このページでは、ト音記号とヘ音記号の音を、すべての音符にドレミを書いた図で説明します。</p>

<h2 id="staff">線と間</h2>
<p>五線には 5 本の線と、そのあいだの 4 つの「間（かん）」があります。音符は線の上（線が玉の真ん中を通る）か、間に書かれます。線から 1 つ上の間、間から 1 つ上の線へ進むと、音は 1 つ上がります（ド → レ → ミ → ファ → ソ → ラ → シ → ド）。</p>
<p>どの線がどの音かは、五線のはじめの音部記号で決まります。音部記号がないと、線に名前はありません。</p>

<h2 id="treble">ト音記号（高音部記号）</h2>
${image("staff-treble-ja.webp", 1100, 143, "ト音記号の五線に、真ん中のドから高いドまでの音符があり、それぞれ下にドレミファソラシドレミファソラシドと書いてある", "ト音記号の、真ん中のドから 2 オクターブ上のドまで。")}
<p>ト音記号は、下から 2 本目の線に巻きつくように書きます。この線が<b>ソ</b>（ト音 = G の音）です。ピアノの右手、歌、バイオリン、フルート、トランペット、リコーダー、鍵盤ハーモニカなどの楽譜に使います。</p>
<ul>
  <li>線（下から）：<b>ミ・ソ・シ・レ・ファ</b></li>
  <li>間（下から）：<b>ファ・ラ・ド・ミ</b></li>
  <li>下に線を 1 本足した位置（下第 1 線）が<b>真ん中のド</b>です。</li>
</ul>

<h2 id="bass">ヘ音記号（低音部記号）</h2>
${image("staff-bass-ja.webp", 1100, 143, "ヘ音記号の五線に、低いドから真ん中のドまでの音符があり、それぞれ下にドレミファソラシドレミファソラシドと書いてある", "ヘ音記号の、低いドから真ん中のドまで。")}
<p>ヘ音記号の 2 つの点は、下から 4 本目の線をはさんでいます。この線が<b>ファ</b>（ヘ音 = F の音）です。ピアノの左手、チェロ、ファゴット、トロンボーン、男声の低いパートなどに使います。</p>
<ul>
  <li>線（下から）：<b>ソ・シ・レ・ファ・ラ</b></li>
  <li>間（下から）：<b>ラ・ド・ミ・ソ</b></li>
  <li>上に線を 1 本足した位置（上第 1 線）が<b>真ん中のド</b>です。</li>
</ul>
${table({ where: "場所", bottomUp: "音（下から）", tLines: "ト音記号の線", tSpaces: "ト音記号の間", bLines: "ヘ音記号の線", bSpaces: "ヘ音記号の間" }, 1)}

<h2 id="middle-c">真ん中のドと加線</h2>
<p>五線より高い音・低い音は、短い線を足して書きます。この線を<b>加線</b>といいます。ピアノの真ん中あたりにある<b>真ん中のド</b>（C4）は、ト音記号では五線のすぐ下に加線 1 本、ヘ音記号では五線のすぐ上に加線 1 本で書きます。ピアノの楽譜では、上下の五線が真ん中のドでつながっているので、最初に見つけておくと便利です。</p>

<h2 id="tips">速く読むコツ</h2>
<ul>
  <li><b>目印の音を覚える。</b>真ん中のド、ト音記号のソ、ヘ音記号のファなど、いくつかの音を覚えておき、近い目印から数えます。</li>
  <li><b>形で読む。</b>線 → 間 → 線と動く音は 1 つずつ上がり下がりし、線から線へ跳ぶと 1 つ飛ばしになります。</li>
  <li><b>調号を確かめる。</b>各段のはじめの ♯・♭ は、曲全体でその音を変えます。${link("ja", "sharps-and-flats", "♯・♭と調号の読み方")}をご覧ください。</li>
</ul>

<h2 id="app">アプリに音名を書いてもらう</h2>
<p>Note Namer は、写真に撮った楽譜のすべての音符の下に音名を書きます。調号の ♯・♭ も反映します。自分で読んだ音の答え合わせにも使えます（1 段読んでから見比べる）。書き方はドレミ・C D E・Do Re Mi・도레미から選べ（${link("ja", "note-name-chart", "音名の対応表")}）、印刷もできます。手順は${link("ja", "guide", "使い方ガイド")}をご覧ください。</p>
`,
  },
};
