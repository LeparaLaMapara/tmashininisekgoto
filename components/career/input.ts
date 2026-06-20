// Shared, per-frame input state for the career journey.
// Both the keyboard listener and the on-screen joystick write here;
// the r3f render loop reads it every frame (no React re-renders on input).

export interface InputState {
  /** -1 (back) .. 1 (forward) */
  forward: number
  /** -1 (right) .. 1 (left) — rotates the character */
  turn: number
}

export const input: InputState = { forward: 0, turn: 0 }

const keys: Record<string, boolean> = {}

function recomputeFromKeys() {
  let f = 0
  let t = 0
  if (keys['ArrowUp'] || keys['KeyW']) f += 1
  if (keys['ArrowDown'] || keys['KeyS']) f -= 1
  if (keys['ArrowLeft'] || keys['KeyA']) t += 1
  if (keys['ArrowRight'] || keys['KeyD']) t -= 1
  input.forward = f
  input.turn = t
}

/** Attach global keyboard listeners. Returns a cleanup function. */
export function attachKeyboard(): () => void {
  const down = (e: KeyboardEvent) => {
    if (e.code in keys || /^(Arrow|Key[WASD])/.test(e.code)) {
      keys[e.code] = true
      recomputeFromKeys()
    }
  }
  const up = (e: KeyboardEvent) => {
    keys[e.code] = false
    recomputeFromKeys()
  }
  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
  }
}

/** Called by the touch joystick. Values are clamped to [-1, 1]. */
export function setJoystick(forward: number, turn: number) {
  input.forward = Math.max(-1, Math.min(1, forward))
  input.turn = Math.max(-1, Math.min(1, turn))
}

export function resetInput() {
  input.forward = 0
  input.turn = 0
}
