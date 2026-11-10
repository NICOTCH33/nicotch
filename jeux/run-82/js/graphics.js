// =====================================================================
//  NICOTCH RUN 82 - GRAPHISMES PIXEL ART
//  Chaque décor est dessiné UNE fois en petit (vrais pixels), mis en
//  cache, puis agrandi sans lissage : ça donne un pixel art bien net.
// =====================================================================
'use strict';

// ---------- Outils couleur ----------
const hexToRgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const rgbToHex = (r, g, b) => '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function shade(hex, f) { const [r, g, b] = hexToRgb(hex); return rgbToHex(clamp(Math.round(r * f), 0, 255), clamp(Math.round(g * f), 0, 255), clamp(Math.round(b * f), 0, 255)); }
const mixCache = new Map();
function mix(a, b, t) {
    const key = a + b + t;
    let v = mixCache.get(key);
    if (!v) {
        const A = hexToRgb(a), B = hexToRgb(b);
        v = rgbToHex(...A.map((x, i) => Math.round(x + (B[i] - x) * t)));
        mixCache.set(key, v);
    }
    return v;
}

// Matrice de Bayer 4x4 : sert au "tramage" (dithering) façon consoles 16 bits
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];

function mk(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true }); g.imageSmoothingEnabled = false;
    return { c, g };
}
// Supprime les bords flous (anti-aliasing) : un pixel est plein ou vide
function crisp(c) {
    const g = c.getContext('2d');
    let d; try { d = g.getImageData(0, 0, c.width, c.height); } catch (e) { return c; }
    const p = d.data;
    for (let i = 3; i < p.length; i += 4) p[i] = p[i] < 110 ? 0 : 255;
    g.putImageData(d, 0, 0);
    return c;
}
// Ajoute un contour d'un pixel autour du dessin (look pixel art)
function outline(c, col) {
    const w = c.width, h = c.height, g = c.getContext('2d');
    let src; try { src = g.getImageData(0, 0, w, h).data; } catch (e) { return c; }
    const [r, gg, b] = hexToRgb(col);
    const out = g.getImageData(0, 0, w, h), o = out.data;
    const A = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : src[(y * w + x) * 4 + 3];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (src[i + 3] === 0 && (A(x - 1, y) || A(x + 1, y) || A(x, y - 1) || A(x, y + 1))) {
            o[i] = r; o[i + 1] = gg; o[i + 2] = b; o[i + 3] = 255;
        }
    }
    g.putImageData(out, 0, 0);
    return c;
}
function flipX(c) {
    const { c: f, g } = mk(c.width, c.height);
    g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0);
    return f;
}
function disc(g, cx, cy, r, col) {
    g.fillStyle = col;
    for (let y = -r; y <= r; y++) {
        const hw = Math.floor(Math.sqrt(r * r - y * y) + 0.3);
        g.fillRect(cx - hw, cy + y, hw * 2 + 1, 1);
    }
}

// ---------- Mini police pixel 5x7 (pour le portique) ----------
const GLYPHS = {
    S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
    T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
    A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
    E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####']
};
function pixelText(g, str, x, y, col) {
    g.fillStyle = col;
    [...str].forEach((ch, i) => (GLYPHS[ch] || []).forEach((row, ry) =>
        [...row].forEach((p, rx) => { if (p === '#') g.fillRect(x + i * 6 + rx, y + ry, 1, 1); })));
}

// =====================================================================
//  SPRITES DE DÉCOR
//  w   = largeur dans le monde (1 = demi-largeur de la route)
//  hit = demi-largeur de la zone de collision (0 = on passe à travers)
// =====================================================================
const SPR = {};

