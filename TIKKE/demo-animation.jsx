// Auto-playing 30s demo animation showing Tikke key features
// Replaces the static play-button poster with real animated scenes

const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;

const DEMO_DURATION = 30; // seconds
const CHAPTERS = [
  { id: 0, start: 0,  end: 8,  key: "video_ch1" },  // 연결
  { id: 1, start: 8,  end: 16, key: "video_ch2" },  // 번역
  { id: 2, start: 16, end: 22, key: "video_ch3" },  // 선물
  { id: 3, start: 22, end: 30, key: "video_ch4" },  // 오버레이
];

/* ─────────── Scene 1: Connect ─────────── */
function SceneConnect({ localT }) {
  const phase = localT < 1.5 ? "idle" : localT < 4 ? "connecting" : "connected";
  const statusColor = phase === "connected" ? "#00F2EA" : phase === "connecting" ? "#F5A623" : "#555";
  const statusLabel = phase === "connected" ? "Connected" : phase === "connecting" ? "Connecting…" : "Disconnected";

  return (
    <div className="demo-scene">
      <div className="demo-app">
        <div className="demo-app-bar">
          <div className="demo-app-dots">
            <span style={{ background: "#FF5F57" }}></span>
            <span style={{ background: "#FFBD2E" }}></span>
            <span style={{ background: "#28C840" }}></span>
          </div>
          <div className="demo-app-title">Tikke</div>
          <div className="demo-app-status">
            <span className="status-dot" style={{ background: statusColor, boxShadow: phase === "connected" ? "0 0 8px " + statusColor : "none" }}></span>
            <span className="status-label">{statusLabel}</span>
          </div>
        </div>
        <div className="demo-connect-body">
          <div className="connect-logo">
            <div className="connect-diamond"></div>
          </div>
          <div className="connect-title">TikTok LIVE 연결</div>
          <div className="connect-input-row">
            <span className="connect-at">@</span>
            <span className="connect-handle">
              {"tikke_demo".slice(0, Math.max(0, Math.floor((localT - 0.4) * 4)))}
              {localT > 0.4 && localT < 3.5 && <span className="caret"></span>}
            </span>
          </div>
          {phase === "connecting" && (
            <div className="connect-loading">
              <div className="loading-bar"></div>
            </div>
          )}
          {phase === "connected" && (
            <div className="connect-success">
              <div className="success-check">✓</div>
              <div className="success-msg">@tikke_demo 라이브 세션에 연결되었습니다</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Scene 2: Translation ─────────── */
const TRANS_FEED = [
  { t: 0.3, user: "haruki_jp",  flag: "JP", src: "こんばんは〜",                       dst: "안녕하세요~" },
  { t: 1.8, user: "alex",       flag: "EN", src: "what game is this?",                  dst: "어떤 게임이에요?" },
  { t: 3.5, user: "mei_zh",     flag: "ZH", src: "你好,主播!",                       dst: "안녕하세요, 호스트님!" },
  { t: 5.0, user: "thai_view",  flag: "TH", src: "สวัสดีค่ะ",                          dst: "안녕하세요!" },
];

function SceneTranslate({ localT }) {
  const visible = TRANS_FEED.filter((m) => localT >= m.t);
  return (
    <div className="demo-scene">
      <div className="demo-app">
        <div className="demo-app-bar">
          <div className="demo-app-dots">
            <span style={{ background: "#FF5F57" }}></span>
            <span style={{ background: "#FFBD2E" }}></span>
            <span style={{ background: "#28C840" }}></span>
          </div>
          <div className="demo-app-title">Tikke · 실시간 번역</div>
          <div className="demo-app-status">
            <span className="status-dot" style={{ background: "#00F2EA", boxShadow: "0 0 8px #00F2EA" }}></span>
            <span className="status-label">Connected</span>
          </div>
        </div>
        <div className="demo-translate-body">
          <div className="translate-feed">
            {visible.map((m, i) => (
              <div key={i} className="trans-msg" style={{ animationDelay: "0s" }}>
                <div className="trans-head">
                  <span className="trans-flag">{m.flag}</span>
                  <b className="trans-user">@{m.user}</b>
                </div>
                <div className="trans-src">{m.src}</div>
                <div className="trans-arrow">↓ KO</div>
                <div className="trans-dst">{m.dst}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Scene 3: Gifts ─────────── */
const GIFTS = [
  { t: 0.3, name: "kpop_fan",   gift: "🌹", count: 5,  amount: 5 },
  { t: 1.8, name: "soyeon",     gift: "💎", count: 1,  amount: 50 },
  { t: 3.2, name: "minji",      gift: "🦁", count: 10, amount: 1000 },
  { t: 4.6, name: "tiktok_lvr", gift: "🚀", count: 1,  amount: 500 },
];

function SceneGifts({ localT }) {
  const visible = GIFTS.filter((g) => localT >= g.t);
  const total = visible.reduce((s, g) => s + g.amount * g.count, 0);
  return (
    <div className="demo-scene">
      <div className="demo-app">
        <div className="demo-app-bar">
          <div className="demo-app-dots">
            <span style={{ background: "#FF5F57" }}></span>
            <span style={{ background: "#FFBD2E" }}></span>
            <span style={{ background: "#28C840" }}></span>
          </div>
          <div className="demo-app-title">Tikke · 선물 알림</div>
          <div className="demo-app-status">
            <span className="status-dot" style={{ background: "#FF0050", boxShadow: "0 0 8px #FF0050" }}></span>
            <span className="status-label">{total.toLocaleString()} coins</span>
          </div>
        </div>
        <div className="demo-gift-body">
          <div className="gift-feed">
            {visible.map((g, i) => (
              <div key={i} className="gift-row">
                <div className="gift-emoji">{g.gift}</div>
                <div className="gift-info">
                  <b className="gift-user">@{g.name}</b>
                  <span className="gift-meta">×{g.count} · {(g.amount * g.count).toLocaleString()} coins</span>
                </div>
                <div className="gift-spark">✨</div>
              </div>
            ))}
          </div>
          {visible.length > 0 && (
            <div className="gift-summary">
              <div className="gift-sum-label">오늘 누적</div>
              <div className="gift-sum-value">{total.toLocaleString()} <span>coins</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Scene 4: Overlay ─────────── */
function SceneOverlay({ localT }) {
  const showChat = localT >= 0.5;
  const showAlert = localT >= 2.2;
  const showGoal = localT >= 4.0;
  const goalFill = Math.min(72, localT * 14);

  return (
    <div className="demo-scene">
      <div className="demo-obs">
        <div className="obs-bar">
          <div className="obs-bar-left">
            <span className="obs-logo">
              <span className="tls-dot"></span>
              TikTok LIVE Studio
            </span>
            <span className="obs-scene">Scene · Main</span>
          </div>
          <div className="obs-bar-right">
            <span className="obs-rec">● LIVE</span>
            <span className="obs-time">02:14:08</span>
          </div>
        </div>
        <div className="obs-canvas">
          <div className="obs-cam">
            <div className="cam-label">CAM 1</div>
            <div className="cam-host">@tikke_demo</div>
          </div>
          {showChat && (
            <div className="overlay-widget overlay-chat anim-pop">
              <div className="ow-head">CHAT</div>
              <div className="ow-row"><span className="ow-av" style={{ background: "linear-gradient(135deg,#00F2EA,#A78BFA)" }}></span><b>jiwon</b> <span>오늘도 ㅋㅋ</span></div>
              <div className="ow-row"><span className="ow-av" style={{ background: "linear-gradient(135deg,#FF0050,#FFC857)" }}></span><b>minji</b> <span>🔥🔥🔥</span></div>
              <div className="ow-row"><span className="ow-av" style={{ background: "linear-gradient(135deg,#A78BFA,#FF0050)" }}></span><b>haruki</b> <span>こんばんは</span></div>
            </div>
          )}
          {showAlert && (
            <div className="overlay-widget overlay-alert anim-pop">
              <div className="ow-head">NEW GIFT</div>
              <div className="ow-alert-emoji">🦁</div>
              <div className="ow-alert-text"><b>minji</b> ×10</div>
            </div>
          )}
          {showGoal && (
            <div className="overlay-widget overlay-goal anim-pop">
              <div className="ow-head">DAILY GOAL</div>
              <div className="ow-goal-bar">
                <div className="ow-goal-fill" style={{ width: goalFill + "%" }}></div>
              </div>
              <div className="ow-goal-text">{Math.floor(goalFill)}%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Main player ─────────── */
function DemoPlayer({ t: tt }) {
  const [time, setTime] = useStateD(0);
  const [playing, setPlaying] = useStateD(false);
  const rafRef = useRefD(0);
  const startedAtRef = useRefD(0);
  const baseRef = useRefD(0);

  useEffectD(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    startedAtRef.current = performance.now();
    baseRef.current = time;
    const tick = (now) => {
      const elapsed = (now - startedAtRef.current) / 1000;
      const next = baseRef.current + elapsed;
      if (next >= DEMO_DURATION) {
        setTime(0);
        baseRef.current = 0;
        startedAtRef.current = performance.now();
      } else {
        setTime(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const chapter = CHAPTERS.find((c) => time >= c.start && time < c.end) || CHAPTERS[0];
  const localT = time - chapter.start;

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return m.toString().padStart(2, "0") + ":" + ss.toString().padStart(2, "0");
  };

  const jumpTo = (chapterId) => {
    const c = CHAPTERS.find((x) => x.id === chapterId);
    if (c) {
      setTime(c.start);
      baseRef.current = c.start;
      startedAtRef.current = performance.now();
      if (!playing) setPlaying(true);
    }
  };

  return (
    <div className="demo-player">
      <div className="demo-stage">
        {!playing && time === 0 && (
          <div className="demo-poster">
            <button className="play-button" type="button" onClick={() => setPlaying(true)} aria-label={tt("video_play")}>
              <Icon name="play" size={36} color="#001318" />
            </button>
          </div>
        )}
        {chapter.id === 0 && (playing || time > 0) && <SceneConnect localT={localT} />}
        {chapter.id === 1 && (playing || time > 0) && <SceneTranslate localT={localT} />}
        {chapter.id === 2 && (playing || time > 0) && <SceneGifts localT={localT} />}
        {chapter.id === 3 && (playing || time > 0) && <SceneOverlay localT={localT} />}
      </div>

      <div className="demo-overlay-info">
        <div className="sub">{tt("video_sub")}</div>
        <div className="title">{tt("video_title")}</div>
      </div>

      <div className="demo-controls">
        <div className="video-chapters">
          {CHAPTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={"video-chapter" + (chapter.id === c.id ? " active" : "")}
              onClick={() => jumpTo(c.id)}
            >
              {fmt(c.start)} · {tt(c.key)}
            </button>
          ))}
        </div>
        <div className="video-timeline" onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - r.left) / r.width;
          const newTime = pct * DEMO_DURATION;
          setTime(newTime);
          baseRef.current = newTime;
          startedAtRef.current = performance.now();
        }}>
          <div className="video-timeline-fill" style={{ width: (time / DEMO_DURATION * 100) + "%" }}></div>
          <div className="video-timeline-knob" style={{ left: (time / DEMO_DURATION * 100) + "%" }}></div>
        </div>
        <div className="video-meta">
          <div className="lhs">
            <button className="demo-play-toggle" type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}>
              {playing ? "❚❚" : "▶"}
            </button>
            <span>{fmt(time)} / {fmt(DEMO_DURATION)}</span>
            <span style={{ color: "var(--t-3)" }}>1080p</span>
          </div>
          <span style={{ color: "var(--t-3)" }}>{playing ? "Auto-play" : tt("video_caption")}</span>
        </div>
      </div>
    </div>
  );
}

window.DemoPlayer = DemoPlayer;
