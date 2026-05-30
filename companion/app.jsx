// Tikke 웹 컴패니언 — 데스크탑 라이브 이벤트 실시간 모니터링 + 브라우저 TTS

const { useState, useEffect, useRef, useCallback } = React;

const WS_BASE = "wss://api.tikke.kr/overlay/rooms";
const GOOGLE_TTS_KEY = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";
const MAX_EVENTS = 100;
const RECONNECT_DELAY_MS = 3000;

// ── Google TTS URL 생성 ───────────────────────────────────────────────────────
function buildTTSUrl(text, lang = "ko-KR", speed = 0.5, pitch = 0.5, gender = "female", key = GOOGLE_TTS_KEY) {
  const params = new URLSearchParams({
    key,
    enc: "mpeg",
    lang,
    text,
    speed: String(speed),
    pitch: String(pitch),
    rate: "48000",
    gender,
  });
  return `https://www.google.com/speech-api/v2/synthesize?${params}`;
}

// ── 이벤트 타입별 스타일 ──────────────────────────────────────────────────────
const EVENT_META = {
  chat:      { emoji: "💬", color: "#e0e0f0" },
  gift:      { emoji: "🎁", color: "#FFD700" },
  follow:    { emoji: "❤️",  color: "#FF0050" },
  like:      { emoji: "👍", color: "#FF6B35" },
  member:    { emoji: "🙋", color: "#00F2EA" },
  share:     { emoji: "🔗", color: "#9B59B6" },
  subscribe: { emoji: "⭐", color: "#F39C12" },
};

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function timeLabel(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── 이벤트 행 ─────────────────────────────────────────────────────────────────
function EventRow({ ev }) {
  const meta = EVENT_META[ev.type] || { emoji: "•", color: "#aaa" };
  const nick = ev.user?.nickname || ev.user?.uniqueId || "";
  let body = "";

  if (ev.type === "chat") {
    body = ev.message || "";
  } else if (ev.type === "gift") {
    const count = ev.repeatCount > 1 ? ` ×${ev.repeatCount}` : "";
    const dia = ev.diamondCount ? ` 💎${fmtNum(ev.diamondCount)}` : "";
    body = `${ev.giftName || "선물"}${count}${dia}`;
  } else if (ev.type === "follow") {
    body = "팔로우";
  } else if (ev.type === "like") {
    body = ev.likeCount ? `좋아요 ${ev.likeCount}` : "좋아요";
  } else if (ev.type === "member") {
    body = "입장";
  } else if (ev.type === "share") {
    body = "공유";
  } else if (ev.type === "subscribe") {
    body = "구독";
  } else {
    body = ev.message || ev.type || "";
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
      padding: "5px 10px",
      borderBottom: "1px solid #111120",
      fontSize: "13px",
      lineHeight: "1.4",
    }}>
      <span style={{ fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>{meta.emoji}</span>
      <div style={{ flex: 1, overflow: "hidden", wordBreak: "break-word" }}>
        {nick && (
          <span style={{ fontWeight: 600, color: meta.color, marginRight: "5px", fontSize: "12px" }}>
            {nick}
          </span>
        )}
        <span style={{ color: "#c8c8d8" }}>{body}</span>
      </div>
      <span style={{ color: "#333", fontSize: "11px", flexShrink: 0, paddingTop: "1px" }}>
        {timeLabel(ev.timestamp)}
      </span>
    </div>
  );
}

// ── 통계 카드 ─────────────────────────────────────────────────────────────────
function StatCard({ emoji, label, value, color }) {
  return (
    <div style={{
      background: "#12121f",
      border: `1px solid ${color}33`,
      borderRadius: "10px",
      padding: "10px 14px",
      textAlign: "center",
      flex: 1,
      minWidth: "70px",
    }}>
      <div style={{ fontSize: "18px" }}>{emoji}</div>
      <div style={{ fontSize: "18px", fontWeight: 700, color, marginTop: "2px" }}>{value}</div>
      <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

// ── 선물 팝업 ─────────────────────────────────────────────────────────────────
function GiftAlert({ alert }) {
  if (!alert) return null;
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "linear-gradient(135deg, #1a1a30, #14142a)",
      border: "1px solid #FFD70055",
      borderRadius: "12px",
      padding: "12px 16px",
      maxWidth: "260px",
      zIndex: 1000,
      animation: "fadeUp 0.25s ease",
    }}>
      <div style={{ fontSize: "13px", color: "#FFD700", fontWeight: 700, marginBottom: "2px" }}>
        🎁 {alert.user?.nickname || alert.user?.uniqueId || "익명"}
      </div>
      <div style={{ fontSize: "13px", color: "#e0e0f0" }}>
        {alert.giftName || "선물"}{alert.repeatCount > 1 ? ` ×${alert.repeatCount}` : ""}
        {alert.diamondCount ? <span style={{ color: "#00F2EA", marginLeft: "6px" }}>💎{fmtNum(alert.diamondCount)}</span> : null}
      </div>
    </div>
  );
}

