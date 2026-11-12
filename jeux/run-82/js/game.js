// =====================================================================
//  NICOTCH RUN 82 - MOTEUR DU JEU
//  Route en pseudo-3D (technique des jeux type Out Run) :
//  la route est une suite de "segments" projetés à l'écran.
// =====================================================================
'use strict';

// ---------------------------- RÉGLAGES -------------------------------
const SEG_LEN = 200;                 // longueur d'un segment de route
const ROAD_W = 2000;                 // demi-largeur de la route (unités monde)
const CAM_H = 1000;                  // hauteur de la caméra
const DRAW_DIST = 220;               // nombre de segments affichés
const CAM_DEPTH = 1 / Math.tan(50 * Math.PI / 180);
const PLAYER_Z = CAM_H * CAM_DEPTH;  // distance caméra -> voiture du joueur
const LINE_IDX = 8, LINE_Z = LINE_IDX * SEG_LEN;   // ligne de départ/arrivée
const LANES = [-2 / 3, 0, 2 / 3];    // centre des 3 voies

// Tailles et zones de collision (1 = demi-largeur de route)
const PLAYER_W = 0.30, PLAYER_HW = 0.115;
const CAR = {
    car: { w: 0.27, hw: 0.115, len: 230 },
    truck: { w: 0.33, hw: 0.145, len: 380 }
};
const TRAFFIC_COLORS = ['#ff0055', '#00e5ff', '#ffbe0b', '#8338ec', '#3a86ff', '#2ec4b6', '#f4f4f4'];
const TRUCK_COLORS = ['#e8e8e8', '#f2c14e', '#5aa9e6', '#e85d75'];

// =====================================================================
//  ★ RÉGLAGE PRINCIPAL : VITESSE DU JEU ★
//  1.0 = très rapide (version d'origine) · 0.7 = conseillé · 0.5 = balade
//  Le temps de course s'adapte tout seul, le jeu reste jouable.
// =====================================================================
const VITESSE_JEU = 0.7;

const DIFFS = {
    easy:   { label: 'FACILE',    maxSpeed: 7000,  accel: 2400, time: 40, traffic: 14, trafficSpeed: 3000, lapBonus: 8, pickupTime: 3 },
    normal: { label: 'NORMAL',    maxSpeed: 9000,  accel: 2800, time: 32, traffic: 22, trafficSpeed: 4200, lapBonus: 7, pickupTime: 2 },
    hard:   { label: 'DIFFICILE', maxSpeed: 11000, accel: 3200, time: 25, traffic: 30, trafficSpeed: 5500, lapBonus: 6, pickupTime: 2 },
    neon:   { label: 'EXPERT',    maxSpeed: 12000, accel: 3400, time: 28, traffic: 34, trafficSpeed: 6000, lapBonus: 7, pickupTime: 2 }
};

// Circuits : couleurs, décors de fond, objets au bord de la route, tracé
// layout = liste de [nombre de segments, courbure, montée/descente]
const TRACKS = {
    easy: {
        name: 'PLAGE', sky: ['#1a5fd6', '#3b82ea', '#6fa8f2', '#b5d8fa'], fogCol: '#c4def7', fog: 0.9,
        layers: [{ type: 'mountains', k: 0.2, h: 0.09, col: '#7d9cc0' }, { type: 'sea', k: 0.5, h: 0.035, col: '#2a8fd8' }],
        ground: ['#e8dcb5', '#ddd0a6'], road: ['#8f8f95', '#99999f'], rumble: ['#d83a2e', '#f4f4f4'], lane: '#f4f4f4', edge: '#f4f4f4',
        dust: ['#f4ead0', '#e0d2a8'], clouds: true,
        sprites: ['palm', 'palm', 'palm', 'billboard', 'rock', 'hitchhiker'],
        layout: [[40, 0, 0], [50, 1, 0], [40, 0, 200], [50, -1.5, -200], [60, 0, 0], [40, 1.5, 300], [50, 0, -300], [50, -1, 0]]
    },
    normal: {
        name: 'CAMPAGNE', sky: ['#2f6fd0', '#4f8fe0', '#86b6ee', '#c4dcf4'], fogCol: '#c8dcef', fog: 0.9,
        layers: [{ type: 'mountains', k: 0.15, h: 0.13, col: '#8ea6c4' }, { type: 'hills', k: 0.35, h: 0.09, col: '#6aa84f' }, { type: 'forest', k: 0.7, h: 0.05, col: '#2f6f2a' }],
        ground: ['#58a23b', '#4f9634'], road: ['#8b8b90', '#95959a'], rumble: ['#d83a2e', '#f4f4f4'], lane: '#f4f4f4', edge: '#f4f4f4',
        dust: ['#8a6a44', '#6a4e30'], clouds: true,
        sprites: ['tree', 'tree', 'tree', 'billboard', 'hay', 'hay'],
        layout: [[40, 0, 0], [60, 2, 800], [50, -3, -400], [80, 3, 1000], [60, -2, -1400], [80, 0, 0]]
    },
    hard: {
        name: 'MONTAGNE', sky: ['#1d3466', '#34548f', '#6a8fc4', '#b3cbe6'], fogCol: '#b4c8e2', fog: 1,
        layers: [{ type: 'mountains', k: 0.12, h: 0.26, col: '#7d8fae', snow: true }, { type: 'mountains', k: 0.3, h: 0.15, col: '#55667f' }, { type: 'forest', k: 0.7, h: 0.06, col: '#1c4a30' }],
        ground: ['#4d7a45', '#456f3f'], road: ['#6f6f75', '#78787e'], rumble: ['#d83a2e', '#f4f4f4'], lane: '#f4f4f4', edge: '#f4f4f4',
        dust: ['#8a8a80', '#6a6a62'], clouds: true, snow: true,
        sprites: ['pine', 'pine', 'pine', 'pine', 'rock', 'billboard'],
        layout: [[40, 0, 0], [50, 3, 1200], [40, -4, 600], [50, 4, -300], [40, -3, 1400], [50, 4, -1200], [40, -4, -900], [40, 3, -800]]
    },
    neon: {
        name: 'NUIT NÉON', night: true, sky: ['#05010f', '#120833', '#35105a', '#7a1f6e'], fogCol: '#3a0f52', fog: 0.85,
        layers: [{ type: 'city', k: 0.25, h: 0.2, col: '#1b0f33' }],
        ground: ['#120624', '#0e041d'], road: ['#241a3a', '#2a2044'], rumble: ['#ff2a9d', '#00f3ff'], lane: '#00f3ff', edge: '#ff2a9d',
        dust: ['#ff2a9d', '#8a3aff'], grid: true,
        sprites: ['palm', 'palm', 'billboard'],
        layout: [[40, 0, 0], [60, 2, 0], [40, -3, 400], [60, 3, -400], [40, 0, 600], [60, -4, -600], [50, 4, 0], [60, -2, 0], [40, 0, 0]]
    }
};

// ---------------------------- ÉTAT DU JEU ----------------------------
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W = 320, H = 180, PX = 3, hz = 90;

