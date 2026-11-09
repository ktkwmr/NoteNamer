// Note names (Do Re Mi, C D E, 도레미 …) for every note of a MusicXML score.
//
// The name comes from <pitch>: <step> and <alter>. In MusicXML, <alter> is the sounding pitch,
// with the key signature and the accidentals earlier in the measure already applied, so the
// name needs no key or measure context.
//
// addNoteNames writes each name as a <lyric> under its note, and the score display (OSMD)
// lays them out like lyrics. It is used only for what is shown, printed, or saved with names;
// the saved score (state.xml) never carries them.
//
// noteName and the tables need no DOM; addNoteNames uses the browser's DOMParser / XMLSerializer.

// The naming systems, in the order they are offered. names: C D E F G A B
export const SYSTEMS = {
  katakana: { names: ["ド", "レ", "ミ", "ファ", "ソ", "ラ", "シ"] },
  letter: { names: ["C", "D", "E", "F", "G", "A", "B"] },
  solfege: { names: ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] },
  korean: { names: ["도", "레", "미", "파", "솔", "라", "시"] },
};
export const SYSTEM_IDS = Object.keys(SYSTEMS);

const STEPS = "CDEFGAB";
const ACCIDENTAL = { "-2": "𝄫", "-1": "♭", "0": "", "1": "♯", "2": "𝄪" };

// The default system for a language: Japanese → katakana, Korean → 도레미,
// languages that sing fixed Do (Italian, French, Spanish, Portuguese, Romanian, Turkish, Russian …) → Do Re Mi,
// everything else → letters
const SOLFEGE_LANGS = ["it", "fr", "es", "pt", "ro", "tr", "ru", "uk", "pl", "el", "ca", "gl", "bg", "sr", "hr", "sl", "lv", "lt", "he", "ar", "fa"];
export function defaultSystem(lang) {
  const l = String(lang || "").toLowerCase().split(/[-_]/)[0];
  if (l === "ja") return "katakana";
  if (l === "ko") return "korean";
  if (SOLFEGE_LANGS.includes(l)) return "solfege";
  return "letter";
}

// "ファ♯", "B♭", "C" … or "" for a pitch that cannot be named
export function noteName(step, alter, system) {
  const i = STEPS.indexOf(String(step || "").trim().toUpperCase());
  const sys = SYSTEMS[system] || SYSTEMS.letter;
  if (i < 0) return "";
  // Microtones (alter 0.5 …) are named after the nearest semitone
  const a = Math.max(-2, Math.min(2, Math.round(+alter || 0)));
  return sys.names[i] + ACCIDENTAL[a];
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
  for (const measure of Array.from(doc.getElementsByTagName("measure"))) {
    // Group the notes into chords: a note without <chord/> starts a group
    const groups = [];
    for (const note of kids(measure, "note")) {
      if (kid(note, "chord") && groups.length) groups[groups.length - 1].push(note);
      else groups.push([note]);
    }
    for (const group of groups) {
      const named = group
        .filter((n) => kid(n, "pitch") && !kid(n, "rest") && !onlyTiedFrom(n))
        .sort((a, b) => height(kid(b, "pitch")) - height(kid(a, "pitch")));
      named.forEach(function (note, i) {
        const p = kid(note, "pitch");
        const name = noteName(childText(p, "step"), childText(p, "alter"), system);
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
  const out = new XMLSerializer().serializeToString(doc);
  // OSMD takes a string as MusicXML only when it starts with "<?xml" (otherwise it is taken for a URL);
  // some serializers drop the declaration
  return /^\s*<\?xml/.test(out) ? out : '<?xml version="1.0" encoding="UTF-8"?>\n' + out;
}
