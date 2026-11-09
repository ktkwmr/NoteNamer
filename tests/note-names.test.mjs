// Unit tests for public/notenamer/note-names.mjs (note names written as lyrics).
// Run: npm install && npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("");
globalThis.DOMParser = window.DOMParser;
globalThis.XMLSerializer = window.XMLSerializer;
const NN = await import("../public/notenamer/note-names.mjs");
const SM = await import("../public/notenamer/score-model.mjs");

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");

// A one-part score; notes: MusicXML <note> bodies, one measure each array
function score(measures, { fifths = 0, staves = 1 } = {}) {
  const ms = measures.map((notes, i) =>
    `<measure number="${i + 1}">` +
    (i === 0 ? `<attributes><divisions>1</divisions><key><fifths>${fifths}</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time>${staves > 1 ? `<staves>${staves}</staves>` : ""}<clef><sign>G</sign><line>2</line></clef></attributes>` : "") +
    notes.join("") + `</measure>`).join("");
  return `<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>P</part-name></score-part></part-list><part id="P1">${ms}</part></score-partwise>`;
}
const n = (step, alter, octave = 4, extra = "") =>
  `<note><pitch><step>${step}</step>${alter ? `<alter>${alter}</alter>` : ""}<octave>${octave}</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type>${extra}</note>`;
const rest = `<note><rest/><duration>1</duration><voice>1</voice><type>quarter</type></note>`;

// The names written under the notes: one array per note (its lyric lines, top first); rests etc. give []
function names(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return Array.from(doc.getElementsByTagName("note")).map((note) =>
    Array.from(note.getElementsByTagName("lyric"))
      .sort((a, b) => +a.getAttribute("number") - +b.getAttribute("number"))
      .map((l) => l.getElementsByTagName("text")[0].textContent));
}
const flat = (xml) => names(xml).map((x) => x.join("/")).join(" ");

test("noteName: every system, natural and with accidentals", () => {
  const expect = {
    katakana: ["ド", "レ", "ミ", "ファ", "ソ", "ラ", "シ"],
    letter: ["C", "D", "E", "F", "G", "A", "B"],
    solfege: ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"],
    korean: ["도", "레", "미", "파", "솔", "라", "시"],
  };
  assert.deepEqual(NN.SYSTEM_IDS, Object.keys(expect));
  for (const [sys, list] of Object.entries(expect)) {
    assert.deepEqual("CDEFGAB".split("").map((s) => NN.noteName(s, 0, sys)), list, sys);
  }
  assert.equal(NN.noteName("F", 1, "katakana"), "ファ♯");
  assert.equal(NN.noteName("B", -1, "letter"), "B♭");
  assert.equal(NN.noteName("C", 2, "solfege"), "Do𝄪");
  assert.equal(NN.noteName("E", -2, "korean"), "미𝄫");
  assert.equal(NN.noteName("x", 0, "letter"), "");
  assert.equal(NN.noteName("D", 0, "unknown"), "D", "an unknown system falls back to letters");
});

test("defaultSystem follows the language", () => {
  assert.equal(NN.defaultSystem("ja"), "katakana");
  assert.equal(NN.defaultSystem("ja-JP"), "katakana");
  assert.equal(NN.defaultSystem("ko-KR"), "korean");
  assert.equal(NN.defaultSystem("es-AR"), "solfege");
  assert.equal(NN.defaultSystem("en-US"), "letter");
  assert.equal(NN.defaultSystem(""), "letter");
});

test("key signatures: G major F♯ and F major B♭ come from <alter>", () => {
  // In MusicXML <alter> already holds the key signature, so the names follow it
  const g = score([[n("G", 0), n("F", 1), n("E", 0), n("D", 0)]], { fifths: 1 });
  assert.equal(flat(NN.addNoteNames(g, "katakana")), "ソ ファ♯ ミ レ");
  assert.equal(flat(NN.addNoteNames(g, "letter")), "G F♯ E D");
  const f = score([[n("F", 0), n("B", -1), n("A", 0), n("C", 0, 5)]], { fifths: -1 });
  assert.equal(flat(NN.addNoteNames(f, "katakana")), "ファ シ♭ ラ ド");
});

test("accidentals inside a measure, double sharps and flats", () => {
  // The accidental lasts to the end of the measure: <alter> is on each note
  const x = score([[n("C", 1), n("C", 1), n("D", 2), n("E", -2)], [n("C", 0), n("B", -1, 3), rest, rest]]);
  assert.equal(flat(NN.addNoteNames(x, "letter")), "C♯ C♯ D𝄪 E𝄫 C B♭  ");
});

test("tied notes: only the first note of the tie is named", () => {
  const x = score([[n("C", 0), n("D", 0), n("E", 0), n("F", 0, 4, `<tie type="start"/><notations><tied type="start"/></notations>`)],
    [n("F", 0, 4, `<tie type="stop"/><notations><tied type="stop"/></notations>`), n("G", 0, 4, `<tie type="stop"/><tie type="start"/>`), n("G", 0, 4, `<tie type="stop"/>`), n("A", 0)]]);
  assert.equal(flat(NN.addNoteNames(x, "letter")), "C D E F  G  A");
  // Ties written only as <tied> in <notations>
  const y = score([[n("C", 0, 4, `<notations><tied type="start"/></notations>`), n("C", 0, 4, `<notations><tied type="stop"/></notations>`), rest, rest]]);
  assert.equal(flat(NN.addNoteNames(y, "letter")), "C   ");
});