let trackKey = 'normal', track = TRACKS.normal, diff = DIFFS.normal;
let segments = [], trackLength = 0, cars = [], pickups = [];
let position = 0, playerX = 0, playerVX = 0, speed = 0;
let score = 0, timeLeft = 0, lap = 1;
let isRunning = false, paused = false, countdown = 0, lastCount = 0;
let lineSeen = false, runTime = 0, lapStart = 0, bestLap = Infinity, arrival = null;
let shake = 0, flash = 0, sceneryCool = 0, bgScroll = 0, clock = 0;
let popups = [], particles = [];
let combo = 0, comboT = 0, maxCombo = 0, nearMisses = 0;
let turboGauge = 0, turboT = 0, turboReadyShown = false;
let steerLean = 0, braking = false;
let bg = null, vignette = null;

// ---------------------------- OUTILS ---------------------------------
const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const wrapZ = z => ((z % trackLength) + trackLength) % trackLength;
const signedDist = d => { d = wrapZ(d); return d > trackLength / 2 ? d - trackLength : d; };
const playerZ = () => wrapZ(position + PLAYER_Z);
// Vrai si on est passé par la position z entre deux images
const crossed = (a, b, z) => a <= b ? (z > a && z <= b) : (z > a || z <= b);

const textCache = {};
function setText(id, v) { if (textCache[id] !== v) { textCache[id] = v; $(id).textContent = v; } }

// ---------------------------- ÉCRAN ----------------------------------
function resizeCanvas() {
    const r = canvas.parentElement.getBoundingClientRect();
    PX = Math.max(2, Math.round(r.width / 420));
    W = canvas.width = Math.ceil(r.width / PX);
    H = canvas.height = Math.ceil(r.height / PX);
    hz = Math.round(H * 0.5);
    ctx.imageSmoothingEnabled = false;
    rebuildBackground();
}
function rebuildBackground() {
    bg = {
        sky: buildSky(track, W, hz),
        layers: track.layers.map((L, i) => ({ c: buildLayer({ ...L, night: track.night }, H, i * 31 + 7), k: L.k }))
    };
    const v = mk(W, H);
    const gr = v.g.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.45)');
    v.g.fillStyle = gr; v.g.fillRect(0, 0, W, H);
    vignette = v.c;
}

// ---------------------------- CONSTRUCTION DU CIRCUIT ----------------
function lastY() { return segments.length ? segments[segments.length - 1].p2.world.y : 0; }
function addSegment(curve, y) {
    const n = segments.length;
    segments.push({
        index: n, curve, sprites: [], clip: 0,
        p1: { world: { y: lastY(), z: n * SEG_LEN }, camera: {}, screen: {} },
        p2: { world: { y, z: (n + 1) * SEG_LEN }, camera: {}, screen: {} },
        band: Math.floor(n / 3) % 2
    });
}
function buildRoad() {
    segments = [];
    // Les virages s'enclenchent et se relâchent en douceur (plus joli et plus fluide)
    const addRoad = (n, curve, dy) => {
        const sy = lastY();
        for (let i = 0; i < n; i++) {
            const e = Math.min(1, (i + 1) / (n * 0.3), (n - i) / (n * 0.3));
            addSegment(curve * e * e * (3 - 2 * e), sy + dy * (1 - Math.cos(Math.PI * (i + 1) / n)) / 2);
        }
    };
    track.layout.forEach(([n, c, d]) => addRoad(n, c, d));
    trackLength = segments.length * SEG_LEN;
    const N = segments.length;

    // Supporters autour de la ligne de départ
    for (let i = LINE_IDX - 4; i <= LINE_IDX + 3; i++) for (const sd of [-1, 1]) for (let k = 0; k < 3; k++)
        segments[i].sprites.push({ type: 'fan', offset: sd * rand(1.25, 1.8), v: Math.floor(Math.random() * 12) });

    // Lampadaires néon (circuit de nuit)
    if (track.night) for (let i = 12; i < N - 2; i += 8) {
        segments[i].sprites.push({ type: 'lamp', offset: -1.22, v: 0 });
        segments[i].sprites.push({ type: 'lamp', offset: 1.22, v: 1 });
    }

    // Décors aléatoires
    let bb = Math.floor(Math.random() * 7);
    for (let i = 14; i < N - 4; i += 3) {
        if (Math.random() < 0.25 || (track.night && i % 8 === 4)) continue;
        const type = track.sprites[Math.floor(Math.random() * track.sprites.length)];
        const side = Math.random() < 0.5 ? -1 : 1;
        const off = type === 'billboard' ? 1.6 : type === 'hitchhiker' ? 1.2 : rand(1.4, 1.95);
        segments[i].sprites.push({ type, offset: side * off, v: type === 'billboard' ? bb++ % 7 : 0 });
    }

    // Bonus de temps sur la route
    pickups = [];
    for (let i = 45; i < N - 12; i += 55 + Math.floor(Math.random() * 40))
        pickups.push({ seg: i, z: i * SEG_LEN + SEG_LEN / 2, offset: LANES[Math.floor(Math.random() * 3)], taken: false });
}

function resetCars() {
    cars = [];
    const N = segments.length;
    for (let i = 0; i < diff.traffic; i++) {
        let lane, z, tries = 0;
        do {
            lane = Math.floor(Math.random() * 3);
            z = (30 + Math.floor(Math.random() * (N - 34))) * SEG_LEN;
            tries++;
        } while (tries < 20 && cars.some(c => c.lane === lane && Math.abs(signedDist(c.z - z)) < 700));
        const type = Math.random() < 0.18 ? 'truck' : 'car';
        const base = diff.trafficSpeed * (type === 'truck' ? 0.8 : 1) + rand(-600, 600);
        cars.push({
            z, lane, offset: LANES[lane], speed: base, base, type,
            color: type === 'truck' ? TRUCK_COLORS[i % TRUCK_COLORS.length] : TRAFFIC_COLORS[i % TRAFFIC_COLORS.length],
            cool: 0, lcT: rand(0, 2), prevRel: null
        });
    }
}

function selectTrack(key) {
    trackKey = key; track = TRACKS[key];
    // on applique le réglage VITESSE_JEU : tout roule moins vite, mais on a plus de temps
    const d = DIFFS[key], v = VITESSE_JEU, t = 1 / v;
    diff = { ...d, maxSpeed: d.maxSpeed * v, accel: d.accel * v, trafficSpeed: d.trafficSpeed * v,
             time: Math.round(d.time * t), lapBonus: Math.round(d.lapBonus * t), pickupTime: Math.round(d.pickupTime * t) };
    buildRoad(); resetCars(); rebuildBackground();
}

// ---------------------------- PROJECTION 3D -> 2D --------------------
function project(p, camX, camY, camZ) {
    p.camera.x = -camX;
    p.camera.y = (p.world.y || 0) - camY;
    p.camera.z = (p.world.z || 0) - camZ;
    p.screen.scale = CAM_DEPTH / Math.max(1, p.camera.z);
    p.screen.x = Math.round(W / 2 + p.screen.scale * p.camera.x * W / 2);
    p.screen.y = Math.round(H / 2 - p.screen.scale * p.camera.y * H / 2);
    p.screen.w = Math.round(p.screen.scale * ROAD_W * W / 2);
}

// ---------------------------- PARTICULES -----------------------------
function emit(x, y, n, cols, spd, life, grav = 0, size = 1) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = spd * rand(0.3, 1);
        particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - spd * 0.3, life: life * rand(0.5, 1), col: cols[i % cols.length], g: grav, s: size });
    }
}
function playerBox() {
    const k = Math.max(1, Math.round(PLAYER_W * W / 58));
    return { k, w: 62 * k, h: 36 * k, x: Math.round(W / 2), y: H - Math.max(1, Math.round(H * 0.015)) };
}

