// Sharps, flats, naturals, and key signatures, and how the app turns them into note names.
// The key signature table is computed (order of sharps / flats, the key names).
import { link } from "./parts.mjs";
import { noteName } from "../../public/notenamer/note-names.mjs";

const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];
// Major key for 0..7 sharps / flats, as [step, alter]; its relative minor is a minor third below
const MAJOR_SHARP = [["C", 0], ["G", 0], ["D", 0], ["A", 0], ["E", 0], ["B", 0], ["F", 1], ["C", 1]];
const MAJOR_FLAT = [["C", 0], ["F", 0], ["B", -1], ["E", -1], ["A", -1], ["D", -1], ["G", -1], ["C", -1]];
const MINOR_SHARP = [["A", 0], ["E", 0], ["B", 0], ["F", 1], ["C", 1], ["G", 1], ["D", 1], ["A", 1]];
const MINOR_FLAT = [["A", 0], ["D", 0], ["G", 0], ["C", 0], ["F", 0], ["B", -1], ["E", -1], ["A", -1]];
const IROHA = { C: "ハ", D: "ニ", E: "ホ", F: "ヘ", G: "ト", A: "イ", B: "ロ" };

const enKey = ([s, a], minor) => noteName(s, a, "letter") + (minor ? " minor" : " major");
const jaKey = ([s, a], minor) => (a > 0 ? "嬰" : a < 0 ? "変" : "") + IROHA[s] + (minor ? "短調" : "長調");

// Rows: number of sharps / flats, the notes it changes (as names), and the keys
function keyTable(lang) {
  const L = lang === "ja"
    ? { sig: "調号", changed: "変わる音", major: "長調", minor: "短調", none: "なし", sharp: (n) => `♯ ${n} 個`, flat: (n) => `♭ ${n} 個`, sys: "katakana", key: jaKey }
    : { sig: "Key signature", changed: "Notes it changes", major: "Major key", minor: "Minor key", none: "none", sharp: (n) => `${n} sharp${n > 1 ? "s" : ""}`, flat: (n) => `${n} flat${n > 1 ? "s" : ""}`, sys: "letter", key: enKey };
  const rows = [];
  for (const [kind, order, majors, minors] of [["sharp", SHARP_ORDER, MAJOR_SHARP, MINOR_SHARP], ["flat", FLAT_ORDER, MAJOR_FLAT, MINOR_FLAT]]) {
    for (let n = kind === "sharp" ? 0 : 1; n <= 7; n++) {
      const changed = order.slice(0, n).map((s) => noteName(s, kind === "sharp" ? 1 : -1, L.sys)).join(" ");
      rows.push(`<tr><th scope="row">${n ? L[kind](n) : L.none}</th><td>${changed || "—"}</td><td style="white-space:nowrap">${L.key(majors[n], false)}</td><td style="white-space:nowrap">${L.key(minors[n], true)}</td></tr>`);
    }
  }
  return `<div class="table-wrap"><table class="text">
<thead><tr><th scope="col">${L.sig}</th><th scope="col">${L.changed}</th><th scope="col">${L.major}</th><th scope="col">${L.minor}</th></tr></thead>
<tbody>
${rows.join("\n")}
</tbody></table></div>`;
}