function buildPalm(night) {
    const { c, g } = mk(50, 76);
    const tr = night ? ['#2a1a44', '#1a0f2e', '#5a3a8a'] : ['#b08a5e', '#7d5b38', '#d9b483'];
    for (let y = 74; y >= 16; y--) {
        const t = (74 - y) / 58, x = Math.round(20 + 9 * t * t);
        g.fillStyle = Math.floor(y / 4) % 2 ? tr[0] : tr[1]; g.fillRect(x, y, 5, 1);
        g.fillStyle = tr[2]; g.fillRect(x, y, 1, 1);
        g.fillStyle = tr[1]; g.fillRect(x + 4, y, 1, 1);
    }
    const cx = 31, cy = 15;
    const cols = night ? ['#0f0820', '#24124a', '#ff3cac'] : ['#14491c', '#2c8a35', '#74cc5c'];
    const fronds = [[-172, 21], [-148, 20], [-122, 15], [-58, 15], [-32, 20], [-8, 21], [-95, 11]];
    for (let pass = 0; pass < 3; pass++) {
        for (const [deg, L] of fronds) {
            const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
            for (let t = 0; t <= 1; t += 0.02) {
                const x = cx + ca * L * t, y = cy + sa * L * t * 0.75 + 11 * t * t * Math.abs(ca);
                const th = Math.max(1, Math.round(3.4 * (1 - t * 0.7)));
                if (pass === 0) { g.fillStyle = cols[0]; g.fillRect(Math.round(x), Math.round(y), th + 1, th + 1); }
                if (pass === 1) { g.fillStyle = cols[1]; g.fillRect(Math.round(x), Math.round(y), th, th - (th > 1 ? 1 : 0) || 1); }
                if (pass === 2 && t > 0.1 && t < 0.8) { g.fillStyle = cols[2]; g.fillRect(Math.round(x), Math.round(y), 1, 1); }
            }
        }
    }
    if (!night) { disc(g, 29, 18, 2, '#6b4422'); disc(g, 33, 19, 2, '#5a3a1c'); disc(g, 31, 17, 1, '#8a5a2c'); }
    return outline(crisp(c), night ? '#05010c' : '#0b1a0d');
}

function buildTree() {
    const { c, g } = mk(46, 52);
    g.fillStyle = '#5c3d22'; g.fillRect(20, 32, 6, 18);
    g.fillStyle = '#7d5634'; g.fillRect(20, 32, 2, 18);
    disc(g, 23, 21, 16, '#1d5222'); disc(g, 12, 29, 10, '#1d5222'); disc(g, 34, 29, 10, '#1d5222');
    disc(g, 21, 19, 13, '#2f7f2f'); disc(g, 12, 27, 7, '#2f7f2f'); disc(g, 32, 26, 7, '#2f7f2f');
    disc(g, 17, 14, 6, '#4fa043'); disc(g, 29, 21, 4, '#4fa043'); disc(g, 10, 25, 3, '#4fa043');
    // tramage des feuilles
    g.fillStyle = '#74c55a';
    for (let y = 6; y < 22; y++) for (let x = 8; x < 30; x++) if (bayer(x, y) < 0.12 && (x - 17) ** 2 + (y - 14) ** 2 < 40) g.fillRect(x, y, 1, 1);
    g.fillStyle = '#153d19';
    for (let y = 20; y < 40; y++) for (let x = 4; x < 44; x++) if (bayer(x, y) < 0.18 && (x - 23) ** 2 + (y - 32) ** 2 > 70 && (x - 23) ** 2 + (y - 26) ** 2 < 300) g.fillRect(x, y, 1, 1);
    return outline(crisp(c), '#0c220e');
}

function buildPine(snow) {
    const { c, g } = mk(34, 66);
    g.fillStyle = '#4a321c'; g.fillRect(15, 56, 4, 9);
    for (let i = 0; i < 4; i++) {
        const yb = 58 - i * 12, hw = 15 - i * 3, th = 17;
        for (let r = 0; r < th; r++) {
            const ww = Math.round(hw * (1 - r / th)), y = yb - r;
            g.fillStyle = '#2b6e3a'; g.fillRect(17 - ww, y, ww, 1);
            g.fillStyle = '#17442a'; g.fillRect(17, y, ww + 1, 1);
            if (snow && (r === th - Math.round(th * 0.25) || r > th - 4)) { g.fillStyle = r > th - 4 ? '#f2f6ff' : '#c9d6ee'; g.fillRect(17 - ww, y, ww * 2 + 1, 1); }
        }
        if (snow) { g.fillStyle = '#e8eefc'; g.fillRect(17 - hw, yb, 3, 1); g.fillRect(17 + hw - 2, yb, 3, 1); }
    }
    return outline(crisp(c), '#08180e');
}

