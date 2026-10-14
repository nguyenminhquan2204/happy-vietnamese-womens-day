/**
 * Nhạc nền "hộp nhạc" tổng hợp hoàn toàn bằng Web Audio API — không cần file âm thanh.
 * Bản nhạc 16 ô nhịp giọng Đô trưởng, lặp lại liên tục: giai điệu chuông, rải hợp âm, pad nền và reverb.
 */

const TEMPO_BPM = 72;
const EIGHTH = 60 / TEMPO_BPM / 2;
const STEPS_PER_BAR = 8;
const MASTER_VOLUME = 0.6;
const LOOKAHEAD_S = 0.2;
const SCHEDULER_MS = 25;

/** Hợp âm: nốt gốc (MIDI) và các quãng tính từ gốc. */
interface Chord {
  root: number;
  intervals: [number, number, number];
}

const MAJ: [number, number, number] = [4, 7, 11];
const MIN: [number, number, number] = [3, 7, 10];
const DOM: [number, number, number] = [4, 7, 9];

const C = 48;
const D = 50;
const E = 52;
const F = 53;
const G = 55;
const A = 57;

const PROGRESSION: Chord[] = [
  { root: C, intervals: MAJ },
  { root: A, intervals: MIN },
  { root: F, intervals: MAJ },
  { root: G, intervals: DOM },
  { root: C, intervals: MAJ },
  { root: E, intervals: MIN },
  { root: F, intervals: MAJ },
  { root: G, intervals: DOM },
  { root: A, intervals: MIN },
  { root: E, intervals: MIN },
  { root: F, intervals: MAJ },
  { root: C, intervals: MAJ },
  { root: D, intervals: MIN },
  { root: G, intervals: DOM },
  { root: C, intervals: MAJ },
  { root: C, intervals: MAJ },
];

/** Giai điệu theo từng ô nhịp: [vị trí móc đơn, nốt MIDI, độ dài tính bằng móc đơn]. */
const MELODY: [number, number, number][][] = [
  [[0, 76, 3], [3, 74, 1], [4, 72, 2], [6, 79, 2]],
  [[0, 76, 4], [4, 72, 2], [6, 69, 2]],
  [[0, 81, 3], [3, 79, 1], [4, 77, 2], [6, 76, 2]],
  [[0, 74, 4], [4, 71, 2], [6, 74, 2]],
  [[0, 76, 3], [3, 79, 1], [4, 84, 3], [7, 83, 1]],
  [[0, 83, 3], [3, 79, 1], [4, 76, 4]],
  [[0, 77, 2], [2, 81, 2], [4, 84, 2], [6, 81, 2]],
  [[0, 79, 6], [6, 74, 2]],
  [[0, 84, 3], [3, 83, 1], [4, 81, 4]],
  [[0, 79, 4], [4, 76, 4]],
  [[0, 81, 2], [2, 79, 2], [4, 77, 2], [6, 81, 2]],
  [[0, 79, 4], [4, 76, 2], [6, 72, 2]],
  [[0, 77, 3], [3, 76, 1], [4, 74, 2], [6, 77, 2]],
  [[0, 76, 2], [2, 74, 2], [4, 71, 2], [6, 74, 2]],
  [[0, 72, 8]],
  [],
];

/** Thứ tự rải hợp âm trong một ô nhịp: chỉ số trong [gốc, 3, 5, 7, gốc+8, 3+8, 5+8]. */
const ARPEGGIO = [0, 2, 4, 5, 6, 5, 4, 2];
const TOTAL_STEPS = PROGRESSION.length * STEPS_PER_BAR;

const midiToHz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function createImpulse(context: AudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(context.sampleRate * seconds);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
  }
  return impulse;
}

export class MusicBox {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private timer: number | null = null;
  private suspendTimer: number | null = null;
  private nextStepTime = 0;
  private step = 0;
  private playing = false;

  get isPlaying(): boolean {
    return this.playing;
  }

  /** Âm thanh thực sự đang chạy — trình duyệt chặn tự phát thì context vẫn ở trạng thái "suspended". */
  get isAudible(): boolean {
    return this.playing && this.context?.state === "running";
  }

  /** Phải được gọi trong một thao tác của người dùng (click) để trình duyệt cho phép phát âm thanh. */
  async play(): Promise<void> {
    const context = this.ensureGraph();
    if (this.suspendTimer !== null) { 
      window.clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }
    this.playing = true;
    await context.resume();

    const now = context.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(MASTER_VOLUME, now + 1.6);

    if (this.timer === null) {
      this.nextStepTime = now + 0.08;
      this.timer = window.setInterval(() => this.schedule(), SCHEDULER_MS);
    }
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  pause(): void {
    if (!this.context || !this.master) return;
    this.playing = false;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.8);

    this.suspendTimer = window.setTimeout(() => {
      if (this.timer !== null) window.clearInterval(this.timer);
      this.timer = null;
      this.suspendTimer = null;
      void this.context?.suspend();
    }, 900);
    document.removeEventListener("visibilitychange", this.handleVisibility);
  }

