// Note names in different languages: a chart made from the app's own tables (note-names.mjs) plus
// systems the app does not write (Japanese ハニホ, German).
import { link } from "./parts.mjs";
import { SYSTEMS } from "../../public/notenamer/note-names.mjs";

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
// Systems shown in the chart that the app does not offer
const IROHA = ["ハ", "ニ", "ホ", "ヘ", "ト", "イ", "ロ"];
const GERMAN = ["C", "D", "E", "F", "G", "A", "H"];
const KOREAN_LETTERS = ["다", "라", "마", "바", "사", "가", "나"];

const row = (head, cells, lang) => `<tr><th scope="row">${head}</th>${cells.map((c) => `<td${lang ? ` lang="${lang}"` : ""}>${c}</td>`).join("")}</tr>`;
function chart(L) {
  const rows = [
    [L.solfege, SYSTEMS.solfege.names, "it"],
    [L.katakana, SYSTEMS.katakana.names, "ja"],
    [L.hiragana, SYSTEMS.hiragana.names, "ja"],
    [L.iroha, IROHA, "ja"],
    [L.korean, SYSTEMS.korean.names, "ko"],
    [L.koreanLetters, KOREAN_LETTERS, "ko"],
    [L.german, GERMAN, "de"],
  ];
  return `<div class="table-wrap"><table class="num">
<thead><tr><th scope="col">${L.letter}</th>${LETTERS.map((x) => `<th scope="col">${x}</th>`).join("")}</tr></thead>
<tbody>
${rows.map(([h, c, lang]) => row(h, c, lang)).join("\n")}
</tbody></table></div>`;
}
// Sharps and flats in each language: F♯ and B♭ as examples
function accidentals(L) {
  return `<div class="table-wrap"><table class="text">
<thead><tr><th scope="col">${L.system}</th><th scope="col">♯ (F♯)</th><th scope="col">♭ (B♭)</th></tr></thead>
<tbody>
${L.acc.map(([h, s, f]) => `<tr><th scope="row">${h}</th><td>${s}</td><td>${f}</td></tr>`).join("\n")}
</tbody></table></div>`;
}

const EN = {
  system: "System", letter: "Letters (English)", solfege: "Do Re Mi (fixed Do)", katakana: "Japanese ドレミ (katakana)", hiragana: "Japanese どれみ (hiragana)",
  iroha: "Japanese ハニホ", korean: "Korean 도레미", koreanLetters: "Korean 다라마", german: "German",
  acc: [
    ["English", "F sharp", "B flat"],
    ["Italian", "Fa diesis", "Si bemolle"],
    ["French", "Fa dièse", "Si bémol"],
    ["Spanish", "Fa sostenido", "Si bemol"],
    ["Japanese ドレミ", "ファ♯（ファのシャープ）", "シ♭（シのフラット）"],
    ["Japanese ハニホ", "嬰ヘ (ei-he)", "変ロ (hen-ro)"],
    ["Korean", "올림바 (ollim-ba)", "내림나 (naerim-na)"],
    ["German", "Fis", "B (not Hes)"],
  ],
};
const JA = {
  system: "書き方", letter: "英語（アルファベット）", solfege: "イタリア語（固定ド）", katakana: "ドレミ（カタカナ）", hiragana: "どれみ（ひらがな）",
  iroha: "日本語（ハニホ）", korean: "韓国語（도레미）", koreanLetters: "韓国語（다라마）", german: "ドイツ語",
  acc: [
    ["英語", "F sharp（エフ・シャープ）", "B flat（ビー・フラット）"],
    ["イタリア語", "Fa diesis（ファ・ディエズィス）", "Si bemolle（シ・ベモッレ）"],
    ["フランス語", "Fa dièse（ファ・ディエーズ）", "Si bémol（シ・ベモル）"],
    ["スペイン語", "Fa sostenido", "Si bemol"],
    ["ドレミ", "ファ♯（ファのシャープ）", "シ♭（シのフラット）"],
    ["日本語（ハニホ）", "嬰ヘ（えいへ）", "変ロ（へんろ）"],
    ["韓国語", "올림바（オルリムバ）", "내림나（ネリムナ）"],
    ["ドイツ語", "Fis（フィス）", "B（ベー）"],
  ],
};