function buildRock() {
    const { c, g } = mk(36, 24);
    g.fillStyle = '#8a8478';
    g.beginPath(); g.moveTo(2, 23); g.lineTo(6, 9); g.lineTo(16, 2); g.lineTo(26, 6); g.lineTo(34, 23); g.closePath(); g.fill();
    g.fillStyle = '#6a655b';
    g.beginPath(); g.moveTo(16, 2); g.lineTo(26, 6); g.lineTo(34, 23); g.lineTo(18, 23); g.closePath(); g.fill();
    g.fillStyle = '#aaa496';
    g.beginPath(); g.moveTo(6, 9); g.lineTo(16, 2); g.lineTo(14, 9); g.closePath(); g.fill();
    g.fillStyle = '#4e4a42';
    for (let y = 8; y < 23; y++) for (let x = 18; x < 34; x++) if (bayer(x, y) < 0.15) g.fillRect(x, y, 1, 1);
    return outline(crisp(c), '#2a2722');
}

function buildHay() {
    const { c, g } = mk(30, 24);
    g.fillStyle = '#d9b44a'; g.fillRect(2, 5, 26, 17);
    g.fillStyle = '#f2d878'; g.fillRect(2, 5, 26, 3);
    g.fillStyle = '#b48f2e';
    for (let y = 9; y < 22; y += 3) g.fillRect(2, y, 26, 1);
    for (let y = 8; y < 22; y++) for (let x = 2; x < 28; x++) if (bayer(x, y) < 0.1) g.fillRect(x, y, 1, 1);
    g.fillStyle = '#7a4b22'; g.fillRect(8, 5, 2, 17); g.fillRect(20, 5, 2, 17);
    g.fillStyle = '#9a6a3a'; g.fillRect(2, 21, 26, 1);
    return outline(c, '#3a2a10');
}

function buildFan(v, frame) {
    const { c, g } = mk(16, 26);
    const shirt = ['#e63946', '#f4d03f', '#2a9df4', '#ffffff', '#ff8c00', '#8e44ad'][v % 6];
    const hair = ['#3a2a1a', '#c9a227', '#111111', '#8a4b2a'][v % 4];
    const skin = ['#f0c08a', '#c68a5a', '#8a5a3a'][v % 3];
    g.fillStyle = '#2b3a67'; g.fillRect(5, 17, 2, 8); g.fillRect(9, 17, 2, 8);
    g.fillStyle = shirt; g.fillRect(4, 10, 8, 8);
    g.fillStyle = shade(shirt, 0.75); g.fillRect(10, 10, 2, 8);
    g.fillStyle = skin; g.fillRect(5, 4, 6, 6);
    g.fillStyle = hair; g.fillRect(5, 3, 6, 2);
    g.fillStyle = skin;
    if (frame) { g.fillRect(2, 2, 2, 8); g.fillRect(12, 10, 2, 6); }
    else { g.fillRect(2, 10, 2, 6); g.fillRect(12, 2, 2, 8); }
    return outline(c, '#111018');
}

function buildHitchhiker() {
    const { c, g } = mk(18, 28);
    g.fillStyle = '#28324a'; g.fillRect(6, 17, 2, 10); g.fillRect(10, 17, 2, 10);
    g.fillStyle = '#ff007f'; g.fillRect(5, 9, 8, 9);
    g.fillStyle = '#b8005c'; g.fillRect(11, 9, 2, 9);
    g.fillStyle = '#f0c08a'; g.fillRect(6, 3, 6, 6);
    g.fillStyle = '#5a3a1a'; g.fillRect(5, 2, 8, 2);
    g.fillStyle = '#f0c08a'; g.fillRect(13, 6, 3, 2); g.fillRect(15, 3, 1, 3); // le pouce levé
    g.fillStyle = '#7a5a2a'; g.fillRect(1, 18, 4, 6); // le sac
    return outline(c, '#111018');
}

function buildLamp() {
    const { c, g } = mk(28, 86);
    g.fillStyle = '#26263a'; g.fillRect(3, 8, 4, 77);
    g.fillStyle = '#56567e'; g.fillRect(3, 8, 1, 77);
    g.fillStyle = '#26263a'; g.fillRect(3, 6, 20, 3);
    g.fillStyle = '#3a3a55'; g.fillRect(17, 8, 9, 3);
    g.fillStyle = '#fff3c4'; g.fillRect(18, 11, 7, 2);
    g.fillStyle = '#ff3cac'; g.fillRect(2, 60, 6, 2); g.fillRect(2, 70, 6, 2); // anneaux néon
    return outline(c, '#05010c');
}