// ---------------------------- MISE À JOUR ----------------------------
function popup(text, col = '#ffea00') { popups.push({ text, t: 1.4, col }); }

function crash(big, side) {
    const pb = playerBox();
    const x = pb.x + side * pb.w * 0.45, y = pb.y - pb.h * 0.45;
    emit(x, y, big ? 22 : 10, ['#ffffff', '#ffe066', '#ff9a2a', '#ff4a2a'], big ? 90 : 60, 0.5, 160);
    shake = big ? 12 : 5;
    if (big) { flash = 0.35; combo = 0; comboT = 0; }
    big ? audio.crash(true) : audio.scrape();
    try { navigator.vibrate && navigator.vibrate(big ? 80 : 30); } catch (e) {}
}

function readControls() {
    const k = c => keys.has(c);
    let steer = (k('ArrowRight') || k('KeyD') || k('TouchRight') ? 1 : 0) - (k('ArrowLeft') || k('KeyA') || k('TouchLeft') ? 1 : 0);
    let gas = (k('ArrowUp') || k('KeyW') || k('TouchGas')) ? 1 : 0;
    let brake = (k('ArrowDown') || k('KeyS') || k('Space') || k('TouchBrake')) ? 1 : 0;
    let turbo = turboRequest || k('ShiftLeft') || k('ShiftRight') || k('KeyE') || k('TouchTurbo');
    turboRequest = false;
    if (pad.active) {
        if (!steer) steer = pad.steer;
        gas = Math.max(gas, pad.gas); brake = Math.max(brake, pad.brake); turbo = turbo || pad.turbo;
    }
    return { steer: clamp(steer, -1, 1), gas, brake, turbo };
}

function update(dt) {
    clock += dt;
    updateParticles(dt);
    popups.forEach(p => p.t -= dt); popups = popups.filter(p => p.t > 0);
    shake = Math.max(0, shake - 40 * dt);
    flash = Math.max(0, flash - dt);

    if (!isRunning) { updateAttract(dt); return; }
    if (paused) return;

    if (countdown > 0) {
        countdown -= dt;
        const c = Math.ceil(countdown);
        if (c < lastCount && c > 0) { lastCount = c; audio.beep(false); }
        if (countdown <= 0) {
            countdown = 0; popup('GO !', '#00f3ff'); audio.beep(true);
            audio.music.drums = true;
        }
        updateTraffic(dt, false);
        audio.updateEngine(0, false);
        return;
    }

    runTime += dt;
    const ctl = readControls();
    braking = ctl.brake > 0;
    steerLean = ctl.steer < -0.3 ? -1 : ctl.steer > 0.3 ? 1 : 0;

    // --- TURBO ---
    if (ctl.turbo && turboGauge >= 1 && turboT <= 0) {
        turboT = 3; audio.turbo(); popup('TURBO !', '#ff2a9d'); turboReadyShown = false;
    }
    if (turboT > 0) { turboT -= dt; turboGauge = Math.max(0, turboT / 3); }

    // --- VITESSE ---
    const maxS = diff.maxSpeed * (turboT > 0 ? 1.3 : 1);
    const offRoad = Math.abs(playerX) > 1.02;
    if (turboT > 0) speed += diff.accel * 2 * dt;
    else if (ctl.gas) speed += diff.accel * ctl.gas * dt;
    if (ctl.brake) speed -= diff.accel * 2.5 * ctl.brake * dt;
    else if (!ctl.gas && turboT <= 0) speed -= diff.accel * 0.5 * dt;
    if (speed > maxS) speed = Math.max(maxS, speed - diff.accel * 1.5 * dt);
    if (offRoad && speed > maxS * 0.45) { speed -= 7000 * VITESSE_JEU * dt; shake = Math.max(shake, 2.5); }
    speed = Math.max(0, speed);
    const ratio = speed / diff.maxSpeed;

    // --- DIRECTION (indépendante des images/seconde) ---
    const pz0 = playerZ();
    const seg = segments[Math.floor(pz0 / SEG_LEN) % segments.length];
    const grip = speed > 30 ? Math.max(0.3, Math.min(1, ratio)) : 0;
    playerX += ctl.steer * 3.0 * grip * dt;
    playerX -= seg.curve * ratio * ratio * 0.62 * dt;       // force centrifuge
    playerX += playerVX * dt; playerVX *= Math.exp(-7 * dt); // rebond après un choc
    playerX = clamp(playerX, -2.4, 2.4);

    // --- AVANCER ---
    position = wrapZ(position + speed * dt);
    let pz = playerZ();

    // --- TOURS ---
    if (crossed(pz0, pz, LINE_Z)) {
        if (!lineSeen) { lineSeen = true; lapStart = runTime; }
        else completeLap();
    }

    // --- COLLISIONS AVEC LE DÉCOR (on vérifie tous les segments traversés) ---
    sceneryCool = Math.max(0, sceneryCool - dt);
    if (sceneryCool === 0) {
        const N = segments.length, i0 = Math.floor(pz0 / SEG_LEN) % N, i1 = Math.floor(pz / SEG_LEN) % N;
        const steps = (i1 - i0 + N) % N;
        outer: for (let s = 0; s <= steps; s++) {
            for (const sp of segments[(i0 + s) % N].sprites) {
                const hit = SPRITE_INFO[sp.type].hit;
                if (!hit || Math.abs(playerX - sp.offset) >= PLAYER_HW + hit) continue;
                const toRoad = -Math.sign(sp.offset);       // on est toujours renvoyé vers la route
                playerX = sp.offset + toRoad * (PLAYER_HW + hit + 0.03);
                playerVX = toRoad * 1.6;
                const big = speed > 2500 * VITESSE_JEU;
                speed *= big ? 0.3 : 0.6;
                crash(big, -toRoad);
                if (sp.type === 'tree' || sp.type === 'palm' || sp.type === 'pine') {
                    const pb = playerBox();
                    emit(pb.x - toRoad * pb.w * 0.4, pb.y - pb.h, 12, ['#2c8a35', '#74cc5c', '#14491c'], 70, 0.8, 90);
                }
                sceneryCool = 0.35;
                break outer;
            }
        }
    }

    // --- BONUS DE TEMPS ---
    for (const p of pickups) {
        if (!p.taken && crossed(pz0, pz, p.z) && Math.abs(playerX - p.offset) < 0.22) {
            p.taken = true;
            timeLeft += diff.pickupTime; score += 500;
            turboGauge = Math.min(1, turboGauge + (turboT > 0 ? 0 : 0.15));
            popup('+' + diff.pickupTime + ' S', '#00f3ff'); audio.pickup();
            const pb = playerBox(); emit(pb.x, pb.y - pb.h, 16, ['#9ffcff', '#ffffff', '#00e5ff'], 80, 0.6, 0);
        }
    }

    // --- TRAFIC ---
    updateTraffic(dt, true, pz0);
    pz = playerZ();

    // --- TEMPS ---
    const before = Math.ceil(timeLeft);
    timeLeft -= dt;
    const after = Math.ceil(timeLeft);
    if (after < before && after <= 5 && after > 0) audio.tone(880, 'sine', 0.12, 0.15);
    if (timeLeft <= 0) { timeLeft = 0; endGame(); }

    // --- COMBO / TURBO PRÊT ---
    if (comboT > 0) { comboT -= dt; if (comboT <= 0) combo = 0; }
    if (turboGauge >= 1 && turboT <= 0 && !turboReadyShown) { turboReadyShown = true; popup('TURBO PRÊT !', '#ff2a9d'); audio.tone(988, 'square', 0.15, 0.1); audio.tone(1318, 'square', 0.2, 0.1, 0.1); }

    // --- SCORE / EFFETS ---
    score += Math.floor((speed / 100) * dt * 10 * (turboT > 0 ? 1.5 : 1));
    bgScroll += seg.curve * ratio * 18 * dt;
    if (arrival) { arrival.t -= dt; if (arrival.t <= 0) arrival = null; }

    const pb = playerBox();
    if (offRoad && speed > 400) {
        for (const sx of [-0.36, 0.36]) emit(pb.x + sx * pb.w, pb.y - 2, 1, track.dust, 40 + ratio * 40, 0.5, 30, Math.max(1, pb.k));
    }
    if (turboT > 0) {
        const flames = track.night ? ['#ffffff', '#9ffcff', '#00c8ff'] : ['#fff2a8', '#ffb13b', '#ff4a2a'];
        for (const sx of [-0.28, 0.28]) particles.push({ x: pb.x + sx * pb.w + rand(-1, 1), y: pb.y - 9 * pb.k, vx: rand(-10, 10), vy: rand(20, 60), life: rand(0.08, 0.18), col: flames[Math.floor(Math.random() * 3)], g: 0, s: pb.k + 1 });
    }

    audio.updateEngine(ratio, turboT > 0);
    updateHud();
}

