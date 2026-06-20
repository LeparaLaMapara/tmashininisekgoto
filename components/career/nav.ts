// Command channel from the DOM HUD (progress timeline) into the r3f loop.
// The wrapper sets a target stop; the Player auto-walks there and clears it.

export const nav: { target: number | null } = { target: null }

export function travelTo(index: number | null) {
  nav.target = index
}