function buildPickup(frame) {
    const { c, g } = mk(18, 18);
    disc(g, 9, 9, 7, frame ? '#9ffcff' : '#00e5ff');
    disc(g, 9, 9, 5, '#ffffff');
    g.fillStyle = '#1a2a4a'; g.fillRect(9, 5, 1, 5); g.fillRect(9, 9, 3, 1);
    g.fillStyle = frame ? '#ffffff' : '#c8fbff'; g.fillRect(5, 3, 2, 1); g.fillRect(4, 4, 1, 2);
    return outline(c, '#003a55');
}

// Panneau publicitaire : la photo est "pixelisée" avec une palette réduite
function pixelateImage(img, w, h) {
    const { c, g } = mk(w, h);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, 0, w, h);
    try {
        const d = g.getImageData(0, 0, w, h), p = d.data, L = 12;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4, t = bayer(x, y) - 0.5;
            for (let k = 0; k < 3; k++) {
                const v = p[i + k] / 255 * (L - 1) + t;
                p[i + k] = clamp(Math.round(v), 0, L - 1) * 255 / (L - 1);
            }
        }
        g.putImageData(d, 0, 0);
    } catch (e) { /* image locale bloquée par le navigateur : on la garde lissée */ }
    return c;
}
function buildBillboard(img, night, v) {
    const { c, g } = mk(66, 64);
    g.fillStyle = '#3c3c44'; g.fillRect(14, 42, 4, 22); g.fillRect(48, 42, 4, 22);
    g.fillStyle = '#6a6a76'; g.fillRect(14, 42, 1, 22); g.fillRect(48, 42, 1, 22);
    g.fillStyle = night ? '#ff2a9d' : '#e8e8e8'; g.fillRect(2, 2, 62, 42);
    g.fillStyle = night ? '#00f3ff' : '#9a9aa6'; g.fillRect(3, 3, 60, 40);
    if (img) g.drawImage(pixelateImage(img, 58, 38), 4, 4);
    else {
        // image de secours (si la photo est absente)
        const skies = [['#5ec4ff', '#d8f1ff'], ['#3a2a7a', '#ff8a5c'], ['#8ec5ff', '#e8f4ff']][v % 3];
        for (let y = 0; y < 38; y++) { g.fillStyle = mix(skies[0], skies[1], Math.round(y / 38 * 6) / 6); g.fillRect(4, 4 + y, 58, 1); }
        disc(g, 44, 16, 6, '#ffe66d');
        g.fillStyle = '#1f8fd6'; g.fillRect(4, 28, 58, 6); g.fillStyle = '#f2d49b'; g.fillRect(4, 34, 58, 8);
    }
    return outline(c, '#111118');
}

function buildGantry(arrival, night) {
    const { c, g } = mk(124, 46);
    g.fillStyle = '#9a9aa6'; g.fillRect(2, 8, 5, 38); g.fillRect(117, 8, 5, 38);
    g.fillStyle = '#d8d8e0'; g.fillRect(2, 8, 1, 38); g.fillRect(117, 8, 1, 38);
    g.fillStyle = night ? '#140a26' : '#ffffff'; g.fillRect(2, 4, 120, 20);
    g.fillStyle = night ? '#ff2a9d' : '#d02020'; g.fillRect(2, 4, 120, 2); g.fillRect(2, 22, 120, 2);
    if (arrival) for (let i = 0; i < 30; i++) { g.fillStyle = i % 2 ? '#111' : '#fff'; g.fillRect(2 + i * 4, 6, 4, 2); g.fillRect(2 + ((i + 1) % 30) * 4, 20, 4, 2); }
    const txt = arrival ? 'ARRIVEE' : 'START', tw = txt.length * 6 - 1;
    pixelText(g, txt, 62 - Math.floor(tw / 2) + 1, 11, night ? '#5a0a3a' : '#f0b0b0');
    pixelText(g, txt, 62 - Math.floor(tw / 2), 10, night ? '#00f3ff' : '#d02020');
    return outline(c, '#15151c');
}