export default {
  slug: "sharps-and-flats",
  published: "2026-11-08",
  en: {
    title: "Sharps, Flats, and Key Signatures: How to Name the Notes",
    heading: "Sharps, flats, and key signatures",
    nav: "Sharps, flats, and key signatures",
    description: "What sharps (♯), flats (♭), and naturals (♮) do, how long an accidental lasts, how to read a key signature, and a table of every key signature with the notes it changes.",
    body: () => `
<p class="lead">A sharp or a flat changes a note by a semitone, and the key signature at the start of each line changes some notes for the whole piece. If you name the notes without them, many names come out wrong: in G major every F is F♯. This page explains the signs and the rules for how far they reach.</p>

<h2 id="signs">The signs</h2>
<div class="table-wrap"><table class="text">
<thead><tr><th scope="col">Sign</th><th scope="col">Name</th><th scope="col">What it does</th><th scope="col">Example</th></tr></thead>
<tbody>
<tr><th scope="row">♯</th><td>Sharp</td><td>Raises the note a semitone</td><td>F → F♯</td></tr>
<tr><th scope="row">♭</th><td>Flat</td><td>Lowers the note a semitone</td><td>B → B♭</td></tr>
<tr><th scope="row">♮</th><td>Natural</td><td>Cancels a sharp or flat (from the key signature or earlier in the measure)</td><td>F♯ → F</td></tr>
<tr><th scope="row">𝄪</th><td>Double sharp</td><td>Raises the note two semitones</td><td>F → F𝄪 (sounds as G)</td></tr>
<tr><th scope="row">𝄫</th><td>Double flat</td><td>Lowers the note two semitones</td><td>B → B𝄫 (sounds as A)</td></tr>
</tbody></table></div>

<h2 id="key-signature">Key signatures</h2>
<p>The sharps or flats right after the clef are the <b>key signature</b>. They apply to every note with that name, in every octave, on every line, until a new key signature appears. They are always written in the same order: sharps <b>F C G D A E B</b>, flats <b>B E A D G C F</b>. So one sharp is always F♯, and two flats are always B♭ and E♭.</p>
${keyTable("en")}
<p class="cap">Every key signature, the notes it changes, and the major and minor key that use it.</p>
<p>A quick way to name the key: with sharps, the major key is one semitone above the last sharp (last sharp F♯ → G major). With flats, it is the second-to-last flat (B♭ E♭ → B♭ major); one flat is F major.</p>

<h2 id="accidentals">Accidentals: until the bar line</h2>
<p>A sharp, flat, or natural written in front of a note (an <b>accidental</b>) lasts until the end of the measure, for that note at that height. After the bar line the key signature applies again. Two exceptions catch many readers:</p>
<ul>
  <li><b>Ties</b>: a note tied over the bar line keeps its accidental. The note after the bar line is the same sound continued.</li>
  <li><b>Courtesy accidentals</b>: many scores repeat a sign in the next measure, sometimes in brackets, as a reminder. It changes nothing.</li>
</ul>

<h2 id="names">How the names are written</h2>
<p>The sign goes after the name: F♯ (“F sharp”), B♭ (“B flat”). In Do Re Mi it is Fa♯ and Si♭, in Japanese ファ♯ and シ♭. F♯ and G♭ sound the same on a piano but are written differently; the name follows what is written. See the ${link("en", "note-name-chart", "note name chart")} for other languages.</p>

<h2 id="app">In Note Namer</h2>
<p>Note Namer names each note with its sharp or flat already applied: the key signature, the accidentals earlier in the measure, and ties are all taken into account, so a G major score gets F♯ everywhere. When you transpose, the key signature changes and the names follow the new key. If the key signature itself was read wrong, every name in the piece changes with it; check the first line against the paper (see ${link("en", "fix-errors", "how to fix reading mistakes")}).</p>
`,
  },
  ja: {
    title: "♯・♭と調号の読み方：ドレミの付け方と調号の一覧",
    heading: "♯・♭と調号の読み方",
    nav: "♯・♭と調号の読み方",
    description: "シャープ（♯）・フラット（♭）・ナチュラル（♮）の意味と、臨時記号が効く範囲、調号の読み方。すべての調号と変わる音・長調・短調の一覧表つき。ドレミを振るときの注意も。",
    body: () => `
<p class="lead">♯・♭ は音を半音変える記号で、各段のはじめの調号は曲全体でいくつかの音を変えます。これを見落としてドレミを振ると、多くの音名が間違いになります（たとえばト長調では、ファはすべてファ♯）。このページでは、記号の意味と、どこまで効くかのルールを説明します。</p>

<h2 id="signs">記号の意味</h2>
<div class="table-wrap"><table class="text">
<thead><tr><th scope="col">記号</th><th scope="col">名前</th><th scope="col">意味</th><th scope="col">例</th></tr></thead>
<tbody>
<tr><th scope="row">♯</th><td>シャープ（嬰記号）</td><td>半音上げる</td><td>ファ → ファ♯</td></tr>
<tr><th scope="row">♭</th><td>フラット（変記号）</td><td>半音下げる</td><td>シ → シ♭</td></tr>
<tr><th scope="row">♮</th><td>ナチュラル（本位記号）</td><td>♯・♭ を取り消す（調号やその小節の前の臨時記号）</td><td>ファ♯ → ファ</td></tr>
<tr><th scope="row">𝄪</th><td>ダブルシャープ</td><td>半音 2 つ上げる</td><td>ファ → ファ𝄪（ソと同じ高さ）</td></tr>
<tr><th scope="row">𝄫</th><td>ダブルフラット</td><td>半音 2 つ下げる</td><td>シ → シ𝄫（ラと同じ高さ）</td></tr>
</tbody></table></div>

<h2 id="key-signature">調号</h2>
<p>音部記号のすぐ右にある ♯・♭ を<b>調号</b>といいます。調号は、その音名のすべての音に、どのオクターブでも、どの段でも、次に調号が変わるまで効きます。書く順番は決まっていて、♯ は <b>ファ・ド・ソ・レ・ラ・ミ・シ</b>、♭ は <b>シ・ミ・ラ・レ・ソ・ド・ファ</b> の順です。♯ が 1 つならいつもファ♯、♭ が 2 つならいつもシ♭とミ♭です。</p>
${keyTable("ja")}
<p class="cap">すべての調号と、変わる音、その調号を使う長調・短調。</p>
<p>調の見分け方：♯ の調は、最後の ♯ の半音上の音が長調の主音です（最後がファ♯ → ト長調）。♭ の調は、最後から 2 つ目の ♭ が主音です（シ♭・ミ♭ → 変ロ長調）。♭ 1 つはヘ長調です。</p>

<h2 id="accidentals">臨時記号は小節の終わりまで</h2>
<p>音符の前に書かれた ♯・♭・♮（<b>臨時記号</b>）は、その小節の終わりまで、同じ高さの音に効きます。小節線を越えると、また調号どおりに戻ります。まちがえやすいのは次の 2 つです。</p>
<ul>
  <li><b>タイ</b>：小節線をまたいでタイでつながった音は、臨時記号が付いたままです。次の小節の音は、同じ音をのばしているだけです。</li>
  <li><b>念のための臨時記号</b>：次の小節に、確認のために（かっこ付きで）同じ記号を書く楽譜もあります。意味は変わりません。</li>
</ul>

<h2 id="names">音名の書き方</h2>
<p>音名のうしろに記号を付けて「ファ♯（ファのシャープ）」「シ♭（シのフラット）」と書きます。日本語の音名（ハニホ）では、♯ を「嬰」、♭ を「変」と言い、ファ♯は嬰ヘ、シ♭は変ロです。ファ♯とソ♭はピアノでは同じ鍵盤ですが、書き方が違い、音名は楽譜に書かれたとおりに付けます。ほかの言語の呼び方は${link("ja", "note-name-chart", "音名の対応表")}をご覧ください。</p>

<h2 id="app">Note Namer では</h2>
<p>Note Namer は、調号・その小節の前の臨時記号・タイをすべて反映した高さで音名を書きます。ト長調の楽譜なら、ファはすべて「ファ♯」になります。移調すると調号も変わり、音名も新しい調に合わせて書き直します。調号そのものを読み違えると曲全体の音名が変わってしまうので、最初の段は元の楽譜と見比べてください（${link("ja", "fix-errors", "読み取りミスの見つけ方と直し方")}）。</p>
`,
  },
};