function completeLap() {
    lap++;
    const lt = runTime - lapStart; lapStart = runTime;
    const rec = isFinite(bestLap) && lt < bestLap;
    if (lt < bestLap) bestLap = lt;
    const recKey = 'nicotch_bestlap_' + trackKey;
    let allTime = parseFloat(localStorage.getItem(recKey) || 'Infinity');
    const abs = lt < allTime;
    if (abs) try { localStorage.setItem(recKey, lt.toFixed(2)); } catch (e) {}
    timeLeft += diff.lapBonus; score += 5000;
    arrival = { t: 3.5, lap: lap - 1, time: lt, bonus: diff.lapBonus, rec, abs };
    pickups.forEach(p => p.taken = false);
    audio.lap();
}

function updateTraffic(dt, withPlayer, pz0) {
    const pz = playerZ();
    for (const car of cars) {
        car.cool = Math.max(0, car.cool - dt);
        car.lcT -= dt;
        // voiture devant dans la même voie ?
        let lead = null, ld = Infinity;
        for (const o of cars) {
            if (o === car || Math.abs(o.offset - car.offset) > 0.35) continue;
            const d = wrapZ(o.z - car.z);
            if (d > 0 && d < ld) { ld = d; lead = o; }
        }
        let target = car.base;
        if (lead && ld < 900 && lead.speed < car.base) {
            let changed = false;
            if (car.lcT <= 0) {
                // on essaye de doubler par une voie libre
                for (const L of [car.lane - 1, car.lane + 1].sort(() => Math.random() - 0.5)) {
                    if (L < 0 || L > 2) continue;
                    const free = !cars.some(o => o !== car && Math.abs(o.offset - LANES[L]) < 0.4 && Math.abs(signedDist(o.z - car.z)) < 650)
                        && !(withPlayer && Math.abs(playerX - LANES[L]) < 0.4 && Math.abs(signedDist(car.z - pz)) < 700);
                    if (free) { car.lane = L; car.lcT = rand(2, 4); changed = true; break; }
                }
            }
            if (!changed) target = Math.min(target, ld < 450 ? lead.speed * 0.95 : lead.speed);
        }
        car.speed += clamp(target - car.speed, -4000 * dt, 1500 * dt);
        car.offset += clamp(LANES[car.lane] - car.offset, -0.7 * dt, 0.7 * dt);
        car.z = wrapZ(car.z + car.speed * dt);
    }
    if (!withPlayer) { cars.forEach(c => c.prevRel = null); return; }

    // --- COLLISIONS AVEC LE TRAFIC ---
    // On compare la position relative avant / après pour ne jamais "traverser" une voiture,
    // même à très grande vitesse.
    for (const car of cars) {
        const spec = CAR[car.type];
        let rel = signedDist(car.z - playerZ());
        const prev = car.prevRel;
        const dx = playerX - car.offset, gap = Math.abs(dx), dir = dx >= 0 ? 1 : -1;
        const lateral = gap < PLAYER_HW + spec.hw;
        const overlapZ = Math.abs(rel) < spec.len * 0.5;
        const sweptThrough = prev !== null && prev > 0 && rel <= 0 && prev < 4000 * VITESSE_JEU + 1000;

        if (lateral && (overlapZ || sweptThrough) && car.cool === 0) {
            if (prev !== null && prev >= spec.len * 0.35) {
                // choc par l'arrière : on se replace derrière la voiture
                position = wrapZ(car.z - spec.len * 0.5 - PLAYER_Z);
                speed = Math.min(speed, car.speed * 0.75);
                car.speed += 400 * VITESSE_JEU;
                crash(true, 0);
                car.cool = 0.5;
            } else if (prev !== null && prev <= -spec.len * 0.35) {
                // une voiture plus rapide nous percute par l'arrière : petite poussée
                car.speed = Math.min(car.speed, speed * 0.9);
                speed += 600 * VITESSE_JEU;
                crash(false, 0);
                car.cool = 0.5;
            } else {
                // frottement sur le côté : les deux voitures s'écartent
                const overlap = PLAYER_HW + spec.hw - gap;
                playerX += dir * (overlap + 0.02);
                playerVX = dir * 1.2;
                car.offset = clamp(car.offset - dir * overlap * 0.4, -0.95, 0.95);
                const away = car.lane - dir;              // la voiture s'écarte de toi
                if (away >= 0 && away <= 2) { car.lane = away; car.lcT = 2; }
                speed *= 0.92;
                crash(false, -dir);
                car.cool = 0.3;
            }
            rel = signedDist(car.z - playerZ());
        } else if (sweptThrough && gap < PLAYER_HW + spec.hw + 0.28 && car.cool === 0) {
            // FRÔLEMENT : on vient de dépasser une voiture de très près
            nearMisses++;
            combo = Math.min(combo + 1, 5); comboT = 3; maxCombo = Math.max(maxCombo, combo);
            const pts = 300 * combo;
            score += pts;
            if (turboT <= 0) turboGauge = Math.min(1, turboGauge + 0.25);
            popup(combo > 1 ? 'FRÔLEMENT x' + combo + ' +' + pts : 'FRÔLEMENT +' + pts);
            audio.whoosh();
        }
        car.prevRel = rel;
    }
}

// Mode "démo" derrière le menu : la voiture roule toute seule
function updateAttract(dt) {
    if (!segments.length) return;
    speed = 3500 * VITESSE_JEU;
    const pz = playerZ(), seg = segments[Math.floor(pz / SEG_LEN) % segments.length];
    playerX += (-seg.curve * 0.15 - playerX) * dt;
    position = wrapZ(position + speed * dt);
    bgScroll += seg.curve * 0.4 * 18 * dt;
    steerLean = seg.curve > 1 ? 1 : seg.curve < -1 ? -1 : 0;
    braking = false;
    updateTraffic(dt, false);
}

function updateParticles(dt) {
    for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.life -= dt; }
    particles = particles.filter(p => p.life > 0);
    if (particles.length > 400) particles.splice(0, particles.length - 400);
}