// ---------- Voitures ----------
const carCache = {};
function buildCar(color) {
    const { c, g } = mk(42, 28); g.translate(1, 1);
    const B = color, D = shade(color, 0.62), L = shade(color, 1.4);
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    R(3, 18, 7, 8, '#111'); R(30, 18, 7, 8, '#111'); R(4, 19, 1, 6, '#3a3a3a'); R(31, 19, 1, 6, '#3a3a3a');
    R(1, 11, 38, 10, B); R(1, 11, 2, 10, D); R(37, 11, 2, 10, D);
    for (let y = 3; y <= 10; y++) { const ins = Math.round((10 - y) * 0.6) + 5; R(ins, y, 40 - 2 * ins, 1, y === 3 ? L : B); }
    for (let y = 5; y <= 9; y++) { const ins = Math.round((10 - y) * 0.6) + 8; R(ins, y, 40 - 2 * ins, 1, y < 7 ? '#3d5a85' : '#1d2b45'); }
    R(12, 6, 2, 1, '#9fc2ee'); R(14, 5, 2, 1, '#9fc2ee');
    R(3, 12, 34, 1, L);
    R(3, 14, 8, 3, '#8a0d12'); R(4, 14, 6, 2, '#ff3b3b'); R(29, 14, 8, 3, '#8a0d12'); R(30, 14, 6, 2, '#ff3b3b');
    R(12, 14, 16, 3, D);
    R(15, 17, 10, 3, '#e8e8e8'); R(16, 18, 8, 1, '#555');
    R(1, 20, 38, 2, '#2a2a2e'); R(1, 20, 38, 1, '#4a4a52');
    R(7, 22, 3, 1, '#777');
    return outline(c, '#08080e');
}
function buildTruck(color) {
    const { c, g } = mk(48, 42); g.translate(1, 1);
    const B = color, D = shade(color, 0.7), L = shade(color, 1.15);
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    R(3, 32, 8, 8, '#111'); R(35, 32, 8, 8, '#111');
    R(1, 1, 44, 30, B); R(1, 1, 44, 2, L); R(1, 1, 2, 30, D); R(43, 1, 2, 30, D);
    R(22, 3, 2, 27, D);
    for (let y = 6; y < 30; y += 6) { R(3, y, 19, 1, D); R(24, y, 19, 1, D); }
    R(18, 14, 2, 4, '#555'); R(26, 14, 2, 4, '#555');
    R(1, 30, 44, 4, '#2a2a2e'); R(2, 30, 6, 3, '#ff3b3b'); R(38, 30, 6, 3, '#ff3b3b');
    R(18, 31, 10, 3, '#e8e8e8');
    return outline(c, '#08080e');
}
function getCarSprite(type, color) {
    const key = type + color;
    return carCache[key] || (carCache[key] = type === 'truck' ? buildTruck(color) : buildCar(color));
}

// Voiture du joueur (cabriolet rouge avec Nicotch et son passager)
// lean : -1 gauche / 0 tout droit / 1 droite ; brake : feux stop allumés
function buildPlayer(lean, brake) {
    const { c, g } = mk(62, 36); g.translate(2, 1);
    const B = '#e0201b', D = '#9c1210', L = '#ff6a4d', s = lean;
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    // roues (on voit un peu le flanc de la roue en virage)
    R(3, 21, 9, 11, '#111'); R(46, 21, 9, 11, '#111');
    for (let y = 22; y < 32; y += 2) { R(4, y, 7, 1, '#262626'); R(47, y, 7, 1, '#262626'); }
    if (s < 0) R(1, 22, 2, 9, '#2c2c2c'); if (s > 0) R(55, 22, 2, 9, '#2c2c2c');
    // sièges et têtes
    R(13 + s, 6, 12, 6, '#262626'); R(33 + s, 6, 12, 6, '#262626');
    R(14 + s, 6, 10, 1, '#3e3e3e'); R(34 + s, 6, 10, 1, '#3e3e3e');
    R(16 + s, 1, 7, 7, '#4a2a1a'); R(17 + s, 1, 3, 2, '#6a4026'); R(18 + s, 8, 3, 2, '#d9a37a');
    R(36 + s, 1, 7, 7, '#e8c33a'); R(37 + s, 1, 3, 2, '#fff08a'); R(38 + s, 8, 3, 2, '#f0c08a');
    // arceau
    R(10 + s, 9, 38, 1, '#3a3a3a');
    // carrosserie
    R(1, 13, 56, 10, B); R(1, 13, 3, 10, D); R(54, 13, 3, 10, D); R(1, 21, 56, 2, D);
    R(4, 10, 50, 3, B); R(4, 10, 50, 1, L); R(1, 13, 56, 1, L);
    R(25, 10, 2, 13, '#f4f4f4'); R(31, 10, 2, 13, '#f4f4f4'); // bandes de course
    // feux arrière
    const tl = brake ? '#ff5050' : '#a0101a', tc = brake ? '#ffe0e0' : '#ff3b3b';
    R(4, 15, 17, 4, '#5a0008'); R(5, 16, 15, 2, tl); R(8, 16, 6, 1, tc);
    R(37, 15, 17, 4, '#5a0008'); R(38, 16, 15, 2, tl); R(44, 16, 6, 1, tc);
    R(23, 19, 12, 3, '#f0f0f0'); R(24, 20, 10, 1, '#333');
    R(1, 23, 56, 2, '#2a2a2e'); R(1, 23, 56, 1, '#4a4a52');
    R(10, 25, 4, 2, '#999'); R(44, 25, 4, 2, '#999');
    return outline(c, '#0a0508');
}
const playerSprites = {};
function getPlayerSprite(lean, brake) {
    const k = lean + '' + brake;
    return playerSprites[k] || (playerSprites[k] = buildPlayer(lean, brake ? 1 : 0));
}

