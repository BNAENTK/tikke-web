// All page sections (i18n-aware)
const { useState: useStateS, useEffect: useEffectS } = React;

/* ────────────────────────────────────────────
   TIKKETONE LINK
   ────────────────────────────────────────────
   Tikketone(자매 제품) URL.
   배포되면 이 값만 업데이트하면 모든 링크에 반영됩니다.
*/
const TIKKETONE_URL = "/tikketone/"; // tikke.kr 도메인 내 서브경로 (AdSense 같은 사이트로 포함)

/* ---- GitHub latest release info (version / date / size) ---- */
const GH_REPO = "BNAENTK/tikke-download";
const GH_CACHE_KEY = "tikke_gh_release_v1";
const GH_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function formatDateYMD(iso) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  } catch (e) {
    return null;
  }
}

function formatSizeMB(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  return `${Math.round(mb)} MB`;
}

function pickAssetSize(assets) {
  if (!Array.isArray(assets) || assets.length === 0) return 0;
  // Prefer the Windows installer; fall back to the largest asset.
  const exe = assets.find((a) => /Tikke-?Setup.*\.exe$/i.test(a.name || ""));
  if (exe && exe.size) return exe.size;
  const dmg = assets.find((a) => /\.dmg$/i.test(a.name || ""));
  if (dmg && dmg.size) return dmg.size;
  return assets.reduce((m, a) => Math.max(m, a.size || 0), 0);
}

function useLatestRelease() {
  const [info, setInfo] = React.useState(() => {
    try {
      const raw = localStorage.getItem(GH_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < GH_CACHE_TTL_MS) return parsed.data;
    } catch (e) {}
    return null;
  });

  useEffectS(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${GH_REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" }
    }).
    then((r) => r.ok ? r.json() : Promise.reject(new Error("gh fetch failed"))).
    then((data) => {
      if (cancelled) return;
      const next = {
        version: data.tag_name || data.name || null,
        updated: formatDateYMD(data.published_at || data.created_at),
        size: formatSizeMB(pickAssetSize(data.assets))
      };
      setInfo(next);
      try {
        localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: next }));
      } catch (e) {}
    }).
    catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return info;
}

/* ====================== NAV ====================== */
function Nav() {
  const { t } = useT();
  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand">
          <div className="brand-mark"></div>
          <span className="brand-name">TIKKE</span>
        </div>
        <nav className="nav-links">
          <a href="#features">{t("nav_features")}</a>
          <a href="#preview">{t("nav_preview")}</a>
          <a href="#how">{t("nav_how")}</a>
          <a href="guide/index.html">{t("nav_guide")}</a>
          <a href="#faq">{t("nav_faq")}</a>
          <a
            href={TIKKETONE_URL}
            target={TIKKETONE_URL === "#" ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="nav-tikketone"
            title={TIKKETONE_URL === "#" ? "Tikketone — 곧 공개" : "Tikketone"}>
            <span className="nav-tikketone-dot"></span>
            Tikketone
            {TIKKETONE_URL === "#" && <span className="nav-tikketone-soon">SOON</span>}
          </a>
        </nav>
        <div className="nav-cta">
          <LangSwitcher />
          <a className="btn sm btn-primary" href="#download">
            <Icon name="download" size={14} /> {t("nav_download")}
          </a>
        </div>
      </div>
    </header>);

}

/* ====================== HERO ====================== */
function Hero() {
  const { t } = useT();
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="pill live">
            <span className="dot"></span>
            {t("hero_pill")}
          </div>
          <h1>{t("hero_h1")}</h1>
          <p className="hero-sub">{t("hero_sub")}</p>
          <div className="hero-actions">
            <a className="btn lg btn-primary" href="#download">
              <Icon name="download" size={16} /> {t("hero_cta_download")}
              <span className="arrow"><Icon name="arrow" size={16} color="#001318" /></span>
            </a>
            <a className="btn lg btn-ghost" href="#how">
              <Icon name="play" size={14} /> {t("hero_cta_how")}
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="v">{t("hero_stat1_v")}</div>
              <div className="l">{t("hero_stat1_l")}</div>
            </div>
            <div className="hero-stat">
              <div className="v">{t("hero_stat2_v")}</div>
              <div className="l">{t("hero_stat2_l")}</div>
            </div>
            <div className="hero-stat">
              <div className="v">{t("hero_stat3_v")}</div>
              <div className="l">{t("hero_stat3_l")}</div>
            </div>
          </div>
        </div>
        <LivePreview />
      </div>
    </section>);

}