export default {
  slug: "note-name-chart",
  published: "2026-11-08",
  en: {
    title: "Note Names in Different Languages: C D E, Do Re Mi, ドレミ, 도레미 (Chart)",
    heading: "Note names in different languages",
    nav: "Note name chart",
    description: "A chart of the note names C D E F G A B in English, Do Re Mi (fixed Do), Japanese ドレミ and ハニホ, Korean 도레미, and German (where B is H), with how sharps and flats are said in each language.",
    body: () => `
<p class="lead">The same seven notes have different names around the world. English uses the letters C to B; Italy, France, Spain, Latin America, and many other countries sing Do Re Mi; Japan and Korea use both Do Re Mi and their own names. This chart lines them up, so you can read a score written for another country, or follow a teacher who uses another system.</p>

<h2 id="chart">The seven notes</h2>
${chart(EN)}
<p class="cap">Each column is the same note (the white keys of a piano from C upward).</p>
<ul>
  <li><b>German</b> calls B “H”, and uses “B” for B flat. A German score that says “B” means B♭.</li>
  <li><b>Japanese ハニホ</b> (ha-ni-ho) comes from the Japanese syllable order いろは. It is used mainly for key names: ハ長調 is C major, ト長調 is G major.</li>
  <li><b>Korean 다라마</b> works the same way for key names: 다장조 is C major.</li>
  <li><b>Sol</b> is sometimes written “So”, and <b>Si</b> is “Ti” in the English-speaking tonic sol-fa tradition.</li>
</ul>

<h2 id="accidentals">Sharps and flats</h2>
${accidentals(EN)}
<p class="cap">How F sharp and B flat are said. German adds “-is” for a sharp and “-es” for a flat (Cis, Es, As), with B for B♭.</p>
<p>A sharp (♯) raises a note by a semitone, and a flat (♭) lowers it. In Note Namer the sign is written after the name: F♯, ファ♯, 파♯. For how the key signature changes the names, see ${link("en", "sharps-and-flats", "sharps, flats, and key signatures")}.</p>

<h2 id="fixed-movable">Fixed Do and movable Do</h2>
<p>Do Re Mi is used in two ways:</p>
<ul>
  <li><b>Fixed Do</b>: Do is always C, whatever the key. This is how note names are used in Italy, France, Spain, and in many piano lessons in Japan.</li>
  <li><b>Movable Do</b>: Do is the first note of the key (in G major, G is Do). It shows how notes relate in the scale, and is common in singing classes and in Japanese and Korean school music.</li>
</ul>
<p>Note Namer writes <b>fixed</b> names: C is always Do (ド, 도), and a sharp or flat is shown as a sign. Letters (C D E) are fixed by nature.</p>

<h2 id="app">Choosing the names in Note Namer</h2>
<p>Above the score, <b>Note names</b> offers five ways: ドレミ (katakana), どれみ (hiragana), C D E (letters), Do Re Mi (fixed Do), and 도레미 (Korean). The first choice follows your browser's language, and the app remembers your choice. ハニホ and German names are not offered. See ${link("en", "guide", "the guide")} for the steps.</p>
`,
  },
  ja: {
    title: "音名の対応表：ドレミ・CDE・ハニホ・ドイツ音名・도레미",
    heading: "音名の対応表（ドレミ・CDE・ハニホ・ドイツ音名）",
    nav: "音名の対応表",
    description: "ドレミと C D E、日本語のハニホ、ドイツ音名（シは H）、韓国語の도레미の対応表。♯・♭ の呼び方（嬰・変、シャープ・フラット、Fis・B）と、固定ドと移動ドの違いもまとめました。",
    body: () => `
<p class="lead">同じ 7 つの音でも、国や場面によって呼び方が違います。英語は C〜B のアルファベット、イタリア・フランス・スペインなどはドレミ、日本と韓国ではドレミと自分の国の呼び方の両方を使います。外国の楽譜を読むときや、先生と呼び方が違うときのために、対応表にまとめました。</p>

<h2 id="chart">7 つの音の呼び方</h2>
${chart(JA)}
<p class="cap">縦の列が同じ音です（ピアノの白鍵を C から順に）。</p>
<ul>
  <li><b>ドイツ音名</b>では、シを「H（ハー）」と呼び、「B（ベー）」はシ♭のことです。ドイツの楽譜の「B」はシ♭なので注意してください。</li>
  <li><b>ハニホ</b>は、いろは順を音に当てたものです。主に調の名前に使います（ハ長調 = ドから始まる長調、ト長調 = ソから始まる長調）。</li>
  <li><b>韓国語の다라마</b>も同じように調の名前に使います（다장조 = ハ長調）。</li>
  <li>ソは「Sol」、シは英語圏の階名では「Ti」と書くこともあります。</li>
</ul>

<h2 id="accidentals">♯・♭ の呼び方</h2>
${accidentals(JA)}
<p class="cap">ファ♯ とシ♭ の呼び方。ドイツ語では ♯ に「-is」、♭ に「-es」を付けます（Cis、Es、As）。シ♭だけは B です。</p>
<p>♯（シャープ）は半音上げ、♭（フラット）は半音下げる記号です。Note Namer では音名のうしろに記号を付けて「ファ♯」「シ♭」のように書きます。調号で音名がどう変わるかは、${link("ja", "sharps-and-flats", "♯・♭と調号の読み方")}をご覧ください。</p>

<h2 id="fixed-movable">固定ドと移動ド</h2>
<p>ドレミには 2 つの使い方があります。</p>
<ul>
  <li><b>固定ド</b>：調に関係なく、C をいつもドと呼びます。イタリア・フランス・スペインの音名や、日本のピアノ教室で多い使い方です。</li>
  <li><b>移動ド</b>：その調の主音をドと呼びます（ト長調ならソの音がド）。音階の中での役割がわかるので、歌の練習や日本・韓国の学校の音楽でよく使われます。</li>
</ul>
<p>Note Namer が書くのは<b>固定ド</b>の音名です。C の音はいつも「ド」で、♯・♭ は記号で書きます。C D E の書き方は、もともと固定です。</p>

<h2 id="app">Note Namer での書き方の選び方</h2>
<p>楽譜の上の<b>音名</b>で、ドレミ（カタカナ）・どれみ（ひらがな）・C D E（英語）・Do Re Mi（固定ド）・도레미（韓国語）の 5 つから選べます。最初はブラウザの言語に合わせた書き方になり（日本語のページではカタカナ）、選んだ書き方は次に開いたときも残ります。ハニホとドイツ音名には対応していません。手順は${link("ja", "guide", "使い方ガイド")}をご覧ください。</p>
`,
  },
};
