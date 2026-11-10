// =====================================================================
//  NICOTCH RUN 82 - AUDIO
//  Tout le son est fabriqué en direct par le code (Web Audio API) :
//  pas de fichier MP3, donc aucun problème de droits d'auteur.
// =====================================================================
'use strict';

const midiToFreq = m => 440 * Math.pow(2, (m - 69) / 12);

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.sfxOn = true;
        this.musicOn = true;
        this.engine = null;
        this.music = new SynthwaveMusic(this);
    }

    // Le navigateur exige un clic ou une touche avant de jouer du son
    init() {
        if (!this.ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = this.ctx = new AC();
            this.master = ctx.createGain(); this.master.gain.value = 0.9;
            this.master.connect(ctx.destination);

            // Petit compresseur pour éviter que ça sature
            const comp = ctx.createDynamicsCompressor();
            comp.threshold.value = -14; comp.ratio.value = 4;
            comp.connect(this.master);

            this.sfxBus = ctx.createGain(); this.sfxBus.gain.value = this.sfxOn ? 1 : 0; this.sfxBus.connect(comp);
            this.musicBus = ctx.createGain(); this.musicBus.gain.value = this.musicOn ? 0.55 : 0; this.musicBus.connect(comp);

            // Bruit blanc réutilisable (crash, charleston, souffle)
            const len = ctx.sampleRate * 2;
            this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
            const d = this.noise.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

            // Réverbération (salle) fabriquée avec du bruit qui s'éteint
            this.reverb = ctx.createConvolver();
            const rl = ctx.sampleRate * 2.4, ir = ctx.createBuffer(2, rl, ctx.sampleRate);
            for (let c = 0; c < 2; c++) {
                const ch = ir.getChannelData(c);
                for (let i = 0; i < rl; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rl, 3);
            }
            this.reverb.buffer = ir;
            const rvGain = ctx.createGain(); rvGain.gain.value = 0.35;
            this.reverb.connect(rvGain); rvGain.connect(this.musicBus);

            // Écho (delay) typique synthwave
            this.delay = ctx.createDelay(1);
            this.delay.delayTime.value = (60 / this.music.bpm) * 0.75;
            const fb = ctx.createGain(); fb.gain.value = 0.35;
            const dlOut = ctx.createGain(); dlOut.gain.value = 0.4;
            this.delay.connect(fb); fb.connect(this.delay);
            this.delay.connect(dlOut); dlOut.connect(this.musicBus);
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    get now() { return this.ctx ? this.ctx.currentTime : 0; }

    setSfx(on) {
        this.sfxOn = on;
        if (this.ctx) this.sfxBus.gain.setTargetAtTime(on ? 1 : 0, this.now, 0.05);
    }
    setMusic(on) {
        this.musicOn = on;
        if (this.ctx) this.musicBus.gain.setTargetAtTime(on ? 0.55 : 0, this.now, 0.1);
    }

    // ---------- Effets sonores ----------
    tone(freq, type = 'square', dur = 0.12, vol = 0.12, when = 0, slideTo = 0) {
        if (!this.ctx) return;
        const t = this.now + when;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(freq, t);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g); g.connect(this.sfxBus);
        o.start(t); o.stop(t + dur + 0.02);
    }

    noiseBurst(dur, vol, filterType, f1, f2, when = 0) {
        if (!this.ctx) return;
        const t = this.now + when;
        const s = this.ctx.createBufferSource(); s.buffer = this.noise;
        const f = this.ctx.createBiquadFilter(); f.type = filterType; f.Q.value = 1.2;
        f.frequency.setValueAtTime(f1, t); f.frequency.exponentialRampToValueAtTime(f2, t + dur);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        s.connect(f); f.connect(g); g.connect(this.sfxBus);
        s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    }

    crash(big = true) {
        this.noiseBurst(big ? 0.45 : 0.18, big ? 0.5 : 0.25, 'lowpass', 3000, 200);
        if (big) this.tone(90, 'sine', 0.35, 0.5, 0, 30);
    }
    scrape() { this.noiseBurst(0.15, 0.2, 'bandpass', 2500, 1200); }
    whoosh() { this.noiseBurst(0.35, 0.25, 'bandpass', 600, 3500); }
    beep(high) { this.tone(high ? 1320 : 660, 'square', high ? 0.45 : 0.18, 0.12); }
    pickup() { [0, 4, 7, 12].forEach((n, i) => this.tone(midiToFreq(76 + n), 'square', 0.1, 0.09, i * 0.05)); }
    lap() { [0, 4, 7, 12, 16].forEach((n, i) => this.tone(midiToFreq(72 + n), 'square', 0.14, 0.1, i * 0.07)); }
    turbo() {
        this.noiseBurst(0.8, 0.35, 'bandpass', 300, 4000);
        this.tone(110, 'sawtooth', 0.6, 0.12, 0, 440);
    }

    // ---------- Moteur (son continu qui suit la vitesse) ----------
    startEngine() {
        if (!this.ctx || this.engine) return;
        const c = this.ctx;
        const o1 = c.createOscillator(), o2 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
        o1.type = 'sawtooth'; o2.type = 'square';
        f.type = 'lowpass'; f.frequency.value = 500; f.Q.value = 3;
        g.gain.value = 0.0;
        o1.connect(f); o2.connect(f); f.connect(g); g.connect(this.sfxBus);
        o1.start(); o2.start();
        this.engine = { o1, o2, f, g };
    }
    // ratio = vitesse / vitesse max (0..1+), boite à 5 vitesses simulée
    updateEngine(ratio, turbo) {
        const e = this.engine; if (!e) return;
        const gears = 5, x = Math.min(0.999, ratio) * gears, gear = Math.floor(x), t = x - gear;
        const rpm = ratio < 0.02 ? 0.15 : 0.3 + 0.7 * t;
        const f = (40 + rpm * 95 + gear * 10) * (turbo ? 1.15 : 1);
        const now = this.now;
        e.o1.frequency.setTargetAtTime(f, now, 0.03);
        e.o2.frequency.setTargetAtTime(f * 0.5, now, 0.03);
        e.f.frequency.setTargetAtTime(350 + rpm * 1400 + (turbo ? 800 : 0), now, 0.05);
        e.g.gain.setTargetAtTime(0.05 + rpm * 0.03, now, 0.05);
    }
    stopEngine() {
        const e = this.engine; if (!e) return;
        e.g.gain.setTargetAtTime(0, this.now, 0.05);
        e.o1.stop(this.now + 0.3); e.o2.stop(this.now + 0.3);
        this.engine = null;
    }
}

