/**
 * Windows XP Web Audio Synthesizer
 * Generates authentic retro XP sounds using Web Audio API oscillators and filters
 * 100% self-contained without external audio files!
 */

class XpAudio {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  // Classic Windows XP Startup Sound (Iconic 4-chord ethereal synth)
  playStartup() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Chords / notes approximating the iconic Windows XP startup chime
    // Eb major chime progression with soft attack, resonant filter, and ambient release
    const notes = [
      { freq: 155.56, time: 0.0, dur: 2.5, gain: 0.25 },  // Eb3
      { freq: 233.08, time: 0.1, dur: 2.4, gain: 0.2 },   // Bb3
      { freq: 311.13, time: 0.35, dur: 2.2, gain: 0.22 }, // Eb4
      { freq: 392.00, time: 0.6, dur: 2.2, gain: 0.25 },  // G4
      { freq: 466.16, time: 0.85, dur: 2.5, gain: 0.28 }, // Bb4
      { freq: 622.25, time: 1.15, dur: 3.2, gain: 0.32 }, // Eb5
      { freq: 932.33, time: 1.45, dur: 2.8, gain: 0.2 }   // Bb5
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now + n.time);
      filter.frequency.exponentialRampToValueAtTime(3200, now + n.time + 0.3);

      gain.gain.setValueAtTime(0.0001, now + n.time);
      gain.gain.linearRampToValueAtTime(n.gain, now + n.time + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });
  }

  // Classic XP Click (Navigation / Folder open)
  playClick() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Windows XP "Ding" Notification
  playDing() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Windows XP Balloon Notification pop
  playBalloon() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const notes = [
      { freq: 440, time: 0 },
      { freq: 659.25, time: 0.08 },
      { freq: 880, time: 0.16 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(0.12, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.time);
      osc.stop(now + n.time + 0.15);
    });
  }

  // Windows XP Error / Exclamation "Chord"
  playError() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const freqs = [220, 261.63, 311.13, 370]; // diminished tension chord
    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  // Windows XP Shutdown sound
  playShutdown() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const notes = [
      { freq: 587.33, time: 0.0, dur: 0.3 },  // D5
      { freq: 440.00, time: 0.25, dur: 0.4 }, // A4
      { freq: 392.00, time: 0.55, dur: 0.5 }, // G4
      { freq: 293.66, time: 0.90, dur: 0.9 }  // D4
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(0.001, now + n.time);
      gain.gain.linearRampToValueAtTime(0.2, now + n.time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });
  }
}

window.xpAudio = new XpAudio();
