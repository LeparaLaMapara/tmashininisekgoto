// Procedural audio for the career journey — fully synthesized with the Web
// Audio API, so there are no audio files to ship or load. A singleton because
// the DOM (mute button) and the r3f render loop (footsteps/arrival) both drive it.

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }

class JourneyAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private started = false
  private muted = false
  private readonly volume = 0.6

  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx
    if (typeof window === 'undefined') return null
    const AC = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (!AC) return null
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.muted ? 0 : this.volume
    this.master.connect(this.ctx.destination)
    return this.ctx
  }

  /** Call from a user gesture (e.g. the Start button). Starts the ambient bed. */
  start() {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    if (ctx.state === 'suspended') void ctx.resume()
    if (this.started) return
    this.started = true

    const bed = ctx.createGain()
    bed.gain.value = 0
    bed.connect(this.master)

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 440
    lp.connect(bed)

    const o1 = ctx.createOscillator()
    o1.type = 'sine'
    o1.frequency.value = 55
    const o2 = ctx.createOscillator()
    o2.type = 'sine'
    o2.frequency.value = 82.5
    o2.detune.value = 5
    o1.connect(lp)
    o2.connect(lp)
    o1.start()
    o2.start()

    // slow swell on the bed
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.035
    lfo.connect(lfoGain)
    lfoGain.connect(bed.gain)
    lfo.start()

    bed.gain.setTargetAtTime(0.12, ctx.currentTime, 2)
  }

  private noiseBurst(dur: number): AudioBufferSourceNode | null {
    const ctx = this.ctx
    if (!ctx) return null
    const buffer = ctx.createBuffer(1, Math.max(1, Math.ceil(ctx.sampleRate * dur)), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    return src
  }

  /** A soft footstep — short band-passed noise click. */
  footstep() {
    const ctx = this.ctx
    if (!ctx || !this.master || this.muted || !this.started) return
    const t = ctx.currentTime
    const noise = this.noiseBurst(0.13)
    if (!noise) return
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 170
    bp.Q.value = 1.1
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.1, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    noise.connect(bp)
    bp.connect(g)
    g.connect(this.master)
    noise.start(t)
    noise.stop(t + 0.14)
  }

  /** A two-note chime when reaching a milestone. */
  arrival() {
    const ctx = this.ctx
    if (!ctx || !this.master || this.muted || !this.started) return
    const t = ctx.currentTime
    const notes = [523.25, 783.99] // C5, G5
    notes.forEach((f, i) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const g = ctx.createGain()
      const st = t + i * 0.08
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.16, st + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.7)
      o.connect(g)
      g.connect(this.master!)
      o.start(st)
      o.stop(st + 0.75)
    })
  }

  setMuted(m: boolean) {
    this.muted = m
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(m ? 0 : this.volume, this.ctx.currentTime, 0.1)
    }
  }

  isMuted() {
    return this.muted
  }
}

export const journeyAudio = new JourneyAudio()