// ---------- Construction de toutes les images de décor ----------
const billboardImages = [];
for (let i = 1; i <= 7; i++) {
    const im = new Image();
    im.onload = () => { for (const k in SPR) if (k.startsWith('billboard')) delete SPR[k]; };
    im.src = 'assets/panneaux/panneau' + i + '.jpg';
    billboardImages.push(im);
}

const SPRITE_INFO = {
    palm: { w: 0.78, hit: 0.05 }, tree: { w: 0.6, hit: 0.07 }, pine: { w: 0.38, hit: 0.05 },
    rock: { w: 0.3, hit: 0.13 }, hay: { w: 0.24, hit: 0.11 }, billboard: { w: 0.52, hit: 0.2 },
    fan: { w: 0.1, hit: 0 }, hitchhiker: { w: 0.11, hit: 0 }, lamp: { w: 0.24, hit: 0.04 },
    pickup: { w: 0.16, hit: 0 }, gantry: { w: 2.4, hit: 0 }
};
// Renvoie l'image (canvas) d'un décor, construite à la demande puis gardée en cache
function getSprite(type, v, night, snow) {
    const key = type + '|' + v + '|' + (night ? 1 : 0) + (snow ? 1 : 0);
    if (SPR[key]) return SPR[key];
    let c;
    switch (type) {
        case 'palm': c = buildPalm(night); break;
        case 'tree': c = buildTree(); break;
        case 'pine': c = buildPine(snow); break;
        case 'rock': c = buildRock(); break;
        case 'hay': c = buildHay(); break;
        case 'fan': c = buildFan(v >> 1, v & 1); break;
        case 'hitchhiker': c = buildHitchhiker(); break;
        case 'lamp': c = buildLamp(); if (v) c = flipX(c); break;
        case 'pickup': c = buildPickup(v); break;
        case 'gantry': c = buildGantry(v === 1, night); break;
        case 'billboard': {
            const im = billboardImages[v % billboardImages.length];
            c = buildBillboard(im && im.complete && im.naturalWidth ? im : null, night, v);
            break;
        }
    }
    return SPR[key] = c;
}

// =====================================================================
//  FOND : ciel tramé, soleil, nuages, montagnes / mer / ville
// =====================================================================
function buildCloud(seed) {
    const { c, g } = mk(48, 18);
    const blobs = seed ? [[12, 11, 7], [22, 8, 8], [33, 10, 7], [40, 12, 5]] : [[10, 12, 6], [19, 9, 7], [29, 10, 6]];
    blobs.forEach(([x, y, r]) => disc(g, x, y, r, '#cfe0ff'));
    blobs.forEach(([x, y, r]) => disc(g, x - 1, y - 1, r - 1, '#ffffff'));
    g.clearRect(0, 15, 48, 3);
    g.fillStyle = '#b8cdf2'; g.fillRect(4, 14, 42, 1);
    return crisp(c);
}
const CLOUDS = [buildCloud(0), buildCloud(1)];