/* ====================== MARQUEE ====================== */
function Marquee() {
  const { t, lang } = useT();
  const items = t("marquee");
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap" style={{ fontFamily: "\"Space Grotesk\"", lineHeight: "1.5", padding: "22px 0px" }}>
      <div className="marquee" key={lang}>
        {doubled.map((txt, i) =>
        <span key={i} className="item">
            <span className="num">{String(i % items.length + 1).padStart(2, "0")}</span>
            {txt}
            <span className="sep" aria-hidden="true"></span>
          </span>
        )}
      </div>
    </div>);

}

/* ====================== DEMO VIDEO ====================== */
const PROMO_VARIANTS = [
  { key: 'v1', label: 'HOOK',  blurb: '30초 미리보기 · 강한 임팩트',  accent: '#FF0050' },
  { key: 'v2', label: 'STORY', blurb: '비하인드 · 우리가 만든 이유',   accent: '#00F2EA' },
  { key: 'v3', label: 'TOUR',  blurb: '기능 투어 · 자세히 둘러보기',   accent: '#A78BFA' },
];

function DemoVideo() {
  const { t } = useT();
  const [activeKey, setActiveKey] = useStateS('v1');
  const iframeRef = React.useRef(null);

  // Receive active variant updates from iframe
  React.useEffect(() => {
    function onMsg(e) {
      if (!e.data) return;
      if (e.data.type === 'tikke-active' && e.data.key) setActiveKey(e.data.key);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Tell iframe to jump to a variant
  const jumpTo = React.useCallback((key) => {
    setActiveKey(key);
    const w = iframeRef.current && iframeRef.current.contentWindow;
    if (w) {
      try { w.postMessage({ type: 'tikke-jump', key }, '*'); } catch (e) {}
    }
  }, []);

  const activeMeta = PROMO_VARIANTS.find((v) => v.key === activeKey) || PROMO_VARIANTS[0];

  return (
    <section className="video-section" id="demo">
      <div className="container">
        {/* Header: title + chapter badges, OUTSIDE the video card */}
        <div className="promo-header">
          <div className="promo-header-l">
            <div className="promo-eyebrow">
              <span className="promo-dot" style={{ background: activeMeta.accent }}></span>
              <span>{t("video_sub") || "30초 데모"}</span>
            </div>
            <h2 className="promo-title">{t("video_title") || "Tikke가 어떻게 방송을 돕는지 보세요."}</h2>
            <p className="promo-blurb">
              <b style={{ color: activeMeta.accent }}>{activeMeta.label}</b>
              <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
              {activeMeta.blurb}
            </p>
          </div>
          <div className="promo-badges">
            {PROMO_VARIANTS.map((v) => {
              const active = activeKey === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  className={"promo-badge" + (active ? " active" : "")}
                  onClick={() => jumpTo(v.key)}
                  style={active ? { "--c": v.accent } : { "--c": "rgba(255,255,255,0.5)" }}
                >
                  <span className="promo-badge-num">{v.key.toUpperCase()}</span>
                  <span className="promo-badge-label">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video card — no overlays inside */}
        <div className="video-card">
          <iframe
            ref={iframeRef}
            src="promo-loop.html"
            title="Tikke 홍보 영상"
            className="promo-iframe"
            style={{
              position: "absolute",
              top: 16, left: 16, right: 16, bottom: 16,
              width: "calc(100% - 32px)",
              height: "calc(100% - 32px)",
              border: 0,
              borderRadius: 16,
              background: "#0a0a0a"
            }}
            allow="autoplay">
          </iframe>
        </div>
      </div>
    </section>);
}

/* ====================== MOBILE STICKY CTA ====================== */
function StickyCta() {
  const { t } = useT();
  return (
    <div className="sticky-cta" aria-hidden="false">
      <div className="brand-mark"></div>
      <div className="sticky-cta-left">
        <span className="sticky-name">TIKKE</span>
        <span className="sticky-tagline">{t("sticky_tagline")}</span>
      </div>
      <a
        className="btn sm btn-primary"
        href="https://github.com/BNAENTK/tikke-download/releases/latest/download/Tikke-Setup.exe">
        
        <Icon name="download" size={14} /> {t("nav_download")}
      </a>
    </div>);

}

/* ====================== FEATURES ====================== */
function Features() {
  const { t } = useT();
  const days = t("feat_gift_days");

  // 컴팩트 카드들의 카테고리 정의 — 신규 기능은 isNew 표시
  const CATS = [
  {
    key: "features_cat_broadcast",
    items: [
    { icon: "link", h: "feat_connect_h", p: "feat_connect_p", color: "var(--pink)" },
    { icon: "chart", h: "feat_dashboard_h", p: "feat_dashboard_p", color: "var(--green)", isNew: true },
    { icon: "trophy", h: "feat_league_h", p: "feat_league_p", color: "var(--gold)", isNew: true }]

  },
  {
    key: "features_cat_overlay",
    items: [
    { icon: "timer", h: "feat_timer_h", p: "feat_timer_p", color: "var(--cyan)", isNew: true },
    { icon: "crown", h: "feat_topdonor_h", p: "feat_topdonor_p", color: "var(--gold)", isNew: true },
    { icon: "translate", h: "feat_translation_overlay_h", p: "feat_translation_overlay_p", color: "var(--violet)" },
    { icon: "gauge", h: "feat_dbmeter_h", p: "feat_dbmeter_p", color: "var(--pink)", isNew: true }]

  },
  {
    key: "features_cat_content",
    items: [
    { icon: "mic", h: "feat_tts_h", p: "feat_tts_p", color: "var(--gold)" },
    { icon: "music", h: "feat_sound_h", p: "feat_sound_p", color: "var(--green)" },
    { icon: "command", h: "feat_command_h", p: "feat_command_p", color: "var(--violet)" }]

  },
  {
    key: "features_cat_ext",
    items: [
    { icon: "plug", h: "feat_integrations_h", p: "feat_integrations_p", color: "var(--cyan)", isNew: true },
    { icon: "search", h: "feat_gift_browser_h", p: "feat_gift_browser_p", color: "var(--pink)", isNew: true },
    { icon: "mic", h: "feat_tikketone_h", p: "feat_tikketone_p", color: "#A855F7", link: TIKKETONE_URL }]

  }];


  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-eyebrow">
          <Icon name="spark" size={12} /> {t("features_eyebrow")}
        </div>
        <h2 className="section-title">{t("features_title")}</h2>
        <p className="section-lead">{t("features_lead")}</p>

        {/* 1. Featured (rich visuals) — Chat / Translation / Gift / Overlay */}
        <div className="features-grid">
          <div className="feature lg" style={{ "--c": "var(--cyan)" }}>
            <div className="ic"><Icon name="chat" size={20} /></div>
            <h3>{t("feat_chat_h")}</h3>
            <p>{t("feat_chat_p")}</p>
            <div className="visual">
              <div className="visual-chat">
                <div className="row">
                  <span className="av" style={{ background: "linear-gradient(135deg,#00E5FF,#7C3AED)" }}></span>
                  <b style={{ color: "#fff" }}>jiwon</b>
                  <span style={{ color: "#B6B6C8" }}>{t("feat_chat_q1")}</span>
                  <span className="tag">{t("feat_chat_tag_reply")}</span>
                </div>
                <div className="row">
                  <span className="av" style={{ background: "linear-gradient(135deg,#FF2D87,#FFC857)" }}></span>
                  <b style={{ color: "#fff" }}>kpop_fan</b>
                  <span style={{ color: "#B6B6C8" }}>{t("feat_chat_q2")}</span>
                  <span className="tag warn">{t("feat_chat_tag_faq")}</span>
                </div>
                <div className="row">
                  <span className="av" style={{ background: "linear-gradient(135deg,#7C3AED,#FF2D87)" }}></span>
                  <b style={{ color: "#fff" }}>spam_bot_42</b>
                  <span style={{ color: "#7A7A90", textDecoration: "line-through" }}>{t("feat_chat_q3")}</span>
                  <span className="tag bad">{t("feat_chat_tag_block")}</span>
                </div>
                <div className="row">
                  <span className="av" style={{ background: "linear-gradient(135deg,#00FFA3,#00E5FF)" }}></span>
                  <b style={{ color: "#fff" }}>haruki_jp</b>
                  <span style={{ color: "#B6B6C8" }}>{t("feat_chat_q4")}</span>
                  <span className="tag">JP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature lg" style={{ "--c": "var(--violet)" }}>
            <div className="ic"><Icon name="translate" size={20} /></div>
            <h3>{t("feat_trans_h")}</h3>
            <p>{t("feat_trans_p")}</p>
            <div className="visual visual-trans">
              <div className="trans-row">
                <span className="lang">JP → KO/EN</span>
                <span className="src">{t("feat_trans_src1")}</span>
                <span className="dst">{t("feat_trans_dst1")}</span>
              </div>
              <div className="trans-row">
                <span className="lang">{useT().lang === "ja" ? "KO → JA" : "EN → KO/JA"}</span>
                <span className="src">{t("feat_trans_src2")}</span>
                <span className="dst">{t("feat_trans_dst2")}</span>
              </div>
            </div>
          </div>

          <div className="feature lg" style={{ "--c": "var(--pink)" }}>
            <div className="ic"><Icon name="gift" size={20} /></div>
            <h3>{t("feat_gift_h")}</h3>
            <p>{t("feat_gift_p")}</p>
            <div className="visual visual-gifts">
              {[40, 75, 30, 90, 55, 70, 100, 60].map((h, i) =>
              <div className="gift-col" key={i}>
                  <div className="bar" style={{ height: h + "%" }}></div>
                  <div className="l">{days[i]}</div>
                </div>
              )}
            </div>
          </div>

          <div className="feature lg" style={{ "--c": "var(--cyan)" }}>
            <div className="ic"><Icon name="layout" size={20} /></div>
            <h3>{t("feat_overlay_h")}</h3>
            <p>{t("feat_overlay_p")}</p>
            <div className="visual visual-overlay">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, height: "100%" }}>
                <div className="overlay-tile" style={{ gridRow: "span 2" }}>{t("feat_overlay_chat")}<br />380×500</div>
                <div className="overlay-tile">{t("feat_overlay_alert")}<br />340×120</div>
                <div className="overlay-tile" style={{ color: "var(--pink)", borderColor: "rgba(255,45,135,0.4)", background: "rgba(255,45,135,0.05)" }}>{t("feat_overlay_goal")}<br />340×80</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. More features — categorical compact cards */}
        <div className="features-more">
          {CATS.map((cat) =>
          <div className="features-cat-block" key={cat.key}>
              <h4 className="features-cat-label">{t(cat.key)}</h4>
              <div className="features-mini-grid">
                {cat.items.map((it) => {
                  const isLinked = !!it.link;
                  const isComingSoon = isLinked && it.link === "#";
                  const cardProps = isLinked && !isComingSoon ? {
                    href: it.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  } : {};
                  const Tag = isLinked && !isComingSoon ? "a" : "div";
                  return (
                    <Tag
                      className={"feature compact" + (isLinked ? " linked" : "")}
                      key={it.h}
                      style={{ "--c": it.color }}
                      {...cardProps}>
                      <div className="ic"><Icon name={it.icon} size={18} /></div>
                      {it.isNew && <span className="badge-new">NEW</span>}
                      {isComingSoon && <span className="badge-soon">SOON</span>}
                      <h3>
                        {t(it.h)}
                        {it.label && <span className="feature-tag">{it.label}</span>}
                      </h3>
                      <p>{t(it.p)}</p>
                      {isLinked && !isComingSoon && (
                        <span className="feature-arrow">↗</span>
                      )}
                    </Tag>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ====================== APP PREVIEW ====================== */
function AppPreview() {
  const { t } = useT();
  return (
    <section className="section" id="preview">
      <div className="container">
        <div className="section-eyebrow">
          <Icon name="layout" size={12} /> {t("preview_eyebrow")}
        </div>
        <h2 className="section-title">{t("preview_title")}</h2>
        <p className="section-lead">{t("preview_lead")}</p>

        <div className="preview-wrap">
          <div className="preview-grid">
            <div className="preview-window">
              <div className="win-bar">
                <div className="win-dots"><span></span><span></span><span></span></div>
                <div className="win-title">{t("preview_win_title")}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="pill live" style={{ padding: "3px 8px", fontSize: 10 }}>
                    <span className="dot"></span> {t("preview_connected")}
                  </span>
                </div>
              </div>
              <div className="win-body">
                <aside className="app-sidebar">
                  <div className="side-section">{t("preview_side_broadcast")}</div>
                  <div className="side-item active">
                    <Icon name="broadcast" size={14} /> {t("preview_side_dashboard")}
                  </div>
                  <div className="side-item">
                    <Icon name="chat" size={14} /> {t("preview_side_chat")} <span className="badge">128</span>
                  </div>
                  <div className="side-item">
                    <Icon name="gift" size={14} /> {t("preview_side_gifts")}
                  </div>
                  <div className="side-item">
                    <Icon name="users" size={14} /> {t("preview_side_viewers")}
                  </div>
                  <div className="side-section">{t("preview_side_settings")}</div>
                  <div className="side-item">
                    <Icon name="layout" size={14} /> {t("preview_side_overlay")}
                  </div>
                  <div className="side-item">
                    <Icon name="translate" size={14} /> {t("preview_side_translate")}
                  </div>
                  <div className="side-item">
                    <Icon name="settings" size={14} /> {t("preview_side_prefs")}
                  </div>
                </aside>
                <main className="app-main">
                  <div className="app-h">
                    <h4>{t("preview_today")}</h4>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--t-3)" }}>
                      02:14:08
                    </span>
                  </div>
                  <div className="kpi-grid">
                    <div className="kpi accent">
                      <div className="l">{t("preview_kpi_viewers")}</div>
                      <div className="v">12,480</div>
                      <div className="delta up">▲ 8.2%</div>
                    </div>
                    <div className="kpi">
                      <div className="l">{t("preview_kpi_followers")}</div>
                      <div className="v">312</div>
                      <div className="delta up">▲ 12%</div>
                    </div>
                    <div className="kpi">
                      <div className="l">{t("preview_kpi_gifts")}</div>
                      <div className="v">1,940</div>
                      <div className="delta up">▲ 24%</div>
                    </div>
                    <div className="kpi">
                      <div className="l">{t("preview_kpi_dwell")}</div>
                      <div className="v">8:42</div>
                      <div className="delta dn">▼ 0.4%</div>
                    </div>
                  </div>
                  <div className="chart">
                    <svg viewBox="0 0 400 110" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF2D87" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#FF2D87" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[0, 1, 2, 3].map((i) =>
                      <line key={i} x1="0" y1={20 + i * 22} x2="400" y2={20 + i * 22}
                      stroke="rgba(255,255,255,0.05)" />
                      )}
                      <path d="M0,80 C30,72 60,60 90,55 C120,50 150,58 180,45 C210,30 240,38 270,28 C300,18 330,32 360,22 L400,18 L400,110 L0,110 Z" fill="url(#g1)" />
                      <path d="M0,80 C30,72 60,60 90,55 C120,50 150,58 180,45 C210,30 240,38 270,28 C300,18 330,32 360,22 L400,18" stroke="#00E5FF" strokeWidth="1.6" fill="none" />
                      <path d="M0,95 C40,88 70,84 110,80 C150,76 190,70 230,62 C270,54 310,48 350,44 L400,40 L400,110 L0,110 Z" fill="url(#g2)" />
                      <path d="M0,95 C40,88 70,84 110,80 C150,76 190,70 230,62 C270,54 310,48 350,44 L400,40" stroke="#FF2D87" strokeWidth="1.4" fill="none" />
                      <circle cx="360" cy="22" r="4" fill="#00E5FF" />
                      <circle cx="360" cy="22" r="9" fill="#00E5FF" opacity="0.2" />
                    </svg>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--t-3)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 2, background: "#00E5FF", borderRadius: 1 }}></span>
                      {t("preview_chart_legend_viewers")}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 2, background: "#FF2D87", borderRadius: 1 }}></span>
                      {t("preview_chart_legend_gifts")}
                    </span>
                    <span style={{ marginLeft: "auto", fontFamily: "var(--f-mono)" }}>{t("preview_chart_period")}</span>
                  </div>
                </main>
              </div>
            </div>

            {/* Phone */}
            <div className="phone">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div style={{ position: "absolute", top: 38, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontSize: 11, fontFamily: "var(--f-mono)" }}>
                  <span>9:41</span>
                  <span>●●●●</span>
                </div>

                <div style={{ position: "absolute", top: 70, left: 14, right: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="live-tag" style={{ padding: "4px 8px", fontSize: 10 }}>
                    <span className="ld"></span>LIVE
                  </span>
                  <span style={{ background: "rgba(0,0,0,0.5)", color: "#fff", fontFamily: "var(--f-mono)", fontSize: 11, padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Icon name="users" size={11} color="#00E5FF" /> 12.4K
                  </span>
                </div>

                <div style={{ position: "absolute", top: 110, left: 14, right: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#00E5FF,#FF2D87)", border: "2px solid #fff" }}></div>
                  <div style={{ color: "#fff", fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>@tikke_demo</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{t("preview_host_cat")}</div>
                  </div>
                </div>

                <div style={{
                  position: "absolute", top: 200, left: 14, right: 14,
                  padding: "12px 14px", borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(255,45,135,0.6), rgba(124,58,237,0.6))",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  color: "#fff"
                }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--f-mono)", letterSpacing: 0.1, textTransform: "uppercase", opacity: 0.85 }}>
                    🎁 NEW GIFT
                  </div>
                  <div style={{ fontSize: 14, marginTop: 4, fontWeight: 600 }}>
                    kpop_fan → 🌹 ×10
                  </div>
                </div>

                <div style={{
                  position: "absolute", bottom: 90, left: 14, right: 14,
                  display: "flex", flexDirection: "column", gap: 6,
                  fontSize: 11
                }}>
                  {[
                  { u: "minji", m: "🔥🔥🔥", c: "#FF7AB3" },
                  { u: "soyeon", m: "Tikke ✨", c: "#A78BFA" },
                  { u: "haruki", m: "こんばんは〜", c: "#FFC857", t: "👋" }].
                  map((c, i) =>
                  <div key={i} style={{
                    padding: "6px 10px", borderRadius: 12,
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "flex-start", gap: 6
                  }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: AVATARS[i] }}></span>
                      <div>
                        <b style={{ color: c.c, marginRight: 4 }}>{c.u}</b>
                        <span style={{ color: "#fff" }}>{c.m}</span>
                        {c.t &&
                      <div style={{ borderLeft: "2px solid #00E5FF", paddingLeft: 6, marginTop: 2, color: "rgba(167,233,255,0.95)" }}>
                            {c.t}
                          </div>
                      }
                      </div>
                    </div>
                  )}
                </div>

                <div style={{
                  position: "absolute", bottom: 14, left: 14, right: 14,
                  display: "flex", gap: 8, alignItems: "center",
                  padding: "8px 10px",
                  background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14
                }}>
                  <div style={{ flex: 1, height: 26, padding: "0 12px", borderRadius: 999, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", color: "rgba(255,255,255,0.6)", fontSize: 10 }}>
                    ...
                  </div>
                  <span className="live-icon" style={{ color: "#FFC857", width: 26, height: 26 }}><Icon name="gift" size={13} /></span>
                  <span className="live-icon" style={{ color: "#FF2D87", width: 26, height: 26 }}><Icon name="heart" size={13} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ====================== STEPS ====================== */
function Steps() {
  const { t } = useT();
  const steps = t("steps");
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-eyebrow">
          <Icon name="play" size={12} /> {t("steps_eyebrow")}
        </div>
        <h2 className="section-title">{t("steps_title")}</h2>
        <p className="section-lead">{t("steps_lead")}</p>

        <div className="steps">
          {steps.map((s, i) =>
          <div className="step" key={i}>
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <h4>{s.h}</h4>
              <p>{s.p}</p>
              <span className="tag">⏱ {s.t}</span>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ====================== DOWNLOAD ====================== */
function Download() {
  const { t } = useT();
  const release = useLatestRelease();
  const version = release && release.version || "v0.8.2";
  const updated = release && release.updated || "2026.05.12";
  const size = release && release.size || "92 MB";
  return (
    <section className="section" id="download">
      <div className="container">
        <div className="download">
          <div className="download-grid">
            <div>
              <div className="section-eyebrow" style={{ color: "rgb(209, 51, 233)", letterSpacing: "3.3px", lineHeight: "1.5", fontSize: "13px", opacity: "0.99", padding: "1px", margin: "0px 0px 18px", borderStyle: "solid", borderRadius: "128px", borderWidth: "0px", borderColor: "rgb(246, 246, 246)" }}>
                <Icon name="download" size={12} /> {t("download_eyebrow")}
              </div>
              <h2>{t("download_h2")}</h2>
              <p>{t("download_p")}</p>
              <div className="download-actions">
                <a
                  className="btn lg btn-primary"
                  href="https://github.com/BNAENTK/tikke-download/releases/latest/download/Tikke-Setup.exe">
                  
                  <Icon name="download" size={16} /> {t("download_cta")} ({version})
                </a>
              </div>
              <div className="download-meta">
                <span>{t("download_meta_version")} <b>{version}</b></span>
                <span>{t("download_meta_updated")} <b>{updated}</b></span>
                <span>{t("download_meta_size")} <b>{size}</b></span>
                <span>{t("download_meta_os")} <b>Windows · macOS</b></span>
              </div>
            </div>

            <div className="platforms">
              <a className="platform" href="https://github.com/BNAENTK/tikke-download/releases/latest/download/Tikke-Setup.dmg">
                <span className="ic" style={{ color: "#fff" }}><Icon name="apple" size={18} /></span>
                <div className="info">
                  <span className="l">{t("download_platform_mac_l")}</span>
                  <span className="n">{t("download_platform_mac_n")}</span>
                </div>
                <span className="arrow"><Icon name="arrow" size={14} /></span>
              </a>
              <a
                className="platform"
                href="https://github.com/BNAENTK/tikke-download/releases/latest/download/Tikke-Setup.exe">
                
                <span className="ic" style={{ color: "#6DD5FF" }}><Icon name="windows" size={18} /></span>
                <div className="info">
                  <span className="l">{t("download_platform_win_l")}</span>
                  <span className="n">{t("download_platform_win_n")}</span>
                </div>
                <span className="arrow"><Icon name="arrow" size={14} /></span>
              </a>
              <a className="platform" href="#">
                <span className="ic" style={{ color: "#A78BFA" }}><Icon name="spark" size={18} /></span>
                <div className="info">
                  <span className="l">{t("download_platform_changes_l")}</span>
                  <span className="n">{t("download_platform_changes_n")}</span>
                </div>
                <span className="arrow"><Icon name="arrow" size={14} /></span>
              </a>
              <a className="platform" href="#">
                <span className="ic" style={{ color: "#FFC857" }}><Icon name="bell" size={18} /></span>
                <div className="info">
                  <span className="l">{t("download_platform_updates_l")}</span>
                  <span className="n">{t("download_platform_updates_n")}</span>
                </div>
                <span className="arrow"><Icon name="arrow" size={14} /></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ====================== PARTNER ====================== */
function Partner() {
  const { t } = useT();
  return (
    <section className="section" id="partner" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="partner">
          <div className="partner-content">
            <div className="partner-chips">
              <span className="partner-chip" style={{ "--c": "#00E5FF" }}>
                <span className="pdot"></span>{t("partner_chip_creator")}
              </span>
              <span className="partner-chip" style={{ "--c": "#FF2D87" }}>
                <span className="pdot"></span>{t("partner_chip_host")}
              </span>
              <span className="partner-chip" style={{ "--c": "#7C3AED" }}>
                <span className="pdot"></span>{t("partner_chip_agent")}
              </span>
            </div>
            <h3>{t("partner_h")}</h3>
            <p>{t("partner_p")}</p>
          </div>
          <a
            className="btn lg btn-kakao"
            href="https://open.kakao.com/o/sbGTDIYh"
            target="_blank"
            rel="noopener noreferrer">
            
            <Icon name="kakao" size={18} color="#181600" />
            {t("partner_cta")}
            <span className="arrow"><Icon name="arrow" size={16} color="#181600" /></span>
          </a>
        </div>
      </div>
    </section>);

}

/* ====================== FAQ ====================== */
function FAQ() {
  const { t } = useT();
  const [open, setOpen] = useStateS(0);
  const items = t("faq_items");
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-eyebrow">
          <Icon name="spark" size={12} /> {t("faq_eyebrow")}
        </div>
        <h2 className="section-title">{t("faq_title")}</h2>
        <p className="section-lead">{t("faq_lead")}</p>

        <div className="faq-list">
          {items.map((it, i) =>
          <div className={"faq-item" + (open === i ? " open" : "")} key={i}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{it.q}</span>
                <span className="icon-toggle"><Icon name="plus" size={16} /></span>
              </div>
              <div className="faq-a">{it.a}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ====================== FOOTER ====================== */
function Footer() {
  const { t } = useT();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-mark"></div>
              <span className="brand-name">TIKKE</span>
            </div>
            <p>{t("footer_about")}</p>
          </div>
          <div className="footer-col">
            <h5>{t("footer_product")}</h5>
            <a href="#features">{t("footer_link_features")}</a>
            <a href="#preview">{t("footer_link_preview")}</a>
            <a href="#download">{t("footer_link_download")}</a>
            <a href="https://github.com/BNAENTK/tikke-download/releases" target="_blank" rel="noopener noreferrer">{t("footer_link_changes")}</a>
          </div>
          <div className="footer-col">
            <h5>{t("footer_resources")}</h5>
            <a href="guide/index.html">가이드</a>
            <a href="guide/getting-started.html">{t("footer_link_how")}</a>
            <a href="#faq">{t("footer_link_faq")}</a>
            <a href="guide/troubleshooting.html">{t("footer_link_docs")}</a>
          </div>
          <div className="footer-col">
            <h5>{t("footer_community")}</h5>
            <a href="https://open.kakao.com/o/sbGTDIYh" target="_blank" rel="noopener noreferrer">{t("footer_link_kakao")}</a>
            <a href="contact.html">{t("footer_link_contact")}</a>
            <a href="about.html">소개</a>
            <a href="contact.html">{t("footer_link_feedback")}</a>
          </div>
          <div className="footer-col">
            <h5>회사</h5>
            <a href="about.html">Tikke 소개</a>
            <a href="privacy.html">개인정보처리방침</a>
            <a href="terms.html">이용약관</a>
            <a href="contact.html">문의하기</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t("footer_copy")}</span>
          <div className="socials">
            <a href="https://open.kakao.com/o/sbGTDIYh" target="_blank" rel="noopener noreferrer" aria-label="KakaoTalk"><Icon name="kakao" size={14} /></a>
            <a href="#" aria-label="X"><Icon name="x" size={14} /></a>
          </div>
        </div>
      </div>
    </footer>);

}

window.Nav = Nav;
window.Hero = Hero;
window.Marquee = Marquee;
window.DemoVideo = DemoVideo;
window.StickyCta = StickyCta;
window.Features = Features;
window.AppPreview = AppPreview;
window.Steps = Steps;
window.Download = Download;
window.Partner = Partner;
window.FAQ = FAQ;
window.Footer = Footer;