// =====================================================================
//  Musique synthwave générée : basse, nappes, arpège, mélodie, batterie
//  Grille d'accords : La mineur - Fa - Do - Sol (très "années 80")
// =====================================================================
class SynthwaveMusic {
    constructor(audio) {
        this.audio = audio;
        this.bpm = 108;
        this.playing = false;
        this.drums = false;   // la batterie arrive pendant la course
        this.paused = false;
        this.step = 0;
        this.nextTime = 0;
        this.timer = null;
        this.chords = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]];
        this.bass = [45, 41, 48, 43];
        // [pas (1/16), note midi, durée en pas] pour chacun des 4 accords
        this.melody = [
            [[0, 76, 4], [4, 74, 2], [6, 72, 2], [8, 69, 6]],
            [[0, 72, 4], [4, 69, 2], [6, 72, 2], [8, 74, 4], [12, 76, 4]],
            [[0, 79, 6], [6, 76, 2], [8, 74, 4], [12, 72, 4]],
            [[0, 71, 4], [4, 74, 4], [8, 76, 8]]
        ];
    }

    start() {
        const a = this.audio;
        if (!a.ctx || this.playing) return;
        this.playing = true;
        this.step = 0;
        this.nextTime = a.now + 0.1;
        this.timer = setInterval(() => this.schedule(), 25);
    }
    setPaused(p) {
        this.paused = p;
        if (!p && this.audio.ctx) this.nextTime = this.audio.now + 0.05;
    }

    schedule() {
        const a = this.audio;
        if (!a.ctx || this.paused || a.ctx.state !== 'running') return;
        const stepDur = 60 / this.bpm / 4;
        if (this.nextTime < a.now - 0.2) this.nextTime = a.now + 0.05; // rattrape un gros retard
        while (this.nextTime < a.now + 0.15) {
            this.playStep(this.step, this.nextTime, stepDur);
            this.nextTime += stepDur;
            this.step = (this.step + 1) % (16 * 16); // 16 mesures
        }
    }

    voice(type, freq, t, dur, vol, dest, attack = 0.005, detune = 0, cutoff = 0) {
        const c = this.audio.ctx;
        const o = c.createOscillator(), g = c.createGain();
        o.type = type; o.frequency.value = freq; o.detune.value = detune;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vol, t + attack);
        g.gain.setTargetAtTime(0.0001, t + Math.max(attack, dur * 0.6), dur * 0.35);
        let last = o;
        if (cutoff) {
            const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cutoff;
            o.connect(f); last = f;
        }
        last.connect(g); dest.forEach(d => g.connect(d));
        o.start(t); o.stop(t + dur * 2 + 0.3);
    }

    drum(kind, t) {
        const a = this.audio, c = a.ctx;
        if (kind === 'kick') {
            const o = c.createOscillator(), g = c.createGain();
            o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
            g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            o.connect(g); g.connect(a.musicBus); o.start(t); o.stop(t + 0.35);
        } else {
            const s = c.createBufferSource(); s.buffer = a.noise;
            const f = c.createBiquadFilter(), g = c.createGain();
            const snare = kind === 'snare';
            f.type = snare ? 'bandpass' : 'highpass';
            f.frequency.value = snare ? 1800 : 7000;
            const dur = snare ? 0.22 : (kind === 'ohat' ? 0.12 : 0.04);
            g.gain.setValueAtTime(snare ? 0.6 : 0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            s.connect(f); f.connect(g); g.connect(a.musicBus);
            if (snare) g.connect(a.reverb);
            s.start(t, Math.random()); s.stop(t + dur + 0.05);
        }
    }

    playStep(step, t, sd) {
        const a = this.audio, bar = Math.floor(step / 16), s = step % 16, ci = bar % 4;
        const chord = this.chords[ci];

        // Nappe (pad) au début de chaque mesure
        if (s === 0) chord.forEach(n => {
            this.voice('sawtooth', midiToFreq(n), t, sd * 16, 0.035, [a.musicBus, a.reverb], 0.35, -8, 1400);
            this.voice('sawtooth', midiToFreq(n), t, sd * 16, 0.035, [a.musicBus, a.reverb], 0.35, 8, 1400);
        });

        // Basse en croches, avec saut d'octave
        if (s % 2 === 0) {
            const n = this.bass[ci] - 12 + (s % 8 === 6 ? 12 : 0);
            this.voice('sawtooth', midiToFreq(n), t, sd * 1.6, 0.16, [a.musicBus], 0.005, 0, 600);
        }

        // Arpège en doubles croches avec écho
        const arp = [0, 1, 2, 1, 2, 0, 1, 2];
        const n = chord[arp[s % 8]] + 12 + (s >= 8 ? 12 : 0);
        this.voice('square', midiToFreq(n), t, sd * 0.8, 0.03, [a.musicBus, a.delay], 0.003, 0, 2600);

        // Mélodie une fois sur deux (mesures 8 à 15)
        if (bar >= 8) {
            for (const [ms, mn, ml] of this.melody[ci]) {
                if (ms === s) {
                    this.voice('square', midiToFreq(mn), t, sd * ml, 0.05, [a.musicBus, a.delay, a.reverb], 0.01, 6, 3000);
                    this.voice('triangle', midiToFreq(mn - 12), t, sd * ml, 0.06, [a.musicBus], 0.01);
                }
            }
        }

        // Batterie pendant la course
        if (this.drums) {
            if (s % 4 === 0) this.drum('kick', t);
            if (s === 4 || s === 12) this.drum('snare', t);
            if (s % 4 === 2) this.drum('ohat', t);
            else if (s % 2 === 1) this.drum('hat', t);
        }
    }
}

const audio = new AudioEngine();
