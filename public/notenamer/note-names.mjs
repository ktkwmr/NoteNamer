// Note names (Do Re Mi, C D E, 도레미, 1 2 3 …) for every note of a MusicXML score.
//
// The name comes from <pitch>: <step> and <alter>. In MusicXML, <alter> is the sounding pitch,
// with the key signature and the accidentals earlier in the measure already applied.
//  - Fixed systems (C D E, ドレミ, Do Re Mi, 도레미, До Ре Ми, German) name the pitch itself:
//    C is always Do. They need no context.
//  - Movable systems (movable Do, Chinese jianpu 1 2 3, Indian sargam Sa Re Ga) name the note by its
//    place in the key: the first note of the major key of the key signature is Do / 1 / Sa (so a
//    minor key starts on La / 6 / Dha). They follow the key signature (<key><fifths>) in force, which
//    addNoteNames keeps track of; a note outside the key gets a sharp or flat.
//
// addNoteNames writes each name as a <lyric> under its note, and the score display (OSMD)
// lays them out like lyrics. It is used only for what is shown, printed, or saved with names;
// the saved score (state.xml) never carries them.
//
// noteName and the tables need no DOM; addNoteNames uses the browser's DOMParser / XMLSerializer.

// The naming systems, in the order they are offered.
//   fixed: names for C D E F G A B · movable: names for the degrees 1–7 of the key
//   German names its own sharps and flats (Fis, Es, B), see germanName
export const SYSTEMS = {
  katakana: { names: ["ド", "レ", "ミ", "ファ", "ソ", "ラ", "シ"] },
  letter: { names: ["C", "D", "E", "F", "G", "A", "B"] },
  solfege: { names: ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] },
  korean: { names: ["도", "레", "미", "파", "솔", "라", "시"] },
  german: { names: ["C", "D", "E", "F", "G", "A", "H"], german: true },
  cyrillic: { names: ["До", "Ре", "Ми", "Фа", "Соль", "Ля", "Си"] },
  "movable-katakana": { names: ["ド", "レ", "ミ", "ファ", "ソ", "ラ", "シ"], movable: true },
  "movable-solfege": { names: ["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti"], movable: true },
  jianpu: { names: ["1", "2", "3", "4", "5", "6", "7"], movable: true, signFirst: true },
  sargam: { names: ["Sa", "Re", "Ga", "Ma", "Pa", "Dha", "Ni"], movable: true },
};
export const SYSTEM_IDS = Object.keys(SYSTEMS);
export const isMovable = (system) => !!(SYSTEMS[system] && SYSTEMS[system].movable);

const STEPS = "CDEFGAB";
const ACCIDENTAL = { "-2": "𝄫", "-1": "♭", "0": "", "1": "♯", "2": "𝄪" };

// The default system for the page's language: Japanese → ドレミ (katakana, fixed Do), otherwise C D E
export function defaultSystem(lang) {
  return String(lang || "").toLowerCase().split(/[-_]/)[0] === "ja" ? "katakana" : "letter";
}

// German names: the sharp or flat is part of the name (Cis, Es), and B is H; B flat is B
const GERMAN_FLAT = { C: "Ces", D: "Des", E: "Es", F: "Fes", G: "Ges", A: "As", B: "B" };
const GERMAN_DOUBLE_FLAT = { C: "Ceses", D: "Deses", E: "Eses", F: "Feses", G: "Geses", A: "Asas", B: "Heses" };
function germanName(i, a) {
  const s = STEPS[i], base = SYSTEMS.german.names[i];
  if (a === 1) return base + "is";
  if (a === 2) return base + "isis";
  if (a === -1) return GERMAN_FLAT[s];
  if (a === -2) return GERMAN_DOUBLE_FLAT[s];
  return base;
}

// The alteration a key signature gives a step: fifths > 0 sharpens F C G D A E B in that order,
// fifths < 0 flattens B E A D G C F
const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6], FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3];
function keyAlter(i, fifths) {
  const f = Math.max(-7, Math.min(7, Math.round(+fifths || 0)));
  if (f > 0) return SHARP_ORDER.slice(0, f).includes(i) ? 1 : 0;
  if (f < 0) return FLAT_ORDER.slice(0, -f).includes(i) ? -1 : 0;
  return 0;
}
// The step of the first note (Do) of the major key with this key signature: 0 = C, 4 = G, 3 = F …
const tonicStep = (fifths) => (((4 * Math.round(+fifths || 0)) % 7) + 7) % 7;

