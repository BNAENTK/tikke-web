// Reusable parts for the Tikke promo video
// All sized for 1080×1920 canvas (9:16)

const NEON = {
  cyan: '#00F2EA',
  pink: '#FF0050',
  violet: '#A78BFA',
  green: '#00FFA3',
  gold: '#FFC857'
};

// Background: deep with subtle drifting neon blooms
function NeonBackground({ tint = 'mixed', intensity = 1 }) {
  const t = useTime();
  const drift = Math.sin(t * 0.4) * 60;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#06060c' }}>
      <div style={{
        position: 'absolute',
        width: 1200, height: 1200,
        left: -300 + drift * 0.6,
        top: -200,
        borderRadius: '50%',
        filter: 'blur(160px)',
        opacity: 0.6 * intensity,
        background: `radial-gradient(circle, ${NEON.cyan} 0%, transparent 60%)`
      }} />
      <div style={{
        position: 'absolute',
        width: 1200, height: 1200,
        right: -300 - drift * 0.6,
        bottom: -200,
        borderRadius: '50%',
        filter: 'blur(160px)',
        opacity: 0.55 * intensity,
        background: `radial-gradient(circle, ${NEON.pink} 0%, transparent 60%)`
      }} />
      <div style={{
        position: 'absolute',
        width: 1000, height: 1000,
        left: '20%', top: '40%',
        borderRadius: '50%',
        filter: 'blur(180px)',
        opacity: 0.35 * intensity,
        background: `radial-gradient(circle, ${NEON.violet} 0%, transparent 60%)`
      }} />
      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.18,
        mixBlendMode: 'overlay',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1, 0 0 0 0 1, 0 0 0 0 1, 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
      }} />
    </div>);

}

// Safe-area guides — TikTok UI overlay zones
function SafeAreaGuides({ show }) {
  if (!show) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 999 }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 240,
        border: '1px dashed rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{
          position: 'absolute', top: 8, left: 12,
          fontFamily: 'JetBrains Mono', fontSize: 18, color: 'rgba(255,255,255,0.4)'
        }}>TOP SAFE · 240</div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 420,
        border: '1px dashed rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{
          position: 'absolute', bottom: 8, left: 12,
          fontFamily: 'JetBrains Mono', fontSize: 18, color: 'rgba(255,255,255,0.4)'
        }}>BOTTOM SAFE · 420</div>
      </div>
      <div style={{
        position: 'absolute', right: 0, top: 240, bottom: 420, width: 160,
        border: '1px dashed rgba(255,255,255,0.15)'
      }}>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          fontFamily: 'JetBrains Mono', fontSize: 18, color: 'rgba(255,255,255,0.35)'
        }}>RAIL · 160</div>
      </div>
    </div>);

}

// Korean caption — sits in a dedicated bottom band with its own scrim
// Reserved zone: canvas Y 1380-1700 (so scene content must stay above 1340)
function Caption({ text, sub, show = true, accent = NEON.cyan, big = false }) {
  if (!show) return null;
  const { localTime, duration } = useSprite();
  const inT = Easing.easeOutCubic(clamp(localTime / 0.35, 0, 1));
  const outT = duration > 0 ? Easing.easeInCubic(clamp((localTime - (duration - 0.3)) / 0.3, 0, 1)) : 0;
  const opacity = inT * (1 - outT);
  const ty = (1 - inT) * 18;
  return (
    <div style={{
      position: 'absolute',
      left: 50, right: 50,
      top: 1400,
      transform: `translateY(${ty}px)`,
      opacity,
      pointerEvents: 'none',
      padding: '28px 40px',
      borderRadius: 28,
      background: 'rgba(8,8,14,0.78)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
      textAlign: 'center'
    }}>
      {sub &&
      <div style={{
        fontFamily: 'JetBrains Mono',
        fontSize: 22,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: accent,
        marginBottom: 12,
        textShadow: `0 0 12px ${accent}77`
      }}>{sub}</div>
      }
      <div style={{
        fontFamily: 'Pretendard Variable',
        fontWeight: 800,
        fontSize: big ? 72 : 56,
        lineHeight: 1.15,
        color: '#fff',
        letterSpacing: '-0.02em',
        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        textWrap: 'balance'
      }}>{text}</div>
    </div>);

}