  dispose(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    void this.context?.close();
    this.context = null;
    this.playing = false;
  }

  /** Tạm ngưng khi người dùng chuyển tab, phát tiếp khi quay lại. */
  private handleVisibility = () => {
    if (!this.context || !this.playing) return;
    if (document.hidden) void this.context.suspend();
    else void this.context.resume();
  };

  private ensureGraph(): AudioContext {
    if (this.context) return this.context;

    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0;

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 3;

    const bus = context.createGain();
    const reverb = context.createConvolver();
    reverb.buffer = createImpulse(context, 2.8);
    const wet = context.createGain();
    wet.gain.value = 0.38;

    bus.connect(master);
    bus.connect(reverb).connect(wet).connect(master);
    master.connect(compressor).connect(context.destination);

    this.context = context;
    this.master = master;
    this.bus = bus;
    return context;
  }

  private schedule(): void {
    const context = this.context;
    if (!context) return;
    while (this.nextStepTime < context.currentTime + LOOKAHEAD_S) {
      this.scheduleStep(this.step, this.nextStepTime);
      this.nextStepTime += EIGHTH;
      this.step = (this.step + 1) % TOTAL_STEPS;
    }
  }

  private scheduleStep(step: number, time: number): void {
    const bar = Math.floor(step / STEPS_PER_BAR);
    const slot = step % STEPS_PER_BAR;
    const chord = PROGRESSION[bar];
    const tones = [0, ...chord.intervals, 12, chord.intervals[0] + 12, chord.intervals[1] + 12].map(
      (interval) => chord.root + 12 + interval,
    );
    const isLastBar = bar === PROGRESSION.length - 1;

    if (slot === 0) {
      this.pad(chord, time, EIGHTH * STEPS_PER_BAR);
      this.bell(chord.root, time, 0.09, 2.6, 0);
    }

    this.bell(tones[ARPEGGIO[slot]], time, isLastBar ? 0.035 : 0.055, 1.2, 0.15);

    for (const [at, note, length] of MELODY[bar]) {
      if (at === slot) this.bell(note, time, 0.13, 0.9 + length * EIGHTH, 0.35);
    }
  }

  /** Tiếng chuông hộp nhạc: sóng sine + hoạ âm bậc 2 tắt nhanh, có độ vang dài. */
  private bell(midi: number, time: number, volume: number, decay: number, shimmer: number): void {
    const context = this.context!;
    const frequency = midiToHz(midi);
    const voice = context.createGain();
    voice.gain.setValueAtTime(0.0001, time);
    voice.gain.exponentialRampToValueAtTime(volume, time + 0.008);
    voice.gain.exponentialRampToValueAtTime(0.0001, time + decay);
    voice.connect(this.bus!);

    const fundamental = context.createOscillator();
    fundamental.type = "sine";
    fundamental.frequency.value = frequency;
    fundamental.connect(voice);
    fundamental.start(time);
    fundamental.stop(time + decay + 0.05);

    if (shimmer > 0) {
      const overtone = context.createOscillator();
      const overtoneGain = context.createGain();
      overtone.type = "sine";
      overtone.frequency.value = frequency * 2.01;
      overtoneGain.gain.setValueAtTime(volume * shimmer, time);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, time + decay * 0.4);
      overtone.connect(overtoneGain).connect(this.bus!);
      overtone.start(time);
      overtone.stop(time + decay * 0.4 + 0.05);
    }
  }

  /** Lớp pad mềm giữ nền hoà âm suốt ô nhịp. */
  private pad(chord: Chord, time: number, length: number): void {
    const context = this.context!;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;

    const voice = context.createGain();
    voice.gain.setValueAtTime(0.0001, time);
    voice.gain.linearRampToValueAtTime(0.022, time + 0.7);
    voice.gain.setValueAtTime(0.022, time + length - 0.3);
    voice.gain.linearRampToValueAtTime(0.0001, time + length + 0.9);
    filter.connect(voice).connect(this.bus!);

    for (const interval of [0, chord.intervals[0], chord.intervals[1]]) {
      const oscillator = context.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.value = midiToHz(chord.root + 12 + interval);
      oscillator.detune.value = interval === 0 ? -4 : 4;
      oscillator.connect(filter);
      oscillator.start(time);
      oscillator.stop(time + length + 1);
    }
  }
}