// ---------------------------- DESSIN ---------------------------------
function poly(x1, y1, x2, y2, x3, y3, x4, y4, col) {
    ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
    ctx.closePath(); ctx.fill();
}

function drawBackground() {
    ctx.drawImage(bg.sky, 0, 0);
    if (track.clouds) {
        for (let i = 0; i < 5; i++) {
            const span = W + 120, k = 1 + (i % 2);
            const x = ((((i * W * 0.29 - bgScroll * 0.3 * k - clock * 2 * k) % span) + span) % span) - 60;
            const y = Math.round(hz * (0.1 + (i % 3) * 0.12));
            const c = CLOUDS[i % 2];
            ctx.drawImage(c, Math.round(x), y, c.width * k, c.height * k);
        }
    }
    for (const L of bg.layers) {
        const off = ((bgScroll * L.k) % STRIP + STRIP) % STRIP;
        const y = hz - L.c.height + 1;
        for (let x = -Math.round(off); x < W; x += STRIP) ctx.drawImage(L.c, x, y);
    }
    ctx.fillStyle = track.fogCol;
    ctx.fillRect(0, hz, W, H - hz);
}

// Dessine un objet du monde (décor/voiture) posé au sol en (x, y)
function drawWorld(c, x, y, worldW, halfRoad, clipY, alpha, shadow = true) {
    const w = Math.round(worldW * halfRoad), h = Math.round(w * c.height / c.width);
    if (w < 2 || h < 2 || x + w / 2 < 0 || x - w / 2 > W || y - h > H) return;
    const needClip = y > clipY;
    if (needClip) { if (y - h >= clipY) return; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, clipY); ctx.clip(); }
    if (alpha < 1) ctx.globalAlpha = alpha;
    if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(Math.round(x - w * 0.38), Math.round(y - Math.max(1, h * 0.03)), Math.round(w * 0.76), Math.max(1, Math.round(h * 0.05))); }
    ctx.drawImage(c, Math.round(x - w / 2), Math.round(y - h), w, h);
    if (alpha < 1) ctx.globalAlpha = 1;
    if (needClip) ctx.restore();
}

function glow(x, y, r, col) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function render() {
    ctx.save();
    if (shake > 0) ctx.translate(Math.round(rand(-1, 1) * shake / 3), Math.round(rand(-1, 1) * shake / 3));
    drawBackground();
    if (!segments.length) { ctx.restore(); return; }

    const N = segments.length;
    const baseIndex = Math.floor(position / SEG_LEN) % N;
    const basePct = (position % SEG_LEN) / SEG_LEN;
    const pz = playerZ();
    const ps = segments[Math.floor(pz / SEG_LEN) % N];
    const camY = ps.p1.world.y + (ps.p2.world.y - ps.p1.world.y) * ((pz % SEG_LEN) / SEG_LEN) + CAM_H;

    // 1. Projection de tous les segments visibles
    let x = 0, dx = -(segments[baseIndex].curve * basePct);
    const fogAt = [];
    for (let n = 0; n < DRAW_DIST; n++) {
        const s = segments[(baseIndex + n) % N];
        const camZ = position - (s.index < baseIndex ? trackLength : 0);
        project(s.p1, playerX * ROAD_W - x, camY, camZ);
        project(s.p2, playerX * ROAD_W - x - dx, camY, camZ);
        x += dx; dx += s.curve;
        const f = clamp((n / DRAW_DIST - 0.25) / 0.75, 0, 1);
        fogAt[n] = Math.round(f * f * track.fog * 12) / 12; // brouillard par paliers (look rétro)
    }

    // 2. Route : de près vers loin
    let maxY = H;
    const T = track;
    for (let n = 0; n < DRAW_DIST; n++) {
        const s = segments[(baseIndex + n) % N];
        const p1 = s.p1.screen, p2 = s.p2.screen;
        s.clip = maxY;
        if (s.p1.camera.z <= CAM_DEPTH || p2.y >= p1.y || p2.y >= maxY) continue;
        const f = fogAt[n], F = c => f ? mix(c, T.fogCol, f) : c;
        const w1 = p1.w, w2 = p2.w, b = s.band;

        ctx.fillStyle = F(T.ground[b]); ctx.fillRect(0, p2.y, W, p1.y - p2.y);
        if (T.grid) {
            const gc = F('#ff2a9d');
            if (s.index % 4 === 0) { ctx.fillStyle = gc; ctx.fillRect(0, p2.y, W, Math.max(1, Math.round((p1.y - p2.y) * 0.25))); }
            for (const k of [1.35, 1.9, 2.6, 3.5, 4.8, 6.5]) for (const sd of [-1, 1]) {
                const a = sd * k;
                poly(p1.x + a * w1 - w1 / 160, p1.y, p1.x + a * w1 + w1 / 160, p1.y, p2.x + a * w2 + w2 / 160, p2.y, p2.x + a * w2 - w2 / 160, p2.y, gc);
            }
        }
        const r1 = w1 / 8, r2 = w2 / 8;
        poly(p1.x - w1 - r1, p1.y, p1.x - w1, p1.y, p2.x - w2, p2.y, p2.x - w2 - r2, p2.y, F(T.rumble[b]));
        poly(p1.x + w1 + r1, p1.y, p1.x + w1, p1.y, p2.x + w2, p2.y, p2.x + w2 + r2, p2.y, F(T.rumble[b]));
        poly(p1.x - w1, p1.y, p1.x + w1, p1.y, p2.x + w2, p2.y, p2.x - w2, p2.y, F(T.road[b]));
        // bandes de bord
        const e1 = w1 / 45, e2 = w2 / 45, edge = F(T.edge);
        poly(p1.x - w1 + e1, p1.y, p1.x - w1 + 2 * e1, p1.y, p2.x - w2 + 2 * e2, p2.y, p2.x - w2 + e2, p2.y, edge);
        poly(p1.x + w1 - e1, p1.y, p1.x + w1 - 2 * e1, p1.y, p2.x + w2 - 2 * e2, p2.y, p2.x + w2 - e2, p2.y, edge);
        // lignes de voies (pointillés)
        if (b) for (const k of [-1 / 3, 1 / 3])
            poly(p1.x + k * w1 - w1 / 70, p1.y, p1.x + k * w1 + w1 / 70, p1.y, p2.x + k * w2 + w2 / 70, p2.y, p2.x + k * w2 - w2 / 70, p2.y, F(T.lane));
        // damier de la ligne d'arrivée
        if (s.index === LINE_IDX || s.index === LINE_IDX + 1) {
            const off = s.index - LINE_IDX;
            for (let i = 0; i < 12; i++) {
                const a = -1 + i / 6, bb = a + 1 / 6;
                poly(p1.x + a * w1, p1.y, p1.x + bb * w1, p1.y, p2.x + bb * w2, p2.y, p2.x + a * w2, p2.y, (i + off) % 2 ? '#111111' : '#f4f4f4');
            }
        }
        maxY = p2.y;
    }

    // Phares la nuit
    const pb = playerBox();
    if (T.night) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(255,235,170,0.07)';
        for (const sp of [1, 0.7]) poly(pb.x - pb.w * 0.32, pb.y - pb.h * 0.6, pb.x + pb.w * 0.32, pb.y - pb.h * 0.6, pb.x + pb.w * 1.3 * sp, H * 0.62, pb.x - pb.w * 1.3 * sp, H * 0.62, ctx.fillStyle);
        ctx.restore();
    }

    // 3. Décors, bonus et voitures : du loin vers le près
    const carsBySeg = new Map();
    for (const c of cars) { const i = Math.floor(c.z / SEG_LEN) % N; (carsBySeg.get(i) || carsBySeg.set(i, []).get(i)).push(c); }
    const pickBySeg = new Map(pickups.filter(p => !p.taken).map(p => [p.seg, p]));

    for (let n = DRAW_DIST - 1; n >= 0; n--) {
        const s = segments[(baseIndex + n) % N];
        if (s.p1.camera.z <= CAM_DEPTH) continue;
        const p1 = s.p1.screen, p2 = s.p2.screen;
        const alpha = 1 - fogAt[n] * 0.85;
        if (s.index === LINE_IDX) drawWorld(getSprite('gantry', lineSeen ? 1 : 0, T.night), p1.x, p1.y, 2.4, p1.w, s.clip, alpha, false);

        for (const sp of s.sprites) {
            const info = SPRITE_INFO[sp.type];
            const v = sp.type === 'fan' ? sp.v * 2 + (Math.floor(Math.abs(clock) * 4 + sp.v) & 1) : sp.v;
            const sx = p1.x + sp.offset * p1.w;
            drawWorld(getSprite(sp.type, v, T.night, T.snow), sx, p1.y, info.w, p1.w, s.clip, alpha, sp.type !== 'fan');
            if (sp.type === 'lamp' && alpha > 0.3) {
                const lw = info.w * p1.w, lh = lw * 86 / 28;
                ctx.save(); ctx.globalCompositeOperation = 'lighter';
                glow(sx + (sp.v ? -1 : 1) * lw * 0.27, p1.y - lh * 0.86, lw * 0.9, 'rgba(255,200,240,0.55)');
                ctx.restore();
            }
        }
        const pk = pickBySeg.get(s.index);
        if (pk) {
            const pct = 0.5, cw = p1.w + (p2.w - p1.w) * pct;
            const px = p1.x + (p2.x - p1.x) * pct + pk.offset * cw, py = p1.y + (p2.y - p1.y) * pct;
            const bob = Math.sin(clock * 5) * cw * 0.03 - cw * 0.06;
            ctx.save(); ctx.globalCompositeOperation = 'lighter';
            glow(px, py + bob - cw * 0.08, cw * 0.16, 'rgba(0,229,255,0.5)');
            ctx.restore();
            drawWorld(getSprite('pickup', Math.floor(clock * 6) % 2), px, py + bob, 0.16, cw, s.clip, alpha, false);
        }
        const list = carsBySeg.get(s.index);
        if (list) for (const car of list) {
            const pct = (car.z % SEG_LEN) / SEG_LEN, cw = p1.w + (p2.w - p1.w) * pct;
            const cx = p1.x + (p2.x - p1.x) * pct + car.offset * cw, cy = p1.y + (p2.y - p1.y) * pct;
            const spec = CAR[car.type];
            drawWorld(getCarSprite(car.type, car.color), cx, cy, spec.w, cw, s.clip, alpha);
            if (T.night && alpha > 0.3 && cy <= s.clip + 1) {
                const w = spec.w * cw;
                ctx.save(); ctx.globalCompositeOperation = 'lighter';
                for (const sd of [-0.35, 0.35]) glow(cx + sd * w, cy - w * 0.22, w * 0.3, 'rgba(255,40,70,0.6)');
                ctx.restore();
            }
        }
    }

    // 4. Voiture du joueur
    if (isRunning && (turboT > 0 || speed > diff.maxSpeed * 0.97) && !paused) drawSpeedLines();
    const bounce = isRunning && speed > 100 && Math.abs(playerX) > 1.02 ? Math.round(Math.random() * pb.k) : (Math.floor(position / 600) % 2) * (speed > 2000 ? 1 : 0);
    const pc = getPlayerSprite(steerLean, braking);
    ctx.drawImage(pc, Math.round(pb.x - pc.width * pb.k / 2), pb.y - pc.height * pb.k - bounce, pc.width * pb.k, pc.height * pb.k);
    if (braking || T.night) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const a = braking ? 0.7 : 0.35;
        for (const sx of [-14, 14]) glow(pb.x + sx * pb.k * 1.3, pb.y - (36 - 17) * pb.k - bounce, 10 * pb.k, `rgba(255,30,50,${a})`);
        ctx.restore();
    }

    // particules (pixels carrés)
    for (const p of particles) { ctx.fillStyle = p.col; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); }

    ctx.restore();
    drawOverlays();
}