function buildSky(track, W, hz) {
    const { c, g } = mk(W, hz);
    const cols = track.sky.map(hexToRgb), n = cols.length - 1;
    const img = g.createImageData(W, hz), p = img.data;
    for (let y = 0; y < hz; y++) {
        const f = y / Math.max(1, hz - 1) * n, i0 = Math.min(n - 1, Math.floor(f));
        const steps = 4, fr = f - i0, q = Math.floor(fr * steps);
        for (let x = 0; x < W; x++) {
            const t = (q + (bayer(x, y) < fr * steps - q ? 1 : 0)) / steps;
            const A = cols[i0], B = cols[i0 + 1], k = (y * W + x) * 4;
            p[k] = A[0] + (B[0] - A[0]) * t; p[k + 1] = A[1] + (B[1] - A[1]) * t; p[k + 2] = A[2] + (B[2] - A[2]) * t; p[k + 3] = 255;
        }
    }
    g.putImageData(img, 0, 0);

    const rnd = mulberry(7);
    if (track.night) {
        for (let i = 0; i < W * hz / 90; i++) {
            const x = Math.floor(rnd() * W), y = Math.floor(rnd() * hz * 0.75);
            g.fillStyle = rnd() < 0.15 ? '#9ffcff' : (rnd() < 0.5 ? '#ffffff' : '#a59ad8');
            g.fillRect(x, y, 1, 1);
            if (rnd() < 0.04) { g.fillRect(x - 1, y, 3, 1); g.fillRect(x, y - 1, 1, 3); }
        }
        // soleil rétro à bandes
        const r = Math.round(hz * 0.42), cx = Math.round(W / 2), cy = hz - Math.round(r * 0.45);
        for (let y = -r - 4; y <= r + 4; y++) for (let x = -r - 4; x <= r + 4; x++) {
            const d = Math.sqrt(x * x + y * y);
            if (d > r && d < r + 4 && bayer(cx + x, cy + y) < (r + 4 - d) / 8) { g.fillStyle = '#ff2d95'; g.fillRect(cx + x, cy + y, 1, 1); }
        }
        for (let y = -r; y <= r; y++) {
            const t = (y + r) / (2 * r);
            if (y > 0) { const per = 7, gap = 1 + Math.floor(t * 4); if ((y % per) < gap - 1 || (y % per) === 0 && t > 0.7) continue; }
            const hw = Math.floor(Math.sqrt(r * r - y * y));
            for (let x = -hw; x <= hw; x++) {
                const tt = t + (bayer(cx + x, cy + y) - 0.5) * 0.12;
                g.fillStyle = tt < 0.35 ? '#fff27a' : tt < 0.55 ? '#ffc23f' : tt < 0.75 ? '#ff7a4a' : '#ff2d95';
                g.fillRect(cx + x, cy + y, 1, 1);
            }
        }
    } else {
        const r = Math.max(5, Math.round(hz * 0.08)), cx = Math.round(W * 0.82), cy = Math.round(hz * 0.42);
        const sky = track.sky[Math.min(track.sky.length - 1, 2)];
        disc(g, cx, cy, Math.round(r * 2.2), mix(sky, '#ffffff', 0.18));
        disc(g, cx, cy, Math.round(r * 1.55), mix(sky, '#fff6c8', 0.4));
        disc(g, cx, cy, r, '#ffe680'); disc(g, cx - 1, cy - 1, r - 2, '#fff8cc');
    }
    return c;
}