test("chords: the names are stacked, highest note on top", () => {
  // Written bottom-up (C E G), shown top-down (G / E / C)
  const x = score([[n("C", 0), n("E", 0, 4, ""), n("G", 0), rest]].map((m) => [
    m[0], m[1].replace("<note>", "<note><chord/>"), m[2].replace("<note>", "<note><chord/>"), m[3]]));
  const out = NN.addNoteNames(x, "katakana");
  assert.deepEqual(names(out).slice(0, 3), [["ド"], ["ミ"], ["ソ"]]);
  const doc = new DOMParser().parseFromString(out, "application/xml");
  const nums = Array.from(doc.getElementsByTagName("lyric")).map((l) => l.parentNode.getElementsByTagName("step")[0].textContent + l.getAttribute("number"));
  assert.deepEqual(nums.sort(), ["C3", "E2", "G1"]);
});

test("rests and unpitched notes get no name; existing lyrics are removed", () => {
  const drum = `<note><unpitched><display-step>C</display-step><display-octave>5</display-octave></unpitched><duration>1</duration><voice>1</voice><type>quarter</type></note>`;
  const sung = n("E", 0, 4, `<lyric number="1"><syllabic>single</syllabic><text>la</text></lyric><lyric number="2"><text>lu</text></lyric>`);
  const x = score([[rest, drum, sung, n("G", 0)]]);
  const out = NN.addNoteNames(x, "solfege");
  assert.equal(flat(out), "  Mi Sol");
  assert.doesNotMatch(out, />la</);
});

test("the lyric is placed before <play> and is valid XML order", () => {
  const x = score([[n("C", 0, 4, `<notations><fermata/></notations><play><mute>straight</mute></play>`), rest, rest, rest]]);
  const out = NN.addNoteNames(x, "letter");
  assert.match(out, /<\/notations><lyric number="1" placement="below"><syllabic>single<\/syllabic><text>C<\/text><\/lyric><play>/);
});

test("names follow the transposition (transposeXml, then addNoteNames)", () => {
  // C major up a whole step = D major: F becomes F♯, B becomes C♯
  const x = score([[n("C", 0), n("E", 0), n("F", 0), n("B", 0)]]);
  assert.equal(flat(NN.addNoteNames(SM.transposeXml(x, 2), "letter")), "D F♯ G C♯");
  // Down a semitone from C major = B major (5 sharps)... spelled with sharps
  assert.equal(flat(NN.addNoteNames(SM.transposeXml(x, -1), "letter")), "B D♯ E A♯");
  // Up 3 = E♭ major: flats
  assert.equal(flat(NN.addNoteNames(SM.transposeXml(x, 3), "katakana")), "ミ♭ ソ ラ♭ レ");
});

test("fixtures: every pitched note is named, in every part", () => {
  for (const name of ["twinkle.musicxml", "waltz.musicxml", "piano.musicxml", "grand-chords.musicxml"]) {
    const xml = fixture(name);
    const out = NN.addNoteNames(xml, "letter");
    const doc = new DOMParser().parseFromString(out, "application/xml");
    const notes = Array.from(doc.getElementsByTagName("note"));
    for (const note of notes) {
      const pitched = note.getElementsByTagName("pitch").length > 0;
      const tiedOn = Array.from(note.getElementsByTagName("tie")).some((t) => t.getAttribute("type") === "stop") &&
        !Array.from(note.getElementsByTagName("tie")).some((t) => t.getAttribute("type") === "start");
      assert.equal(note.getElementsByTagName("lyric").length > 0, pitched && !tiedOn, name);
    }
    // The score itself is unchanged apart from the lyrics
    assert.equal(SM.parseScore(out).notes.length, SM.parseScore(xml).notes.length, name);
  }
  const piano = new DOMParser().parseFromString(NN.addNoteNames(fixture("piano.musicxml"), "letter"), "application/xml");
  // Both hands (two parts here) get names
  for (const part of Array.from(piano.getElementsByTagName("part"))) assert.ok(part.getElementsByTagName("lyric").length > 0);
});

test("grand-chords.musicxml: both staves of one part, chords stacked, tie continuation skipped", () => {
  const out = NN.addNoteNames(fixture("grand-chords.musicxml"), "katakana");
  const doc = new DOMParser().parseFromString(out, "application/xml");
  const byStaff = { 1: [], 2: [] };
  for (const note of Array.from(doc.getElementsByTagName("note"))) {
    const staff = note.getElementsByTagName("staff")[0].textContent;
    const ls = Array.from(note.getElementsByTagName("lyric")).map((l) => l.getAttribute("number") + l.getElementsByTagName("text")[0].textContent);
    byStaff[staff].push(ls.join(""));
  }
  assert.equal(byStaff[1].join(" "), "1ソ 1ラ 1シ 1ド 1レ 1ミ 1ファ♯ 1ド♯ 1ド♯  1シ♭ 1シ♭ 1ソ");
  assert.equal(byStaff[2].join(" "), "3ソ 2レ 1シ 3レ 2ファ♯ 1ラ 3ド 2ミ 1ソ  2ソ 1ソ");
});

test("the output starts with an XML declaration (OSMD needs it)", () => {
  const out = NN.addNoteNames(fixture("twinkle.musicxml"), "letter");
  assert.match(out, /^<\?xml version="1.0"/);
  assert.equal((out.match(/<\?xml/g) || []).length, 1);
});
