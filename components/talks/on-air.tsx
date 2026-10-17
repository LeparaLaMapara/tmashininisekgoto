/**
 * Studio dressing for the series card: an ON AIR lamp and a voice level meter.
 * CSS only, no client code. The bars have fixed heights at rest and only bounce
 * when motion is allowed; both are hidden from screen readers.
 */
const BARS = [5, 9, 14, 8, 18, 12, 22, 15, 9, 19, 26, 17, 11, 21, 14, 7, 16, 24, 13, 8, 18, 10, 6, 12]

export function OnAirLamp() {
  return (
    <span className="on-air" aria-hidden="true">
      <span className="on-air-dot" />
      On air
    </span>
  )
}

export function VoiceMeter() {
  return (
    <span className="voice-meter" aria-hidden="true">
      {BARS.map((h, i) => (
        <span
          key={i}
          style={{ '--h': `${h}px`, '--d': `${(i * 137) % 900}ms`, '--s': `${700 + ((i * 53) % 500)}ms` } as React.CSSProperties}
        />
      ))}
    </span>
  )
}