function drawSpeedLines() {
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = track.night ? '#9ffcff' : '#ffffff';
    for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2, r = rand(W * 0.25, W * 0.55), len = rand(8, 24);
        const cx = W / 2, cy = H * 0.5;
        for (let t = 0; t < len; t += 2) ctx.fillRect(Math.round(cx + Math.cos(a) * (r + t)), Math.round(cy + Math.sin(a) * (r + t) * 0.6), 1, 1);
    }
    ctx.restore();
}

function drawOverlays() {
    ctx.drawImage(vignette, 0, 0);
    if (flash > 0) { ctx.fillStyle = `rgba(255,0,80,${flash})`; ctx.fillRect(0, 0, W, H); }
    const fs = Math.max(8, Math.round(H / 22));
    if (arrival) {
        ctx.fillStyle = 'rgba(10,0,25,0.65)'; ctx.fillRect(0, Math.round(H * 0.24), W, Math.round(H * 0.3));
        drawText(ctx, 'TOUR ' + arrival.lap + ' TERMINÉ', W / 2, H * 0.31, fs, '#ffea00', W * 0.9);
        drawText(ctx, arrival.time.toFixed(2) + ' S', W / 2, H * 0.4, fs * 1.4, '#ffffff', W * 0.9);
        const msg = arrival.abs ? 'RECORD ABSOLU ! +' + arrival.bonus + 'S' : arrival.rec ? 'MEILLEUR TOUR ! +' + arrival.bonus + 'S' : 'TEMPS BONUS +' + arrival.bonus + 'S';
        drawText(ctx, msg, W / 2, H * 0.48, fs * 0.8, arrival.abs || arrival.rec ? '#00f3ff' : '#ffffff', W * 0.9);
    }
    popups.forEach((p, i) => {
        ctx.globalAlpha = Math.min(1, p.t * 2);
        drawText(ctx, p.text, W / 2, H * 0.22 - (1.4 - p.t) * 12 - i * fs * 1.3, fs, p.col, W * 0.94);
        ctx.globalAlpha = 1;
    });
    if (isRunning && countdown > 0) {
        drawText(ctx, String(Math.ceil(countdown)), W / 2, H * 0.42, fs * 4, '#00f3ff', W);
        drawText(ctx, 'ÉVITE LE TRAFIC, FRÔLE POUR LE TURBO', W / 2, H * 0.6, fs * 0.6, '#ffffff', W * 0.94);
        drawText(ctx, 'ATTRAPE LES HORLOGES = + DE TEMPS', W / 2, H * 0.67, fs * 0.6, '#9ffcff', W * 0.94);
    }
    if (paused) {
        ctx.fillStyle = 'rgba(5,0,15,0.6)'; ctx.fillRect(0, 0, W, H);
        drawText(ctx, 'PAUSE', W / 2, H * 0.45, fs * 2.4, '#ff2a9d', W);
        drawText(ctx, 'P / ÉCHAP / START POUR REPRENDRE', W / 2, H * 0.57, fs * 0.6, '#ffffff', W * 0.94);
    }
}

