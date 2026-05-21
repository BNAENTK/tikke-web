// Energetic effects — flashes, kicks, bursts, shakes
// All assume a Stage context (use useTime / useSprite).

// Full-screen color flash that pops then fades
function ScreenFlash({ at, color = '#fff', duration = 0.18, intensity = 1 }) {
  const t = useTime();
  const since = t - at;
  if (since < 0 || since > duration) return null;
  const p = since / duration;
  // Sharp rise, fast decay
  const op = (1 - p) * (1 - p) * intensity;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: color,
      opacity: op,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      zIndex: 500
    }} />);

}

// Radial burst rings expanding outward
function BurstRings({ at, x, y, color = '#fff', size = 800, count = 3, duration = 0.7 }) {
  const t = useTime();
  const since = t - at;
  if (since < 0 || since > duration) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: 0, height: 0,
      pointerEvents: 'none', zIndex: 480
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const delay = i * 0.08;
        const local = clamp((since - delay) / (duration - delay), 0, 1);
        if (local <= 0) return null;
        const r = size * local;
        const op = (1 - local) * (1 - local);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: -r, top: -r,
            width: r * 2, height: r * 2,
            border: `4px solid ${color}`,
            borderRadius: '50%',
            opacity: op,
            boxShadow: `0 0 24px ${color}`
          }} />);

      })}
    </div>);

}

// Confetti / spark burst — small dots flying outward
function SparkBurst({ at, x, y, count = 18, duration = 0.9, distance = 600, colors }) {
  const t = useTime();
  const since = t - at;
  if (since < 0 || since > duration) return null;
  const palette = colors || ['#00F2EA', '#FF0050', '#FFC857', '#A78BFA', '#00FFA3'];
  const p = since / duration;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: 0, height: 0,
      pointerEvents: 'none', zIndex: 490
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.sin(i * 1.7) * 0.3;
        const dist = distance * (0.5 + (i % 5) * 0.12) * Easing.easeOutCubic(p);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist + p * p * 200; // slight gravity
        const op = 1 - p;
        const c = palette[i % palette.length];
        const sz = 10 + (i % 3) * 6;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: dx - sz / 2, top: dy - sz / 2,
            width: sz, height: sz,
            borderRadius: '50%',
            background: c,
            opacity: op,
            boxShadow: `0 0 14px ${c}`
          }} />);

      })}
    </div>);

}

// Streaks — radial speed lines outward from a point
function SpeedLines({ at, x, y, count = 14, duration = 0.55, distance = 700, color = '#fff' }) {
  const t = useTime();
  const since = t - at;
  if (since < 0 || since > duration) return null;
  const p = since / duration;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: 0, height: 0,
      pointerEvents: 'none', zIndex: 470
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r0 = 80 + Easing.easeOutCubic(p) * distance * 0.3;
        const r1 = 80 + Easing.easeOutCubic(p) * distance;
        const dx0 = Math.cos(angle) * r0;
        const dy0 = Math.sin(angle) * r0;
        const dx1 = Math.cos(angle) * r1;
        const dy1 = Math.sin(angle) * r1;
        const op = (1 - p) * 0.9;
        const len = Math.hypot(dx1 - dx0, dy1 - dy0);
        const rot = angle * 180 / Math.PI;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: dx0, top: dy0,
            width: len, height: 4,
            background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`,
            transform: `rotate(${rot}deg)`,
            transformOrigin: '0 50%',
            opacity: op,
            boxShadow: `0 0 12px ${color}`
          }} />);

      })}
    </div>);

}

// Camera shake — wrap children, shakes between [at, at+duration]
function CameraKick({ at, duration = 0.35, intensity = 24, children }) {
  const t = useTime();
  const since = t - at;
  let x = 0, y = 0, rot = 0;
  if (since >= 0 && since <= duration) {
    const p = since / duration;
    const decay = (1 - p) * (1 - p);
    // Pseudo-random shake
    x = Math.sin(since * 80) * intensity * decay;
    y = Math.cos(since * 70) * intensity * decay;
    rot = Math.sin(since * 60) * 0.6 * decay;
  }
  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
      willChange: 'transform'
    }}>
      {children}
    </div>);

}

// Steady beat pulse — value oscillates 0..1 at given bpm
function useBeat(bpm = 120) {
  const t = useTime();
  const period = 60 / bpm;
  const phase = (t % period) / period; // 0..1
  // sharp attack, slow decay
  return Math.max(0, 1 - phase * 1.3);
}

// Strobe — returns 0/1 toggling at hz; intensity controls 1-side opacity
function useStrobe(hz = 8) {
  const t = useTime();
  return Math.floor(t * hz) % 2;
}

// Chromatic aberration text — RGB split with offset
function ChromaText({ text, x, y, size = 80, weight = 800, color = '#fff', offset = 6, opacity = 1, transform }) {
  const baseStyle = {
    position: 'absolute', left: x, top: y,
    fontFamily: 'Pretendard Variable',
    fontWeight: weight,
    fontSize: size,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
    whiteSpace: 'pre',
    pointerEvents: 'none'
  };
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform,
      opacity,
      pointerEvents: 'none'
    }}>
      <div style={{ ...baseStyle, left: -offset, top: 0, color: '#FF0050', mixBlendMode: 'screen' }}>{text}</div>
      <div style={{ ...baseStyle, left: offset, top: 0, color: '#00F2EA', mixBlendMode: 'screen' }}>{text}</div>
      <div style={{ ...baseStyle, left: 0, top: 0, color }}>{text}</div>
    </div>);

}

// Beat-synced background flash that pumps every period
function BeatPump({ bpm = 120, color = '#FF0050', intensity = 0.18 }) {
  const beat = useBeat(bpm);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(circle at 50% 60%, ${color} 0%, transparent 65%)`,
      opacity: beat * intensity,
      pointerEvents: 'none',
      mixBlendMode: 'screen'
    }} />);

}

Object.assign(window, {
  ScreenFlash, BurstRings, SparkBurst, SpeedLines,
  CameraKick, useBeat, useStrobe, ChromaText, BeatPump
});