// Big animated logo — mirrors favicon.svg (dark rounded square + neon diamond)
function TikkeLogo({ size = 200, glow = true, wordmark = true }) {
  const t = useTime();
  const pulse = 0.85 + 0.15 * Math.sin(t * 4);
  const icon = size * 0.85;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: size * 0.12,
      fontFamily: 'Space Grotesk', fontWeight: 700,
      fontSize: size, color: '#fff',
      letterSpacing: '-0.04em'
    }}>
      <div style={{
        width: icon, height: icon,
        borderRadius: icon * 0.22,
        background: '#07070f',
        boxShadow: glow ?
          `0 0 ${48 * pulse}px ${NEON.pink}77, 0 0 ${28 * pulse}px ${NEON.cyan}77, 0 0 0 1px rgba(255,255,255,0.14) inset` :
          '0 0 0 1px rgba(255,255,255,0.14) inset',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg viewBox="0 0 64 64" width={icon} height={icon}
          style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id={`tikkeGrad-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={NEON.cyan} />
              <stop offset="50%" stopColor={NEON.violet} />
              <stop offset="100%" stopColor={NEON.pink} />
            </linearGradient>
            <linearGradient id={`tikkeGlint-${size}`} x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <polygon points="32,8 56,32 32,56 8,32" fill={`url(#tikkeGrad-${size})`} />
          <polygon points="32,8 56,32 8,32" fill={`url(#tikkeGlint-${size})`} opacity="0.6" />
        </svg>
      </div>
      {wordmark && <span>TIKKE</span>}
    </div>);

}

// Chat bubble row
function ChatRow({ name, msg, color = '#FF7AB3', tag, blocked, translated, width = 800 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16,
      background: 'rgba(20,20,28,0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 18,
      padding: '20px 26px',
      width,
      fontFamily: 'Pretendard Variable',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      <div style={{
        width: 48, height: 48, flexShrink: 0,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${NEON.violet})`,
        border: '2px solid rgba(255,255,255,0.1)'
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6
        }}>
          <b style={{ color, fontSize: 24, fontWeight: 600 }}>{name}</b>
          {tag &&
          <span style={{
            fontSize: 16, color: '#06060c',
            background: NEON.cyan,
            padding: '2px 10px',
            borderRadius: 6,
            fontFamily: 'JetBrains Mono',
            fontWeight: 600
          }}>{tag}</span>
          }
        </div>
        <div style={{
          fontSize: 30, color: blocked ? 'rgba(255,255,255,0.3)' : '#fff',
          textDecoration: blocked ? 'line-through' : 'none',
          fontWeight: 500,
          lineHeight: 1.3
        }}>{msg}</div>
        {translated &&
        <div style={{
          marginTop: 8,
          paddingLeft: 14,
          borderLeft: `3px solid ${NEON.cyan}`,
          fontSize: 24, color: NEON.cyan,
          fontWeight: 500
        }}>{translated}</div>
        }
      </div>
    </div>);

}

// Voice waveform — animated bars (inline by default, absolute if x/y given)
function VoiceWave({ x, y, color = NEON.gold, height = 60, bars = 24, width }) {
  const t = useTime();
  const positioned = x != null || y != null;
  return (
    <div style={positioned ? {
      position: 'absolute', left: x || 0, top: y || 0,
      display: 'flex', alignItems: 'center', gap: 6,
      height, width
    } : {
      display: 'flex', alignItems: 'center', gap: 6,
      height, width: width || '100%'
    }}>
      {Array.from({ length: bars }).map((_, i) => {
        const phase = i * 0.4 + t * 8;
        const h = 0.3 + 0.7 * Math.abs(Math.sin(phase));
        return (
          <div key={i} style={{
            flex: 1,
            minWidth: 6,
            height: `${h * 100}%`,
            background: color,
            borderRadius: 4,
            boxShadow: `0 0 12px ${color}aa`
          }} />);

      })}
    </div>);

}

// Gift alert (overlay-style notification)
function GiftAlert({ user = 'kpop_fan', gift = '🌹 ×10', x, y, width = 600 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width,
      padding: '22px 28px',
      borderRadius: 22,
      background: `linear-gradient(135deg, ${NEON.pink}CC, ${NEON.violet}CC)`,
      border: '2px solid rgba(255,255,255,0.25)',
      backdropFilter: 'blur(12px)',
      boxShadow: `0 16px 48px ${NEON.pink}55, 0 0 0 1px rgba(255,255,255,0.1) inset`,
      color: '#fff',
      fontFamily: 'Pretendard Variable'
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        opacity: 0.92,
        marginBottom: 6
      }}>🎁 NEW GIFT</div>
      <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.01em' }}>
        {user} <span style={{ opacity: 0.7 }}>→</span> {gift}
      </div>
    </div>);

}

Object.assign(window, {
  NEON, NeonBackground, SafeAreaGuides, Caption, TikkeLogo,
  ChatRow, VoiceWave, GiftAlert
});