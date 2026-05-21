// App: variant switcher + Stage + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "v1",
  "showCaptions": true,
  "showSafeArea": false
}/*EDITMODE-END*/;

const VARIANTS = {
  v1: {
    title: '에너제틱',
    label: '빠른 컷',
    blurb: 'TikTok 스타일 · 강한 임팩트 · 카오스→해결',
    accent: '#FF0050',
    Scene: V1Scene,
    duration: 30,
  },
  v2: {
    title: '스토리',
    label: '시네마틱',
    blurb: '시네마틱 · 차분한 호흡 · 문제→해결→공감',
    accent: '#00F2EA',
    Scene: V2Scene,
    duration: 30,
  },
  v3: {
    title: '쇼케이스',
    label: '기능 데모',
    blurb: '클린 · 정확한 데모 · 프로덕트 중심',
    accent: '#A78BFA',
    Scene: V3Scene,
    duration: 30,
  },
};

function PromoApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Loop mode: cycle v1 → v2 → v3 every variant.duration seconds.
  const loopMode = React.useMemo(() => {
    try {
      const qs = new URLSearchParams(location.search);
      if (qs.get('loop') === '1') return true;
      const meta = document.querySelector('meta[name="tikke-loop"]');
      if (meta && meta.content === '1') return true;
    } catch (e) {}
    return false;
  }, []);

  // Forced variant via URL param (?v=v1) or meta tag — used by single-variant HTML files.
  const forcedVariant = React.useMemo(() => {
    try {
      const qs = new URLSearchParams(location.search);
      const qv = qs.get('v');
      if (qv && VARIANTS[qv]) return qv;
      const meta = document.querySelector('meta[name="tikke-variant"]');
      const mv = meta && meta.content;
      if (mv && VARIANTS[mv]) return mv;
    } catch (e) {}
    return null;
  }, []);

  // Local loop index (starts at v1 → cycles)
  const loopOrder = ['v1', 'v2', 'v3'];
  const [loopIdx, setLoopIdx] = React.useState(0);

  // Clear stale persisted time for each variant when loop mode starts,
  // so each variant always plays from 0 when the loop advances.
  React.useEffect(() => {
    if (!loopMode) return;
    try {
      loopOrder.forEach((k) => {
        localStorage.removeItem('tikke-promo-' + k + ':t');
      });
    } catch (e) {}
  }, [loopMode]);

  // Auto-advance: cycle through variants in loop mode.
  React.useEffect(() => {
    if (!loopMode) return;
    const current = VARIANTS[loopOrder[loopIdx]];
    const dur = (current.duration || 30) * 1000;
    const id = setTimeout(() => {
      // Clear next variant's persisted time so it starts at 0.
      const next = (loopIdx + 1) % loopOrder.length;
      try { localStorage.removeItem('tikke-promo-' + loopOrder[next] + ':t'); } catch (e) {}
      setLoopIdx(next);
    }, dur);
    return () => clearTimeout(id);
  }, [loopMode, loopIdx]);

  const activeKey = loopMode
    ? loopOrder[loopIdx]
    : (forcedVariant || t.variant);
  const variant = VARIANTS[activeKey] || VARIANTS.v1;
  const Scene = variant.Scene;

  const hideChrome = loopMode || forcedVariant;

  // Jump to a specific variant (used by chapter badges in loop mode)
  const jumpToVariant = React.useCallback((key) => {
    const i = loopOrder.indexOf(key);
    if (i < 0) return;
    try { localStorage.removeItem('tikke-promo-' + key + ':t'); } catch (e) {}
    setLoopIdx(i);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'Pretendard Variable, system-ui, sans-serif',
    }}>
      {/* Top bar (hidden in embed/loop mode) */}
      {!hideChrome && (
      <header style={{
        flex: '0 0 auto',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 24,
        background: 'rgba(15,15,18,0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #00F2EA, #FF0050)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: '24%',
              background: '#0a0a0a',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Space Grotesk', fontWeight: 700,
              fontSize: 14, color: '#fff',
            }}>T</div>
          </div>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700,
              fontSize: 18, letterSpacing: '-0.01em',
            }}>TIKKE 홍보 영상</div>
            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>30s · 1080×1920 · 9:16</div>
          </div>
        </div>

        {/* Variant tabs (hidden in single-variant mode) */}
        {!forcedVariant && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginLeft: 24, flex: 1,
          }}>
          {!forcedVariant && Object.entries(VARIANTS).map(([key, v]) => {
            const active = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => setTweak('variant', key)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: `1px solid ${active ? v.accent : 'rgba(255,255,255,0.08)'}`,
                  background: active ? `${v.accent}18` : 'rgba(255,255,255,0.03)',
                  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontFamily: 'Pretendard Variable', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all 160ms',
                }}>
                <span style={{
                  fontFamily: 'JetBrains Mono', fontSize: 11,
                  color: active ? v.accent : 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.08em',
                }}>{key.toUpperCase()}</span>
                <span>{v.title}</span>
              </button>
            );
          })}
          </div>
        )}

        <div style={{
          fontFamily: 'Pretendard Variable', fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          maxWidth: 360, textAlign: 'right',
        }}>{variant.blurb}</div>
      </header>
      )}

      {/* Loop-mode: listen for parent jump commands via postMessage */}
      {loopMode && <LoopMessageBridge onJump={jumpToVariant} activeKey={activeKey} />}

      {/* Stage container */}
      <div style={{
        position: 'relative', flex: 1, minHeight: 0,
      }}>
        <Stage
          width={1080}
          height={1920}
          duration={variant.duration}
          background="#06060c"
          persistKey={`tikke-promo-${activeKey}`}
          key={activeKey}
        >
          <Scene showCaption={t.showCaptions} />
          <SafeAreaGuides show={t.showSafeArea} />
        </Stage>
      </div>

      {/* Tweaks panel */}
      {/* Tweaks panel (hidden in embed/loop mode) */}
      {!hideChrome && (
      <TweaksPanel title="Tweaks · 영상 옵션">
        {!forcedVariant && (
          <TweakSection label="버전">
            <TweakRadio
              label="시안"
              value={t.variant}
              options={['v1', 'v2', 'v3']}
              onChange={(v) => setTweak('variant', v)}
            />
          </TweakSection>
        )}
        <TweakSection label="자막">
          <TweakToggle
            label="한국어 자막"
            value={t.showCaptions}
            onChange={(v) => setTweak('showCaptions', v)}
          />
        </TweakSection>
        <TweakSection label="가이드">
          <TweakToggle
            label="세이프 에어리어 (TikTok UI 영역)"
            value={t.showSafeArea}
            onChange={(v) => setTweak('showSafeArea', v)}
          />
        </TweakSection>
      </TweaksPanel>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PromoApp />);

// Small helper component — listens for parent postMessage to jump variants,
// and broadcasts active variant changes back to parent so it can highlight the badge.
function LoopMessageBridge({ onJump, activeKey }) {
  React.useEffect(() => {
    function onMsg(e) {
      if (!e.data) return;
      if (e.data.type === 'tikke-jump' && e.data.key) {
        onJump(e.data.key);
      }
    }
    window.addEventListener('message', onMsg);
    // Tell parent we're ready
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'tikke-loop-ready' }, '*');
      }
    } catch (e) {}
    return () => window.removeEventListener('message', onMsg);
  }, [onJump]);

  React.useEffect(() => {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'tikke-active', key: activeKey }, '*');
      }
    } catch (e) {}
  }, [activeKey]);

  return null;
}
window.LoopMessageBridge = LoopMessageBridge;
