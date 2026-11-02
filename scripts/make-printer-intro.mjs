// generate components/motion/printer-intro.json: node scripts/make-printer-intro.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "components/motion/printer-intro.json");

// timing (frames)
const FR = 60;
const OP = 310;
const P0 = 20; // print start
const P1 = 260; // print end
const SWEEP = 20; // frames per head pass
const PARK = P1 + 24;

// colors
const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255, 1];
const BODY = hex("#eef1f7");
const SHADE = hex("#c9d1e3");
const LINE = hex("#0b1a45");
const SPOOL = hex("#f6a623");
const HOT = hex("#ff7a1a");
const W = 4;
const IMG = 260;

// lottie helpers
const st = (k) => ({ a: 0, k });
const LIN = { i: { x: [1], y: [1] }, o: { x: [0], y: [0] } };
const kf = (frames) => ({ a: 1, k: frames.map(([t, s], n) => (n === frames.length - 1 ? { t, s } : { t, s, ...LIN })) });
const tr = (p = [0, 0], o = st(100)) => ({ ty: "tr", p: st(p), a: st([0, 0]), s: st([100, 100]), r: st(0), o, sk: st(0), sa: st(0) });
const fill = (c) => ({ ty: "fl", c: st(c), o: st(100), r: 1 });
const stroke = (c, w = W) => ({ ty: "st", c: st(c), o: st(100), w: st(w), lc: 2, lj: 2 });
const rect = (x, y, w, h, r = 0) => ({ ty: "rc", d: 1, p: st([x + w / 2, y + h / 2]), s: st([w, h]), r: st(r) });
const circle = (cx, cy, d) => ({ ty: "el", d: 1, p: st([cx, cy]), s: st([d, d]) });
const zero = (v) => v.map(() => [0, 0]);
const pathVal = (v, closed = true, i = zero(v), o = zero(v)) => ({ v, i, o, c: closed });
const shape = (v, closed, i, o) => ({ ty: "sh", ks: st(pathVal(v, closed, i, o)) });
const group = (items, p, o) => ({ ty: "gr", it: [...items, tr(p, o)] });
const solid = (shapeItem, color = BODY, w = W) => group([shapeItem, fill(color), stroke(LINE, w)]);
const line = (v, w = W, color = LINE) => group([shape(v, false), stroke(color, w)]);

const ks = (p = [0, 0], extra = {}) => ({ o: st(100), r: st(0), p: st([...p, 0]), a: st([0, 0, 0]), s: st([100, 100, 100]), ...extra });
const layer = (ind, nm, shapes, extra = {}) => ({ ddd: 0, ind, ty: 4, nm, sr: 1, ks: ks(), ao: 0, shapes, ip: 0, op: OP, st: 0, bm: 0, ...extra });

// geometry (512 canvas)
const BED_Y = 436;
const LOGO = { x: 156, y: 234, w: 200, h: 200 };
const TIP = 38; // gantry centre to nozzle tip
const printTop = (t) => LOGO.y + LOGO.h - (LOGO.h * Math.min(Math.max(t - P0, 0), P1 - P0)) / (P1 - P0);