// ---------------------------- HUD (HTML) -----------------------------
function fmtLap(t) { return isFinite(t) ? t.toFixed(2) + 's' : '--'; }
function updateHud() {
    setText('hud-score', String(score).padStart(7, '0'));
    setText('hud-combo', combo > 1 ? 'COMBO x' + combo : '');
    setText('hud-time', String(Math.ceil(timeLeft)));
    $('hud-time').classList.toggle('danger', timeLeft <= 5);
    setText('hud-track', track.name);
    setText('hud-lap', 'TOUR ' + lap);
    setText('hud-best', 'MEILLEUR ' + fmtLap(bestLap));
    setText('hud-speed', String(Math.floor(speed / (30 * VITESSE_JEU))));
    const pz = playerZ();
    $('hud-progress').style.width = (lineSeen ? ((pz - LINE_Z + trackLength) % trackLength) / trackLength * 100 : 0) + '%';
    $('hud-turbo-fill').style.width = Math.round(turboGauge * 100) + '%';
    $('hud-turbo').classList.toggle('ready', turboGauge >= 1 && turboT <= 0);
    $('hud-turbo').classList.toggle('active', turboT > 0);
}

// ---------------------------- PARTIE ---------------------------------
const overlays = ['menu-overlay', 'difficulty-overlay', 'hud-overlay', 'gameover-overlay', 'leaderboard-overlay'];
function show(...ids) { overlays.forEach(o => $(o).classList.toggle('hidden', !ids.includes(o))); }

function startGame(key) {
    audio.init(); audio.music.start();
    selectTrack(key);
    position = 0; playerX = 0; playerVX = 0; speed = 0; score = 0; lap = 1;
    timeLeft = diff.time; isRunning = true; paused = false;
    countdown = 3; lastCount = 3; audio.beep(false);
    lineSeen = false; runTime = 0; lapStart = 0; bestLap = Infinity; arrival = null;
    shake = 0; flash = 0; sceneryCool = 0; popups = []; particles = [];
    combo = 0; comboT = 0; maxCombo = 0; nearMisses = 0;
    turboGauge = 0; turboT = 0; turboReadyShown = false;
    scoreSaved = false;
    if (document.activeElement) document.activeElement.blur();
    show('hud-overlay');
    updateHud();
    audio.music.drums = false; audio.music.setPaused(false);
    audio.startEngine();
}

let scoreSaved = false;
function endGame() {
    isRunning = false; paused = false;
    audio.stopEngine(); audio.music.drums = false;
    $('end-score').textContent = score.toLocaleString('fr-FR');
    $('end-best').textContent = fmtLap(bestLap);
    $('end-laps').textContent = String(lap - 1);
    $('end-near').textContent = String(nearMisses);
    $('end-combo').textContent = 'x' + Math.max(1, maxCombo);
    const rec = parseFloat(localStorage.getItem('nicotch_bestlap_' + trackKey) || 'NaN');
    $('end-record').textContent = isFinite(rec) ? rec.toFixed(2) + 's' : '--';
    const scores = getLeaderboard(trackKey);
    const isHigh = score > 0 && (scores.length < 5 || score > scores[scores.length - 1].score);
    $('highscore-input-container').classList.toggle('hidden', !isHigh);
    $('player-name').value = '';
    $('saved-msg').classList.add('hidden');
    $('gameover-title').textContent = isHigh ? 'NOUVEAU RECORD !' : 'TEMPS ÉCOULÉ !';
    show('gameover-overlay');
    // Envoie le score à la page nicotch.fr (tableau des scores en ligne)
    try { if (score > 0 && window.parent !== window) window.parent.postMessage({ source: 'nicotch-jeu', type: 'score', score: score, variante: trackKey }, '*'); } catch (e) {}
    if (isHigh) setTimeout(() => $('player-name').focus(), 50);
    else setTimeout(() => $('btn-restart').focus(), 50);
}

function togglePause() {
    if (!isRunning) return;
    paused = !paused;
    if (paused) { audio.stopEngine(); keys.clear(); } else audio.startEngine();
    audio.music.setPaused(paused);
}