function mulberry(a) {
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// Bandes de décor qui défilent (parallaxe). Largeur 512 px, se répètent sans couture.
const STRIP = 512;
function buildLayer(L, H, seed) {
    const h = Math.max(4, Math.round(H * L.h)), { c, g } = mk(STRIP, h + 1);
    const rnd = mulberry(seed);
    const per = (x, k, ph) => Math.sin(2 * Math.PI * x / STRIP * k + ph);
    if (L.type === 'sea') {
        g.fillStyle = L.col; g.fillRect(0, 0, STRIP, h + 1);
        for (let i = 0; i < STRIP * h / 14; i++) {
            const x = Math.floor(rnd() * STRIP), y = Math.floor(rnd() * h);
            g.fillStyle = y < h * 0.3 ? '#bfe6ff' : shade(L.col, 1.25); g.fillRect(x, y, 2 + Math.floor(rnd() * 4), 1);
        }
        g.fillStyle = '#e8f6ff'; g.fillRect(0, 0, STRIP, 1);
        return c;
    }
    if (L.type === 'city') {
        let x = 0;
        while (x < STRIP) {
            const bw = 10 + Math.floor(rnd() * 18), bh = Math.round(h * (0.35 + rnd() * 0.65));
            for (const ox of [0, -STRIP, STRIP]) {
                g.fillStyle = L.col; g.fillRect(x + ox, h + 1 - bh, bw, bh);
                g.fillStyle = shade(L.col, 1.5); g.fillRect(x + ox, h + 1 - bh, bw, 1);
            }
            const wr = mulberry(x * 13 + 1);
            for (let wy = h + 1 - bh + 3; wy < h - 1; wy += 3) for (let wx = x + 2; wx < x + bw - 2; wx += 3) {
                if (wr() < 0.32) { g.fillStyle = ['#ffcf5c', '#ff4fa0', '#4ff0ff', '#ffcf5c'][Math.floor(wr() * 4)]; g.fillRect(wx % STRIP, wy, 1, 1); }
            }
            if (rnd() < 0.3) { g.fillStyle = L.col; g.fillRect(x + (bw >> 1), h + 1 - bh - 5, 1, 5); g.fillStyle = '#ff2040'; g.fillRect(x + (bw >> 1), h + 1 - bh - 6, 1, 1); }
            x += bw + Math.floor(rnd() * 3);
        }
        return c;
    }
    const ph = [rnd() * 6, rnd() * 6, rnd() * 6], k = L.type === 'mountains' ? [3, 7, 13] : L.type === 'forest' ? [5, 23, 61] : [2, 5, 11];
    const amp = L.type === 'forest' ? [0.25, 0.2, 0.15] : [0.6, 0.3, 0.1];
    const hgt = x => {
        const v = amp[0] * per(x, k[0], ph[0]) + amp[1] * per(x, k[1], ph[1]) + amp[2] * Math.abs(per(x, k[2], ph[2]));
        return Math.round(h * (0.55 + 0.45 * v / (amp[0] + amp[1] + amp[2])));
    };
    const light = shade(L.col, L.type === 'mountains' ? 1.18 : 1.12), dark = shade(L.col, 0.88);
    const H2 = [];
    for (let x = 0; x < STRIP; x++) H2[x] = hgt(x);
    const at = x => H2[((x % STRIP) + STRIP) % STRIP];
    const snowLine = Math.round(h * 0.55);
    for (let x = 0; x < STRIP; x++) {
        const top = h + 1 - H2[x], slope = at(x + 3) - at(x - 3);
        for (let y = top; y <= h; y++) {
            const depth = (y - top) / Math.max(1, h - top);
            let col = slope > 1 ? light : slope < -1 ? dark : L.col;
            if (L.snow && H2[x] > snowLine && y < h + 1 - snowLine + Math.round(2 * Math.sin(x * 0.45) + Math.sin(x * 1.7)) && depth < 0.6) col = slope >= 0 ? '#f4f8ff' : '#c4d0e8';
            else if (depth > 0.5 && bayer(x, y) < (depth - 0.5) * 0.5) col = shade(L.col, 0.9);
            g.fillStyle = col; g.fillRect(x, y, 1, 1);
        }
        if (L.night) { g.fillStyle = '#ff2d95'; g.fillRect(x, top, 1, 1); }
        else if (L.type !== 'mountains') { g.fillStyle = light; g.fillRect(x, top, 1, 1); }
    }
    return c;
}

// Dessine un texte "arcade" avec contour noir, dans le canvas du jeu
function drawText(ctx, str, x, y, size, col, maxW, outlineCol = '#120020') {
    ctx.font = Math.round(size) + "px 'NR Pixel', 'Press Start 2P', monospace";
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = outlineCol;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1], [0, 2], [1, 2], [-1, 2]]) ctx.fillText(str, Math.round(x) + dx, Math.round(y) + dy, maxW);
    ctx.fillStyle = col; ctx.fillText(str, Math.round(x), Math.round(y), maxW);
}