// "ファ♯", "B♭", "Fis", "♯4" … or "" for a pitch that cannot be named.
// fifths: the key signature in force (only the movable systems use it)
export function noteName(step, alter, system, fifths = 0) {
  const i = STEPS.indexOf(String(step || "").trim().toUpperCase());
  const sys = SYSTEMS[system] || SYSTEMS.letter;
  if (i < 0) return "";
  // Microtones (alter 0.5 …) are named after the nearest semitone
  const a = Math.max(-2, Math.min(2, Math.round(+alter || 0)));
  if (sys.german) return germanName(i, a);
  if (!sys.movable) return sys.names[i] + ACCIDENTAL[a];
  // Movable: the degree in the key, and the sharp or flat a note outside the key has
  const degree = (i - tonicStep(fifths) + 7) % 7;
  const off = Math.max(-2, Math.min(2, a - keyAlter(i, fifths)));
  return sys.signFirst ? ACCIDENTAL[off] + sys.names[degree] : sys.names[degree] + ACCIDENTAL[off];
}

const kids = (el, name) => Array.from(el.children).filter((c) => c.localName === name);
const kid = (el, name) => kids(el, name)[0] || null;
const childText = (el, name) => { const c = kid(el, name); return c ? c.textContent.trim() : ""; };

// Pitch height, for ordering the notes of a chord (higher first)
function height(pitch) {
  const i = STEPS.indexOf(childText(pitch, "step").toUpperCase());
  const pc = [0, 2, 4, 5, 7, 9, 11][i] || 0;
  return (+childText(pitch, "octave") || 4) * 12 + pc + (+childText(pitch, "alter") || 0);
}

// A note that only continues a tie (its sound started on an earlier note) gets no name
function onlyTiedFrom(note) {
  const ties = kids(note, "tie").map((t) => t.getAttribute("type"));
  if (!ties.length) {
    // Some files mark ties only in <notations><tied>
    const n = kid(note, "notations");
    const tied = n ? kids(n, "tied").map((t) => t.getAttribute("type")) : [];
    return tied.includes("stop") && !tied.includes("start");
  }
  return ties.includes("stop") && !ties.includes("start");
}

// <lyric> sits after <notations> and before <play> / <listen> in a <note>
function insertLyric(note, lyric) {
  const before = kids(note, "play")[0] || kids(note, "listen")[0] || null;
  note.insertBefore(lyric, before);
}

// Returns the score with a note name under every note.
//  - The lyrics already in the score are removed, so only the names are shown
//  - Rests, unpitched (percussion) notes, and notes that only continue a tie get no name
//  - The notes of a chord are stacked, the highest on top (lyric line 1, 2, …)
export function addNoteNames(xml, system) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  for (const l of Array.from(doc.getElementsByTagName("lyric"))) l.remove();
  for (const part of Array.from(doc.getElementsByTagName("part"))) {
    // The key signature in force, followed through the part (a key change applies from where it is written)
    let fifths = 0;
    for (const measure of kids(part, "measure")) {
      // Group the notes into chords: a note without <chord/> starts a group, named with the key in force there
      const groups = [];
      for (const el of Array.from(measure.children)) {
        if (el.localName === "attributes") {
          const key = kid(el, "key"), f = key && kid(key, "fifths");
          if (f && f.textContent.trim() !== "") fifths = +f.textContent || 0;
        } else if (el.localName === "note") {
          if (kid(el, "chord") && groups.length) groups[groups.length - 1].notes.push(el);
          else groups.push({ notes: [el], fifths: fifths });
        }
      }
      for (const group of groups) {
        const named = group.notes
          .filter((n) => kid(n, "pitch") && !kid(n, "rest") && !onlyTiedFrom(n))
          .sort((a, b) => height(kid(b, "pitch")) - height(kid(a, "pitch")));
        named.forEach(function (note, i) {
          const p = kid(note, "pitch");
          const name = noteName(childText(p, "step"), childText(p, "alter"), system, group.fifths);
          if (!name) return;
          const lyric = doc.createElement("lyric");
          lyric.setAttribute("number", String(i + 1));
          lyric.setAttribute("placement", "below");
          const syl = doc.createElement("syllabic"); syl.textContent = "single";
          const text = doc.createElement("text"); text.textContent = name;
          lyric.appendChild(syl); lyric.appendChild(text);
          insertLyric(note, lyric);
        });
      }
    }
  }
  const out = new XMLSerializer().serializeToString(doc);
  // OSMD takes a string as MusicXML only when it starts with "<?xml" (otherwise it is taken for a URL);
  // some serializers drop the declaration
  return /^\s*<\?xml/.test(out) ? out : '<?xml version="1.0" encoding="UTF-8"?>\n' + out;
}