// ---------------------------- CLASSEMENTS ----------------------------
function getLeaderboard(key) {
    try { return JSON.parse(localStorage.getItem('nicotch_scores_' + key)) || []; } catch (e) { return []; }
}
function saveScore(key, name, value) {
    const s = getLeaderboard(key);
    s.push({ name: (name || 'PILOTE').toUpperCase().slice(0, 10), score: value });
    s.sort((a, b) => b.score - a.score);
    try { localStorage.setItem('nicotch_scores_' + key, JSON.stringify(s.slice(0, 5))); } catch (e) {}
}
// Enregistre le score une seule fois (Entrée, Rejouer ou Menu)
function commitScore() {
    if (scoreSaved || $('highscore-input-container').classList.contains('hidden')) return;
    saveScore(trackKey, $('player-name').value.trim(), score);
    scoreSaved = true;
    $('highscore-input-container').classList.add('hidden');
    $('saved-msg').classList.remove('hidden');
}
let lbTab = 'normal';
function renderLeaderboard(key) {
    lbTab = key;
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.tab === key));
    const rows = getLeaderboard(key), tb = $('leaderboard-rows');
    tb.innerHTML = '';
    if (!rows.length) { tb.innerHTML = '<tr><td colspan="3" class="empty">Aucun score enregistré</td></tr>'; }
    const medals = ['🥇', '🥈', '🥉'];
    rows.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${medals[i] || i + 1}</td><td class="name"></td><td class="score">${r.score.toLocaleString('fr-FR')}</td>`;
        tr.querySelector('.name').textContent = r.name;
        tb.appendChild(tr);
    });
    const rec = parseFloat(localStorage.getItem('nicotch_bestlap_' + key) || 'NaN');
    $('lb-record').textContent = 'Record du tour : ' + (isFinite(rec) ? rec.toFixed(2) + ' s' : '--');
}

// ---------------------------- CLAVIER --------------------------------
const keys = new Set();
let turboRequest = false;   // un appui très court sur le turbo n'est jamais perdu
window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') {
        if (e.key === 'Enter') { e.preventDefault(); commitScore(); setTimeout(() => $('btn-restart').focus(), 0); }
        return;
    }
    if ((e.code === 'KeyP' || e.code === 'Escape') && isRunning) { if (!e.repeat) togglePause(); e.preventDefault(); return; }
    keys.add(e.code);
    if (['ShiftLeft', 'ShiftRight', 'KeyE'].includes(e.code)) turboRequest = true;
    if (isRunning && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => keys.delete(e.code));
window.addEventListener('blur', () => { keys.clear(); if (isRunning && !paused) togglePause(); });

// ---------------------------- MANETTE --------------------------------
const pad = { active: false, steer: 0, gas: 0, brake: 0, turbo: false, prev: [], navDir: 0 };
function pollGamepad() {
    const list = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (const g of list) if (g && g.connected) { gp = g; break; }
    if (!gp) { pad.active = false; return; }
    pad.active = true;
    const b = i => gp.buttons[i] ? (gp.buttons[i].value || (gp.buttons[i].pressed ? 1 : 0)) : 0;
    const down = i => b(i) > 0.5 && !pad.prev[i];
    let ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
    if (Math.abs(ax) < 0.18) ax = 0;
    pad.steer = ax || (b(15) - b(14));
    pad.gas = Math.max(b(7), b(0));
    pad.brake = Math.max(b(6), b(1));
    pad.turbo = b(2) > 0.5 || b(3) > 0.5 || b(5) > 0.5;

    if (splashOn) { if (gp.buttons.some((x, i) => x.pressed && !pad.prev[i])) closeSplash(); pad.prev = gp.buttons.map(x => x.pressed || x.value > 0.5); return; }
    if (down(9)) { if (isRunning) togglePause(); }
    // navigation dans les menus
    if (!isRunning || paused) {
        let dir = 0;
        if (down(12) || down(14)) dir = -1;
        if (down(13) || down(15)) dir = 1;
        const stick = Math.abs(ay) > 0.6 ? Math.sign(ay) : Math.abs(ax) > 0.6 ? Math.sign(ax) : 0;
        if (stick !== pad.navDir) { if (stick) dir = stick; pad.navDir = stick; }
        if (dir) moveFocus(dir);
        if (down(0) && document.activeElement && document.activeElement.tagName === 'BUTTON') document.activeElement.click();
        if (down(1)) { const back = activeOverlay()?.querySelector('[data-back]'); if (back) back.click(); }
    }
    pad.prev = gp.buttons.map(x => x.pressed || x.value > 0.5);
}
function activeOverlay() {
    if (splashOn) return null;
    for (const id of ['gameover-overlay', 'leaderboard-overlay', 'difficulty-overlay', 'menu-overlay']) if (!$(id).classList.contains('hidden')) return $(id);
    return null;
}
function moveFocus(dir) {
    const ov = activeOverlay(); if (!ov) return;
    const els = [...ov.querySelectorAll('button')].filter(e => e.offsetParent !== null);
    if (!els.length) return;
    const i = els.indexOf(document.activeElement);
    els[(i + dir + els.length) % els.length].focus();
}
window.addEventListener('gamepadconnected', () => popup('MANETTE CONNECTÉE', '#00f3ff'));

// ---------------------------- BOUTONS --------------------------------
$('btn-play').addEventListener('click', () => { show('difficulty-overlay'); $('difficulty-overlay').querySelector('button').focus(); });
$('btn-back-diff').addEventListener('click', () => { show('menu-overlay'); $('btn-play').focus(); });
document.querySelectorAll('.btn-difficulty').forEach(b => b.addEventListener('click', () => startGame(b.dataset.diff)));
$('btn-restart').addEventListener('click', () => { commitScore(); startGame(trackKey); });
$('btn-end-menu').addEventListener('click', () => { commitScore(); show('menu-overlay'); $('btn-play').focus(); });
$('btn-leaderboard').addEventListener('click', () => { show('menu-overlay', 'leaderboard-overlay'); renderLeaderboard(trackKey); $('btn-close-lb').focus(); });
$('btn-close-lb').addEventListener('click', () => { show('menu-overlay'); $('btn-leaderboard').focus(); });
document.querySelectorAll('.tab-btn').forEach(t => t.addEventListener('click', () => renderLeaderboard(t.dataset.tab)));

// Remise à zéro en deux clics, pour éviter les accidents
let resetArmed = null;
$('btn-reset-scores').addEventListener('click', e => {
    const btn = e.currentTarget;
    if (!resetArmed) {
        btn.textContent = 'Sûr ? Clique encore';
        btn.classList.add('armed');
        resetArmed = setTimeout(() => { resetArmed = null; btn.textContent = 'Effacer les scores'; btn.classList.remove('armed'); }, 3000);
        return;
    }
    clearTimeout(resetArmed); resetArmed = null;
    Object.keys(DIFFS).forEach(k => { localStorage.removeItem('nicotch_scores_' + k); localStorage.removeItem('nicotch_bestlap_' + k); });
    btn.textContent = 'Effacer les scores'; btn.classList.remove('armed');
    renderLeaderboard(lbTab);
});

$('btn-sfx').addEventListener('click', e => { audio.setSfx(!audio.sfxOn); e.currentTarget.textContent = '🔊 SON : ' + (audio.sfxOn ? 'ON' : 'OFF'); });
$('btn-music').addEventListener('click', e => { audio.setMusic(!audio.musicOn); e.currentTarget.textContent = '🎵 MUSIQUE : ' + (audio.musicOn ? 'ON' : 'OFF'); });

// Commandes tactiles
function bindHold(id, code) {
    const el = $(id);
    const set = v => { v ? keys.add(code) : keys.delete(code); el.classList.toggle('pressed', v); };
    el.addEventListener('pointerdown', e => { e.preventDefault(); el.setPointerCapture(e.pointerId); set(true); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.addEventListener(t, () => set(false)));
}
bindHold('tc-left', 'TouchLeft'); bindHold('tc-right', 'TouchRight');
bindHold('tc-gas', 'TouchGas'); bindHold('tc-brake', 'TouchBrake'); bindHold('tc-turbo', 'TouchTurbo');
$('tc-turbo').addEventListener('pointerdown', () => turboRequest = true);
$('tc-pause').addEventListener('click', togglePause);
document.addEventListener('contextmenu', e => e.preventDefault());

// Plein écran
$('btn-fs').addEventListener('click', async () => {
    const d = document, el = d.documentElement;
    try {
        if (d.fullscreenElement) await d.exitFullscreen();
        else { await el.requestFullscreen(); try { await screen.orientation.lock('landscape'); } catch (e) {} }
    } catch (e) {
        const t = $('fs-toast');
        t.textContent = 'Plein écran bloqué ici. Ouvre le jeu directement dans ton navigateur.';
        t.classList.remove('hidden'); setTimeout(() => t.classList.add('hidden'), 4000);
    }
});

// La musique démarre au premier clic ou à la première touche
const kick = () => { audio.init(); audio.music.start(); };

// Écran d'accueil : la première touche / le premier clic lance la musique et ouvre le menu
let splashOn = true;
function closeSplash() {
    if (!splashOn) return;
    splashOn = false;
    kick();
    audio.tone(660, 'square', 0.12, 0.1); audio.tone(990, 'square', 0.2, 0.1, 0.1);
    const sp = $('splash-overlay');
    sp.classList.add('leaving');
    setTimeout(() => sp.classList.add('hidden'), 650);
    $('btn-play').focus();
}
$('splash-overlay').addEventListener('pointerdown', e => { e.stopPropagation(); closeSplash(); });
window.addEventListener('keydown', e => {
    if (!splashOn) return;
    e.preventDefault(); e.stopImmediatePropagation(); closeSplash();
}, true);
document.addEventListener('pointerdown', kick, { once: true });
document.addEventListener('keydown', kick, { once: true });
document.addEventListener('visibilitychange', () => { if (document.hidden && isRunning && !paused) togglePause(); });

// ---------------------------- BOUCLE PRINCIPALE ----------------------
let lastTime = performance.now();
function frame(now) {
    const dt = clamp((now - lastTime) / 1000, 0, 0.05);   // jamais négatif (1re image)
    lastTime = now;
    pollGamepad();
    update(dt);
    render();
    requestAnimationFrame(frame);
}

window.addEventListener('resize', resizeCanvas);
// affiche sur les cartes de circuit le vrai temps de course (il dépend de VITESSE_JEU)
document.querySelectorAll('.btn-difficulty').forEach(b => { b.querySelector('.t').textContent = Math.round(DIFFS[b.dataset.diff].time / VITESSE_JEU); });
selectTrack('normal');
resizeCanvas();
requestAnimationFrame(frame);
