// Animated live preview widget for the hero
const { useState, useEffect, useRef } = React;

const CHAT_POOL = [
  { user: "stream_jiwon", msg: "안녕하세요! 처음 들어왔어요 ✨", color: "#00E5FF" },
  { user: "minji_42", msg: "오늘 방송 너무 재밌어요 ㅋㅋㅋ", color: "#FF7AB3" },
  { user: "도현", msg: "what game is this?", translated: "어떤 게임이에요?", color: "#FFC857" },
  { user: "haruki_jp", msg: "こんばんは〜", translated: "안녕하세요~", color: "#00FFA3" },
  { user: "soyeon", msg: "Tikke 진짜 편하다 추천!", color: "#A78BFA" },
  { user: "viewer_2188", msg: "팔로우 하고 갈게요", color: "#6DD5FF" },
  { user: "kpopfan", msg: "🌹 장미 5개 보냄!", gift: true, color: "#FF2D87" },
  { user: "stream_jay", msg: "음질이 정말 좋네요", color: "#00E5FF" },
  { user: "leo_88", msg: "How can I join?", translated: "어떻게 참여할 수 있나요?", color: "#FFC857" },
  { user: "달빛", msg: "오늘도 화이팅!", color: "#FF7AB3" },
];

const AVATARS = [
  "linear-gradient(135deg, #00E5FF, #7C3AED)",
  "linear-gradient(135deg, #FF2D87, #FFC857)",
  "linear-gradient(135deg, #00FFA3, #00E5FF)",
  "linear-gradient(135deg, #7C3AED, #FF2D87)",
  "linear-gradient(135deg, #FFC857, #FF2D87)",
];

function LivePreview() {
  const [viewers, setViewers] = useState(12480);
  const [chat, setChat] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [giftProgress, setGiftProgress] = useState(64);
  const chatIdRef = useRef(0);
  const heartIdRef = useRef(0);

  // Viewer ticker
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 7) - 2);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  // Chat injection
  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      const c = CHAT_POOL[idx % CHAT_POOL.length];
      idx++;
      chatIdRef.current++;
      const id = chatIdRef.current;
      setChat((prev) => {
        const next = [...prev, { ...c, id, avIdx: id % AVATARS.length }];
        return next.slice(-4);
      });
    }, 1700);
    return () => clearInterval(t);
  }, []);

  // Hearts
  useEffect(() => {
    const t = setInterval(() => {
      heartIdRef.current++;
      const id = heartIdRef.current;
      const dx = Math.floor(Math.random() * 60) - 50;
      const hue = ["#FF2D87", "#FFC857", "#00E5FF", "#FF6B9D"][id % 4];
      setHearts((prev) => [...prev.slice(-6), { id, dx, hue }]);
    }, 700);
    return () => clearInterval(t);
  }, []);

  // Gift progress bar
  useEffect(() => {
    const t = setInterval(() => {
      setGiftProgress((p) => {
        const n = p + Math.random() * 6;
        return n > 96 ? 30 : n;
      });
    }, 900);
    return () => clearInterval(t);
  }, []);

  const fmt = (n) => n.toLocaleString("ko-KR");

  return (
    <div className="hero-side">
      <div className="live-card">
        <div className="live-screen">
          <div className="scanlines"></div>

          <div className="live-top">
            <div className="live-tag"><span className="ld"></span>LIVE</div>
            <div className="live-viewers">
              <Icon name="users" size={12} color="#00E5FF" />
              {fmt(viewers)}
            </div>
          </div>

          <div className="live-host">
            <div className="live-avatar"></div>
            <div className="live-host-name">
              <b>@tikke_demo</b>
              <span>· 게임 / 토크</span>
            </div>
            <div className="eq" style={{ marginLeft: 8 }}>
              <span></span><span></span><span></span><span></span>
            </div>
          </div>

          <div className="live-chat">
            {chat.map((c) => (
              <div key={c.id} className={"chat-row" + (c.gift ? " gift" : "") + (c.translated ? " translated" : "")}>
                <div className="chat-av" style={{ background: AVATARS[c.avIdx] }}></div>
                <div className="chat-msg">
                  <b style={{ color: c.color }}>{c.user}</b>
                  <span>{c.msg}</span>
                  {c.translated && (
                    <span className="tr">
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, opacity: 0.7, marginRight: 4 }}>KO ↘</span>
                      {c.translated}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hearts">
            {hearts.map((h) => (
              <span key={h.id} className="heart" style={{ "--dx": h.dx + "px", color: h.hue }}>♥</span>
            ))}
          </div>

          <div className="live-dock">
            <div className="live-input">메시지 입력...</div>
            <div className="live-icons">
              <span className="live-icon" style={{ color: "#FFC857" }}><Icon name="gift" size={14} /></span>
              <span className="live-icon" style={{ color: "#FF2D87" }}><Icon name="heart" size={14} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating panel: chat assist */}
      <div className="panel panel-1">
        <div className="panel-title">
          <span className="ic"><Icon name="translate" size={12} /></span>
          실시간 번역
        </div>
        <div style={{ fontSize: 12, color: "#B6B6C8", lineHeight: 1.5 }}>
          <span style={{ color: "#7A7A90" }}>JP · </span>
          こんばんは<br />
          <span style={{ color: "#00E5FF" }}>↘ 안녕하세요</span>
        </div>
      </div>

      {/* Floating panel: gift goal */}
      <div className="panel panel-2">
        <div className="panel-title">
          <span className="ic"><Icon name="gift" size={12} /></span>
          오늘 선물 목표
        </div>
        <div className="gift-bar">
          <span style={{ fontFamily: "var(--f-mono)" }}>{Math.floor(giftProgress)}%</span>
          <div className="gift-bar-track">
            <div className="gift-bar-fill" style={{ width: giftProgress + "%" }}></div>
          </div>
        </div>
        <div className="panel-row" style={{ marginTop: 8 }}>
          <span>장미</span><b>×312</b>
        </div>
      </div>

      {/* Floating panel: connect */}
      <div className="panel panel-3">
        <div className="panel-title">
          <span className="ic"><Icon name="link" size={12} /></span>
          연결됨
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00FFA3", boxShadow: "0 0 10px #00FFA3"
          }}></span>
          <span style={{ color: "#F4F4FA" }}>TikTok Live</span>
        </div>
        <div style={{ fontSize: 11, color: "#7A7A90", marginTop: 6, fontFamily: "var(--f-mono)" }}>
          PING 42ms · 안정적
        </div>
      </div>
    </div>
  );
}

window.LivePreview = LivePreview;
