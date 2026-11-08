// The score with its note names on A4 pages, for printing, saving as images (PNG), and sharing.
//
// The pages are drawn by a second, hidden OpenSheetMusicDisplay (OSMD) with pageFormat "A4_P",
// separate from the one on screen (which is one long page that fits the window). Each page is
// an SVG; a small line at the bottom gives the title, the page number, and (unless turned off)
// "Made with Note Namer" with the app's address, so a shared picture leads back to the app.
// A PNG is made by drawing the page's SVG on a canvas (no extra library).
//
// Needs window.opensheetmusicdisplay (vendor/opensheetmusicdisplay.min.js), loaded by the page.

const SVG_NS = "http://www.w3.org/2000/svg";
// A4 at 96 dpi; the PNG is drawn at twice this size (about 190 dpi)
export const PAGE_WIDTH = 794;
export const PNG_SCALE = 2;
const PAGE_ZOOM = 0.8;

// xml: the score as shown (transposed, with names and title)
// setRules(rules): the same engraving rules as the screen (names' size and spacing)
// footer(page, count): the text under each page
// Returns [{ svg: string, width, height }], one per page
export async function renderPages({ xml, setRules, footer }) {
  const box = document.createElement("div");
  // Off screen, but laid out (OSMD measures text), at the width of an A4 page
  box.style.cssText = `position:absolute;left:-20000px;top:0;width:${PAGE_WIDTH}px;background:#fff`;
  box.setAttribute("aria-hidden", "true");
  document.body.appendChild(box);
  try {
    const osmd = new window.opensheetmusicdisplay.OpenSheetMusicDisplay(box, {
      autoResize: false, backend: "svg", pageFormat: "A4_P", pageBackgroundColor: "#FFFFFF",
      drawTitle: true, drawSubtitle: true, drawComposer: true, drawLyricist: false, drawCredits: false,
      drawPartNames: false, drawMeasureNumbers: true,
    });
    await osmd.load(xml);
    const R = osmd.EngravingRules;
    if (setRules) setRules(R);
    // A little smaller and tighter than OSMD's page defaults, so more fits on a page
    // (a 16-measure piano piece on one page) while the names stay readable when printed
    R.MinimumDistanceBetweenSystems = 3;
    R.MinSkyBottomDistBetweenSystems = 3;
    R.PageTopMargin = 4; R.PageBottomMargin = 6;
    osmd.zoom = PAGE_ZOOM;
    osmd.render();
    const svgs = Array.from(box.querySelectorAll("svg"));
    return svgs.map(function (svg, i) {
      const size = svgSize(svg);
      const text = footer ? footer(i + 1, svgs.length) : "";
      if (text) {
        const el = document.createElementNS(SVG_NS, "text");
        el.setAttribute("x", String(size.vx + size.vw / 2));
        el.setAttribute("y", String(size.vy + size.vh - size.vh * 0.022));
        el.setAttribute("text-anchor", "middle");
        el.setAttribute("font-family", "-apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', 'Segoe UI', sans-serif");
        el.setAttribute("font-size", String(size.vw * 0.0135));
        el.setAttribute("fill", "#6b6b6b");
        el.textContent = text;
        svg.appendChild(el);
      }
      svg.setAttribute("xmlns", SVG_NS);
      return { svg: new XMLSerializer().serializeToString(svg), width: size.w, height: size.h };
    });
  } finally {
    box.remove();
  }
}

// The size of a page SVG in CSS pixels, and its viewBox (OSMD may draw in its own units)
function svgSize(svg) {
  const w = parseFloat(svg.getAttribute("width")) || svg.getBoundingClientRect().width || PAGE_WIDTH;
  const h = parseFloat(svg.getAttribute("height")) || svg.getBoundingClientRect().height || PAGE_WIDTH * 297 / 210;
  const vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
  const [vx, vy, vw, vh] = vb.length === 4 && vb.every((x) => isFinite(x)) && vb[2] > 0 ? vb : [0, 0, w, h];
  return { w, h, vx, vy, vw, vh };
}

// One page as a PNG (white background)
export async function pagePng(page, scale = PNG_SCALE) {
  const url = URL.createObjectURL(new Blob([page.svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.decoding = "sync";
    img.src = url;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = Math.round(page.width * scale); c.height = Math.round(page.height * scale);
    const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise((resolve) => c.toBlob(resolve, "image/png"));
    c.width = c.height = 0;
    if (!blob) throw new Error("PNG");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