// ── 메인 앱 ──────────────────────────────────────────────────────────────────
function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const initKey = urlParams.get("room") || "";

  const [inputKey, setInputKey] = useState(initKey);
  const [status, setStatus] = useState("disconnected");
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ diamonds: 0, gifts: 0, follows: 0, viewers: 0 });
  const [giftAlert, setGiftAlert] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // TTS 설정 — ref로도 미러링해서 WebSocket 핸들러에서 stale closure 방지
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsLang, setTtsLang] = useState("ko-KR");
  const [ttsSpeed, setTtsSpeed] = useState(0.5);
  const [ttsPitch, setTtsPitch] = useState(0.5);
  const [ttsGender, setTtsGender] = useState("female");
  const [ttsApiKey, setTtsApiKey] = useState("");
  const [ttsMinDiamonds, setTtsMinDiamonds] = useState(0);
  const [ttsAnnounceFollow, setTtsAnnounceFollow] = useState(true);
  const [ttsAnnounceSubscribe, setTtsAnnounceSubscribe] = useState(true);
  const [ttsBlocked, setTtsBlocked] = useState(false);
  const ttsEnabledRef = useRef(ttsEnabled);
  const ttsLangRef = useRef(ttsLang);
  const ttsSpeedRef = useRef(ttsSpeed);
  const ttsPitchRef = useRef(ttsPitch);
  const ttsGenderRef = useRef(ttsGender);
  const ttsApiKeyRef = useRef(ttsApiKey);
  const ttsMinDiamondsRef = useRef(ttsMinDiamonds);
  const ttsAnnounceFollowRef = useRef(ttsAnnounceFollow);
  const ttsAnnounceSubscribeRef = useRef(ttsAnnounceSubscribe);
  const ttsBlockedRef = useRef(false);
  useEffect(() => { ttsEnabledRef.current = ttsEnabled; }, [ttsEnabled]);
  useEffect(() => { ttsLangRef.current = ttsLang; }, [ttsLang]);
  useEffect(() => { ttsSpeedRef.current = ttsSpeed; }, [ttsSpeed]);
  useEffect(() => { ttsPitchRef.current = ttsPitch; }, [ttsPitch]);
  useEffect(() => { ttsGenderRef.current = ttsGender; }, [ttsGender]);
  useEffect(() => { ttsApiKeyRef.current = ttsApiKey; }, [ttsApiKey]);
  useEffect(() => { ttsMinDiamondsRef.current = ttsMinDiamonds; }, [ttsMinDiamonds]);
  useEffect(() => { ttsAnnounceFollowRef.current = ttsAnnounceFollow; }, [ttsAnnounceFollow]);
  useEffect(() => { ttsAnnounceSubscribeRef.current = ttsAnnounceSubscribe; }, [ttsAnnounceSubscribe]);

  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const activeKey = useRef(null);
  const ttsQueue = useRef([]);
  const ttsPlaying = useRef(false);
  const giftAlertTimer = useRef(null);
  const feedRef = useRef(null);

  // ── TTS 재생 ──────────────────────────────────────────────────────────────
  const playNextTTS = useCallback(() => {
    if (!ttsEnabledRef.current || ttsPlaying.current || ttsQueue.current.length === 0) return;
    if (ttsBlockedRef.current) return; // autoplay 차단 상태면 대기
    const text = ttsQueue.current.shift();
    ttsPlaying.current = true;
    const audio = new Audio(buildTTSUrl(
      text,
      ttsLangRef.current,
      ttsSpeedRef.current,
      ttsPitchRef.current,
      ttsGenderRef.current,
      ttsApiKeyRef.current || GOOGLE_TTS_KEY,
    ));
    const done = () => { ttsPlaying.current = false; playNextTTS(); };
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch((e) => {
      if (e?.name === "NotAllowedError" || e?.name === "NotSupportedError") {
        // 사용자 제스처 없이 자동재생 차단됨 — 텍스트를 큐 앞에 다시 넣고 차단 표시
        ttsQueue.current.unshift(text);
        ttsBlockedRef.current = true;
        setTtsBlocked(true);
        console.warn("[tts] autoplay blocked:", e.name);
      } else {
        console.warn("[tts] play failed:", e);
      }
      ttsPlaying.current = false;
    });
  }, []);

  const enqueueTTS = useCallback((text) => {
    ttsQueue.current.push(text);
    if (!ttsPlaying.current) playNextTTS();
  }, [playNextTTS]);

  // ── 이벤트 처리 — ref 기반으로 stale closure 없음 ────────────────────────
  const handleEvent = useCallback((ev) => {
    const ts = ev.timestamp || Date.now();
    const normalized = { ...ev, timestamp: ts, _id: `${ts}_${Math.random().toString(36).slice(2)}` };

    setEvents((prev) => {
      const next = [normalized, ...prev];
      return next.length > MAX_EVENTS ? next.slice(0, MAX_EVENTS) : next;
    });

    if (ev.type === "gift" && ev.isStreakEnd !== false) {
      const diamonds = (ev.diamondCount || 0) * (ev.repeatCount || 1);
      setStats((s) => ({ ...s, diamonds: s.diamonds + diamonds, gifts: s.gifts + 1 }));

      if (ttsEnabledRef.current && diamonds >= ttsMinDiamondsRef.current) {
        const nick = ev.user?.nickname || ev.user?.uniqueId || "익명";
        const gift = ev.giftName || "선물";
        const cnt = ev.repeatCount > 1 ? ` ${ev.repeatCount}개` : "";
        enqueueTTS(`${nick}님이 ${gift}${cnt} 보내셨습니다`);
      }

      setGiftAlert(ev);
      if (giftAlertTimer.current) clearTimeout(giftAlertTimer.current);
      giftAlertTimer.current = setTimeout(() => setGiftAlert(null), 4000);
    }

    if (ev.type === "follow") {
      setStats((s) => ({ ...s, follows: s.follows + 1 }));
      if (ttsEnabledRef.current && ttsAnnounceFollowRef.current) {
        const nick = ev.user?.nickname || ev.user?.uniqueId || "익명";
        enqueueTTS(`${nick}님이 팔로우했습니다`);
      }
    }

    if (ev.type === "subscribe") {
      if (ttsEnabledRef.current && ttsAnnounceSubscribeRef.current) {
        const nick = ev.user?.nickname || ev.user?.uniqueId || "익명";
        enqueueTTS(`${nick}님이 구독했습니다`);
      }
    }

    if (ev.type === "roomUser" && ev.viewerCount != null) {
      setStats((s) => ({ ...s, viewers: ev.viewerCount }));
    }
  }, [enqueueTTS]);

  // ── WebSocket ─────────────────────────────────────────────────────────────
  const connect = useCallback((key) => {
    if (!key) return;
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }

    activeKey.current = key;
    setStatus("connecting");

    const ws = new WebSocket(`${WS_BASE}/${key}/ws`);
    wsRef.current = ws;

    // keepalive ping interval
    let pingInterval = null;

    ws.onopen = () => {
      if (ws !== wsRef.current) return;
      setStatus("connected");
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("ping");
        else clearInterval(pingInterval);
      }, 25000);
    };

    ws.onmessage = (e) => {
      if (ws !== wsRef.current) return;
      if (e.data === "pong") return;
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "events" && Array.isArray(msg.events)) {
          msg.events.forEach(handleEvent);
        }
      } catch {}
    };

    ws.onclose = () => {
      if (pingInterval) clearInterval(pingInterval);
      if (ws !== wsRef.current) return;
      setStatus("disconnected");
      if (activeKey.current === key) {
        reconnectTimer.current = setTimeout(() => connect(key), RECONNECT_DELAY_MS);
      }
    };

    ws.onerror = () => {
      if (ws !== wsRef.current) return;
      setStatus("error");
    };
  }, [handleEvent]);

  const disconnect = useCallback(() => {
    activeKey.current = null;
    if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    setStatus("disconnected");
  }, []);

  // 초기 자동 연결
  useEffect(() => {
    if (initKey) connect(initKey);
    return disconnect;
  }, []); // eslint-disable-line

  const handleConnect = () => {
    const key = inputKey.trim();
    if (!key) return;
    const url = new URL(window.location.href);
    url.searchParams.set("room", key);
    window.history.pushState({}, "", url);
    connect(key);
  };

  // 피드 새 이벤트 도착 시 맨 위로 스크롤
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [events.length]);

  const STATUS_COLOR = { connected: "#00F2EA", connecting: "#FFD700", disconnected: "#555", error: "#FF0050" };
  const STATUS_LABEL = { connected: "연결됨", connecting: "연결 중...", disconnected: "연결 안 됨", error: "연결 오류" };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        button { cursor: pointer; border: none; outline: none; font-family: inherit; }
        input, select { font-family: inherit; }
        input:focus, select:focus { outline: none; }
      `}</style>

      {/* ── 헤더 ── */}
      <div style={{
        background: "#0d0d1a",
        borderBottom: "1px solid #1a1a2e",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 800, fontSize: "15px", color: "#00F2EA", letterSpacing: "-0.5px", flexShrink: 0 }}>
          Tikke
        </span>

        <input
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          placeholder="룸키 입력 (데스크탑 → 오버레이 → 룸키)"
          style={{
            flex: 1,
            background: "#1a1a2e",
            border: "1px solid #2a2a3e",
            borderRadius: "6px",
            padding: "7px 10px",
            color: "#f0f0f5",
            fontSize: "13px",
          }}
        />

        <button
          onClick={status === "connected" ? disconnect : handleConnect}
          style={{
            background: status === "connected" ? "transparent" : "#00F2EA",
            color: status === "connected" ? "#FF6B6B" : "#0a0a0f",
            border: status === "connected" ? "1px solid #FF6B6B44" : "none",
            borderRadius: "6px",
            padding: "7px 14px",
            fontWeight: 600,
            fontSize: "13px",
            flexShrink: 0,
          }}
        >
          {status === "connected" ? "연결 끊기" : "연결"}
        </button>

        {/* 상태 dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
          <div style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: STATUS_COLOR[status] || "#555",
            ...(status === "connecting" ? { animation: "pulse 1s infinite" } : {}),
          }} />
          <span style={{ fontSize: "11px", color: STATUS_COLOR[status] }}>
            {STATUS_LABEL[status]}
          </span>
        </div>

        {/* TTS 토글 */}
        <button
          onClick={() => setTtsEnabled((v) => !v)}
          style={{
            background: ttsEnabled ? "#00F2EA18" : "transparent",
            border: `1px solid ${ttsEnabled ? "#00F2EA44" : "#2a2a3e"}`,
            borderRadius: "6px",
            padding: "6px 10px",
            fontSize: "12px",
            color: ttsEnabled ? "#00F2EA" : "#555",
            flexShrink: 0,
          }}
        >
          🔊 {ttsEnabled ? "ON" : "OFF"}
        </button>

        {/* 설정 버튼 */}
        <button
          onClick={() => setShowSettings((v) => !v)}
          style={{
            background: showSettings ? "#1a1a2e" : "transparent",
            border: "1px solid #2a2a3e",
            borderRadius: "6px",
            padding: "6px 9px",
            color: "#666",
            fontSize: "13px",
            flexShrink: 0,
          }}
        >
          ⚙️
        </button>
      </div>

      {/* ── 설정 패널 ── */}
      {showSettings && (
        <div style={{
          background: "#0c0c18",
          borderBottom: "1px solid #1a1a2e",
          padding: "12px 14px",
          flexShrink: 0,
        }}>
          {/* 섹션 레이블 헬퍼 */}
          {(() => {
            const row = (children) => (
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "10px" }}>
                {children}
              </div>
            );
            const lbl = (text, children) => (
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#888" }}>
                <span>{text}</span>
                {children}
              </label>
            );
            const sel = (value, onChange, options) => (
              <select value={value} onChange={(e) => onChange(e.target.value)} style={{
                background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "4px",
                padding: "4px 7px", color: "#f0f0f5", fontSize: "12px",
              }}>
                {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            );
            const num = (value, onChange, min, max, step, width) => (
              <input type="number" min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                  background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "4px",
                  padding: "4px 7px", color: "#f0f0f5", fontSize: "12px", width: width || "70px",
                }}
              />
            );
            const chk = (label, value, onChange) => (
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#888", cursor: "pointer" }}>
                <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)}
                  style={{ accentColor: "#00F2EA" }} />
                {label}
              </label>
            );
            return (
              <>
                <div style={{ fontSize: "11px", color: "#444", marginBottom: "8px", letterSpacing: "0.05em" }}>
                  TTS — Google Speech v2
                </div>
                {row(<>
                  {lbl("언어", sel(ttsLang, setTtsLang, [
                    ["ko-KR", "한국어"], ["en-US", "English"], ["ja-JP", "日本語"], ["zh-CN", "中文"],
                    ["es-ES", "Español"], ["fr-FR", "Français"], ["de-DE", "Deutsch"],
                  ]))}
                  {lbl("성별", sel(ttsGender, setTtsGender, [["female", "여성"], ["male", "남성"]]))}
                  {lbl("속도", num(ttsSpeed, setTtsSpeed, 0, 1, 0.05, "64px"))}
                  {lbl("피치", num(ttsPitch, setTtsPitch, 0, 1, 0.05, "64px"))}
                </>)}
                {row(<>
                  {lbl("선물 최소 💎", num(ttsMinDiamonds, setTtsMinDiamonds, 0, 99999, 1, "72px"))}
                  {chk("팔로우 알림", ttsAnnounceFollow, setTtsAnnounceFollow)}
                  {chk("구독 알림", ttsAnnounceSubscribe, setTtsAnnounceSubscribe)}
                </>)}
                {row(<>
                  {lbl("API 키 (선택)",
                    <input
                      type="text"
                      value={ttsApiKey}
                      onChange={(e) => setTtsApiKey(e.target.value)}
                      placeholder="기본 키 사용 (비워두면 자동)"
                      style={{
                        background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "4px",
                        padding: "4px 8px", color: "#f0f0f5", fontSize: "12px", width: "260px",
                      }}
                    />
                  )}
                  <button
                    onClick={() => {
                      // 테스트 재생
                      const audio = new Audio(buildTTSUrl(
                        "안녕하세요 테스트입니다",
                        ttsLangRef.current, ttsSpeedRef.current, ttsPitchRef.current,
                        ttsGenderRef.current, ttsApiKeyRef.current || GOOGLE_TTS_KEY,
                      ));
                      audio.play().catch(() => {});
                    }}
                    style={{
                      background: "#1a1a2e", border: "1px solid #2a2a3e",
                      borderRadius: "6px", padding: "5px 12px",
                      color: "#00F2EA", fontSize: "12px",
                    }}
                  >
                    ▶ 테스트
                  </button>
                  <button
                    onClick={() => {
                      setEvents([]);
                      setStats({ diamonds: 0, gifts: 0, follows: 0, viewers: 0 });
                    }}
                    style={{
                      background: "transparent", border: "1px solid #3a1a2a",
                      borderRadius: "6px", padding: "5px 12px",
                      color: "#FF6B6B", fontSize: "12px",
                    }}
                  >
                    통계 초기화
                  </button>
                </>)}
              </>
            );
          })()}
        </div>
      )}

      {/* ── 통계 ── */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "8px 10px",
        flexShrink: 0,
        background: "#09090f",
      }}>
        <StatCard emoji="💎" label="다이아" value={fmtNum(stats.diamonds)} color="#00F2EA" />
        <StatCard emoji="🎁" label="선물" value={fmtNum(stats.gifts)} color="#FFD700" />
        <StatCard emoji="❤️" label="팔로우" value={fmtNum(stats.follows)} color="#FF0050" />
        {stats.viewers > 0 && (
          <StatCard emoji="👁" label="시청자" value={fmtNum(stats.viewers)} color="#9B59B6" />
        )}
      </div>

      {/* ── 빈 상태 안내 ── */}
      {status === "disconnected" && events.length === 0 && (
        <div style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "10px", color: "#333",
        }}>
          <div style={{ fontSize: "44px" }}>📡</div>
          <div style={{ fontSize: "14px", color: "#444" }}>룸키를 입력하고 연결하세요</div>
          <div style={{ fontSize: "11px", color: "#2a2a3a" }}>
            데스크탑 앱 → 설정 → 오버레이 → 클라우드 오버레이 룸키
          </div>
        </div>
      )}

      {status === "connecting" && events.length === 0 && (
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#FFD700", fontSize: "13px", gap: "8px",
        }}>
          <span style={{ fontSize: "20px" }}>⏳</span> 연결 중...
        </div>
      )}

      {/* ── 이벤트 피드 ── */}
      {(status === "connected" || events.length > 0) && (
        <div
          ref={feedRef}
          style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}
        >
          {status === "connected" && events.length === 0 && (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#333", fontSize: "13px",
            }}>
              이벤트 대기 중...
            </div>
          )}
          {events.map((ev) => <EventRow key={ev._id} ev={ev} />)}
        </div>
      )}

      {/* ── TTS 차단 배너 (autoplay policy) ── */}
      {ttsBlocked && ttsEnabled && (
        <div
          onClick={() => {
            ttsBlockedRef.current = false;
            setTtsBlocked(false);
            // 클릭 자체가 사용자 제스처 — 바로 큐 재생 시도
            playNextTTS();
          }}
          style={{
            position: "fixed",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a0a0a",
            border: "1px solid #FF605055",
            borderRadius: "8px",
            padding: "9px 18px",
            fontSize: "12px",
            color: "#FF6060",
            cursor: "pointer",
            zIndex: 999,
            animation: "fadeUp 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          🔊 TTS 자동재생이 차단됨 — 클릭하여 활성화
        </div>
      )}

      {/* ── 선물 팝업 ── */}
      <GiftAlert alert={giftAlert} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
