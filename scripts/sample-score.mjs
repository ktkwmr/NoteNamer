// The sample score: "Ode to Joy" (Beethoven, public domain), 16 measures, melody + simple bass on two staves.
// Used by render-guide-images.mjs (the pictures in the articles) and by build-pages.mjs, which writes
// public/notenamer/sample/ode-to-joy*.musicxml which the app shows when no score is open.
export const DIV = 24; // divisions per quarter note
export const STEPS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
// Melody: pitch + octave, duration in quarters
const MELODY = [
  "E4 1 E4 1 F4 1 G4 1", "G4 1 F4 1 E4 1 D4 1", "C4 1 C4 1 D4 1 E4 1", "E4 1.5 D4 .5 D4 2",
  "E4 1 E4 1 F4 1 G4 1", "G4 1 F4 1 E4 1 D4 1", "C4 1 C4 1 D4 1 E4 1", "D4 1.5 C4 .5 C4 2",
  "D4 1 D4 1 E4 1 C4 1", "D4 1 E4 .5 F4 .5 E4 1 C4 1", "D4 1 E4 .5 F4 .5 E4 1 D4 1", "C4 1 D4 1 G3 2",
  "E4 1 E4 1 F4 1 G4 1", "G4 1 F4 1 E4 1 D4 1", "C4 1 C4 1 D4 1 E4 1", "D4 1.5 C4 .5 C4 2",
];
// Bass: one chord per half measure (C = C3+G3, G = G2+D3)
const HARMONY = ["CC", "GG", "CC", "GG", "CC", "GG", "CC", "GC", "GC", "GC", "GC", "GG", "CC", "GG", "CC", "GC"];
const CHORD = { C: ["C3", "G3"], G: ["G2", "D3"] };
const TYPE = { 0.5: ["eighth", 0], 1: ["quarter", 0], 1.5: ["quarter", 1], 2: ["half", 0] };

function noteXml(p, q, staff, chord) {
  const [type, dots] = TYPE[q];
  return `<note>${chord ? "<chord/>" : ""}<pitch><step>${p[0]}</step><octave>${p.slice(1)}</octave></pitch><duration>${q * DIV}</duration><voice>${staff === 1 ? 1 : 5}</voice><type>${type}</type>${"<dot/>".repeat(dots)}<stem>${staff === 1 ? (STEPS[p[0]] + 12 * +p.slice(1) >= 71 ? "down" : "up") : "down"}</stem><staff>${staff}</staff></note>`;
}
export function sampleXml({ title = "Ode to Joy", drop = null } = {}) {
  const measures = MELODY.map((line, i) => {
    const tokens = line.split(" ");
    let mel = "";
    for (let k = 0; k < tokens.length; k += 2) {
      if (drop && drop.measure === i && drop.note === k / 2) continue;
      mel += noteXml(tokens[k], +tokens[k + 1], 1, false);
    }
    let bass = "";
    for (const h of HARMONY[i]) bass += CHORD[h].map((p, j) => noteXml(p, 2, 2, j > 0)).join("");
    const attrs = i === 0
      ? `<attributes><divisions>${DIV}</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><staves>2</staves><clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes>
<direction placement="above"><direction-type><words font-weight="bold">Moderato</words></direction-type><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>108</per-minute></metronome></direction-type><staff>1</staff><sound tempo="108"/></direction>`
      : "";
    const end = i === MELODY.length - 1 ? `<barline location="right"><bar-style>light-heavy</bar-style></barline>` : "";
    return `<measure number="${i + 1}">${attrs}${mel}<backup><duration>${4 * DIV}</duration></backup>${bass}${end}</measure>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
<work><work-title>${title}</work-title></work>
<identification><creator type="composer">L. van Beethoven</creator></identification>
<part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
<part id="P1">
${measures}
</part>
</score-partwise>
`;
}