// motion, sampled so the filament cable can follow the head
const lerp = (a, b, k) => a + (b - a) * k;
const track = (keys, t) => {
  for (let n = 1; n < keys.length; n++) {
    const [t0, v0] = keys[n - 1];
    const [t1, v1] = keys[n];
    if (t <= t1) return lerp(v0, v1, (t - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
};
const headX = [[0, 256]];
for (let t = P0, n = 0; t <= P1; t += SWEEP, n++) headX.push([t, n % 2 ? 336 : 176]);
headX.push([PARK, 256], [OP, 256]);
const gantryY = [
  [0, BED_Y - TIP - 30],
  [P0, printTop(P0) - TIP],
  [P1, printTop(P1) - TIP],
  [PARK, printTop(P1) - TIP - 26],
  [OP, printTop(P1) - TIP - 26],
];
const times = [...new Set([...headX, ...gantryY].map(([t]) => t))].sort((a, b) => a - b);

const cable = (t) => {
  const hx = track(headX, t);
  const gy = track(gantryY, t);
  return pathVal([[420, 248], [hx + 6, gy - 22]], false, [[0, 0], [10, -70]], [[-70, 10], [0, 0]]);
};

const layers = [];

// print head (child of gantry)
layers.push(
  layer(1, "head", [
    group([circle(0, TIP, 10), fill(HOT)], [0, 0], kf([[0, [0]], [P0 - 4, [0]], [P0, [100]], [P1, [100]], [P1 + 6, [0]]])),
    group([shape([[-6, 20], [6, 20], [2, TIP - 2], [-2, TIP - 2]], true), fill(SHADE), stroke(LINE, 3)]),
    solid(rect(-11, 12, 22, 10, 2), SHADE, 3),
    solid(rect(-28, -26, 56, 42, 6)),
    group([circle(0, -5, 26), fill(BODY), stroke(LINE, 3)]),
    group([circle(0, -5, 8), fill(LINE)]),
    line([[0, -18], [0, 8]], 2.5),
    line([[-13, -5], [13, -5]], 2.5),
  ], { parent: 3, ks: ks([0, 0], { p: kf(headX.map(([t, x]) => [t, [x, 0, 0]])) }) }),
);

// filament cable, extruder to head
layers.push(layer(2, "cable", [group([{ ty: "sh", ks: kf(times.map((t) => [t, [cable(t)]])) }, stroke(SPOOL, 3)])]));

// gantry
layers.push(
  layer(3, "gantry", [
    solid(rect(86, -14, 52, 28, 5), SHADE),
    solid(rect(374, -14, 52, 28, 5), SHADE),
    solid(rect(64, -8, 384, 16, 8)),
  ], { ks: ks([0, 0], { p: kf(gantryY.map(([t, y]) => [t, [0, y, 0]])) }) }),
);

// spool
layers.push(
  layer(4, "spool", [
    solid(rect(-24, -4, 48, 8, 3)),
    group([circle(0, 0, 10), fill(LINE)]),
    solid(circle(0, 0, 30)),
    group([circle(0, 0, 54), fill(hex("#e8901a"))]),
    solid(circle(0, 0, 74), SPOOL),
  ], { ks: ks([256, 56], { r: kf([[0, [0]], [OP, [720]]]) }) }),
);

// logo image, revealed bottom-up by an animated mask
const maskTop = (t) => ((printTop(t) - LOGO.y) / LOGO.h) * IMG;
const mask = (y) => [pathVal([[0, y], [IMG, y], [IMG, IMG], [0, IMG]])];
layers.push({
  ddd: 0, ind: 5, ty: 2, nm: "logo", refId: "logo", sr: 1,
  ks: ks([LOGO.x, LOGO.y], { s: st([(LOGO.w / IMG) * 100, (LOGO.h / IMG) * 100, 100]) }),
  ao: 0, hasMask: true,
  masksProperties: [{ inv: false, mode: "a", o: st(100), x: st(0), nm: "print", pt: kf([[0, mask(IMG)], [P0, mask(IMG)], [P1, mask(maskTop(P1))]]) }],
  ip: 0, op: OP, st: 0, bm: 0,
});

// extruder and feed line from the spool
layers.push(
  layer(6, "extruder", [
    group([circle(431, 248, 12), fill(LINE)]),
    solid(rect(412, 228, 38, 40, 5)),
    group([shape([[292, 56], [438, 226]], false, [[0, 0], [10, -90]], [[90, 0], [0, 0]]), stroke(SPOOL, 3)]),
  ]),
);

// frame
layers.push(
  layer(7, "frame", [
    solid(rect(250, 84, 12, 18, 2)),
    solid(rect(236, 444, 40, 10, 2), SHADE),
    solid(rect(146, BED_Y, 220, 9, 3)),
    solid(rect(96, 480, 30, 10, 2), SHADE),
    solid(rect(386, 480, 30, 10, 2), SHADE),
    solid(rect(72, 452, 368, 30, 6)),
    solid(rect(72, 100, 368, 24, 6)),
    line([[112, 128], [112, 448]], 2.5),
    line([[400, 128], [400, 448]], 2.5),
    solid(rect(92, 120, 40, 334)),
    solid(rect(380, 120, 40, 334)),
  ]),
);

const logo = await sharp(path.join(ROOT, "public/brand/logo-mark.png"))
  .resize(IMG, IMG, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 88, alphaQuality: 100, effort: 6 })
  .toBuffer();
const json = {
  v: "5.7.4", fr: FR, ip: 0, op: OP, w: 512, h: 512, nm: "STEM printer", ddd: 0,
  assets: [{ id: "logo", w: IMG, h: IMG, u: "", p: `data:image/webp;base64,${logo.toString("base64")}`, e: 1 }],
  layers,
};
fs.writeFileSync(OUT, JSON.stringify(json));
console.log("wrote", OUT, fs.statSync(OUT).size);
