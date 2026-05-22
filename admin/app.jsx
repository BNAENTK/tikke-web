// admin/app.jsx — Tikke admin shell: login, editor layout, save, publish.

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const { FieldRow, isEmptyOverride } = window.AdminEditors;

const DEFAULT_PWD_HASH = "a80573a4be0b3ea80ca027accd4376ad7c863226fddd06bda92816b7dcd1c0b2"; // sha256("tikke2026")
const PWD_HASH_KEY = "tikke_admin_pwd_hash";
const GH_CFG_KEY = "tikke_admin_gh_cfg";
const SESSION_KEY = "tikke_admin_session_v1";
const DRAFT_KEY = "tikke_admin_draft_v1";

const DEFAULT_GH_CFG = {
  owner: "BNAENTK",
  repo: "tikke-website",
  branch: "main",
  path: "content.json",
  token: ""
};

async function sha256(s) {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

/* ============================== LOGIN ============================== */
function Login({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const stored = localStorage.getItem(PWD_HASH_KEY) || DEFAULT_PWD_HASH;
    const h = await sha256(pwd);
    if (h === stored) {
      onLogin();
    } else {
      setErr("비밀번호가 올바르지 않습니다.");
    }
    setBusy(false);
  }

  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={submit}>
        <div className="ad-login-mark"></div>
        <h1 className="ad-login-h">TIKKE Admin</h1>
        <p className="ad-login-sub">사이트 콘텐츠 편집 페이지입니다.</p>

        <div className="ad-login-row">
          <input
            className={"ad-input" + (err ? " error" : "")}
            type="password"
            placeholder="관리자 비밀번호"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoFocus
          />
          <div className="ad-login-err">{err}</div>
        </div>

        <button type="submit" className="ad-btn primary" style={{ width: "100%", justifyContent: "center", padding: "11px" }} disabled={busy || !pwd}>
          {busy ? "확인 중…" : "로그인"}
        </button>

        <div className="ad-login-hint">
          기본 비밀번호는 <code>tikke2026</code> 입니다. 로그인 후 설정에서 변경할 수 있습니다.
        </div>
      </form>
    </div>
  );
}

/* ============================== TOAST ============================== */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={"ad-toast " + (toast.kind || "")}>
      <span className="toast-dot"></span>
      <span>{toast.text}</span>
    </div>
  );
}

/* ============================== MODALS ============================== */
function SettingsModal({ ghCfg, setGhCfg, onClose, toast }) {
  const [tab, setTab] = useState("github");

  // local working copy of GitHub config
  const [cfg, setCfg] = useState(ghCfg);
  const [testBusy, setTestBusy] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // password change
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwd2, setNewPwd2] = useState("");
  const [pwdMsg, setPwdMsg] = useState(null);

  function setField(k, v) { setCfg({ ...cfg, [k]: v }); }

  function saveGh() {
    setGhCfg(cfg);
    toast("GitHub 설정을 저장했습니다.", "success");
  }

  async function test() {
    setTestBusy(true);
    setTestResult(null);
    try {
      const info = await window.tikkeGitHub.verifyToken(cfg);
      setTestResult({ ok: true, msg: `연결 성공: ${info.name} (기본 브랜치 ${info.defaultBranch}${info.private ? ", 비공개" : ""})` });
    } catch (e) {
      setTestResult({ ok: false, msg: e.message || "연결 실패" });
    }
    setTestBusy(false);
  }

  async function changePwd() {
    setPwdMsg(null);
    if (newPwd.length < 6) {
      setPwdMsg({ ok: false, msg: "새 비밀번호는 6자 이상이어야 합니다." });
      return;
    }
    if (newPwd !== newPwd2) {
      setPwdMsg({ ok: false, msg: "새 비밀번호 확인이 일치하지 않습니다." });
      return;
    }
    const stored = localStorage.getItem(PWD_HASH_KEY) || DEFAULT_PWD_HASH;
    const h = await sha256(oldPwd);
    if (h !== stored) {
      setPwdMsg({ ok: false, msg: "기존 비밀번호가 올바르지 않습니다." });
      return;
    }
    const newH = await sha256(newPwd);
    localStorage.setItem(PWD_HASH_KEY, newH);
    setPwdMsg({ ok: true, msg: "비밀번호가 변경되었습니다." });
    setOldPwd(""); setNewPwd(""); setNewPwd2("");
  }

  return (
    <div className="ad-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ad-modal">
        <div className="ad-modal-head">
          <h2 className="ad-modal-h">설정</h2>
          <button className="ad-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="ad-modal-body">
          <div className="ad-tabs">
            <button className={"ad-tab" + (tab === "github" ? " active" : "")} onClick={() => setTab("github")}>GitHub 연동</button>
            <button className={"ad-tab" + (tab === "password" ? " active" : "")} onClick={() => setTab("password")}>비밀번호</button>
            <button className={"ad-tab" + (tab === "help" ? " active" : "")} onClick={() => setTab("help")}>도움말</button>
          </div>

          {tab === "github" && (
            <React.Fragment>
              <div className="ad-callout">
                <b>게시(Publish)</b>를 누르면 GitHub의 <code>content.json</code> 파일에 변경 내용을 커밋합니다. Cloudflare Pages 등과 연동되어 있다면 자동으로 사이트에 반영됩니다.
              </div>

              <div className="ad-form-row">
                <label>저장소 소유자 (owner)</label>
                <input className="ad-input" value={cfg.owner} onChange={(e) => setField("owner", e.target.value)} placeholder="예: BNAENTK" />
              </div>
              <div className="ad-form-row">
                <label>저장소 이름 (repo)</label>
                <input className="ad-input" value={cfg.repo} onChange={(e) => setField("repo", e.target.value)} placeholder="예: tikke-website" />
              </div>
              <div className="ad-form-row">
                <label>브랜치 (branch)</label>
                <input className="ad-input" value={cfg.branch} onChange={(e) => setField("branch", e.target.value)} placeholder="main" />
              </div>
              <div className="ad-form-row">
                <label>파일 경로 (path)</label>
                <input className="ad-input" value={cfg.path} onChange={(e) => setField("path", e.target.value)} placeholder="content.json" />
              </div>
              <div className="ad-form-row">
                <label>Personal Access Token (PAT)</label>
                <input className="ad-input" type="password" value={cfg.token} onChange={(e) => setField("token", e.target.value)} placeholder="ghp_xxx…" autoComplete="off" />
                <div className="ad-form-hint">
                  GitHub → Settings → Developer settings → Personal access tokens에서 <b>Contents: write</b> 권한이 있는 토큰을 발급받아 입력하세요.
                  토큰은 이 브라우저에만 저장됩니다.
                </div>
              </div>

              {testResult && (
                <div className={"ad-callout " + (testResult.ok ? "" : "danger")}>
                  {testResult.msg}
                </div>
              )}
            </React.Fragment>
          )}

          {tab === "password" && (
            <React.Fragment>
              <div className="ad-form-row">
                <label>기존 비밀번호</label>
                <input className="ad-input" type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} autoComplete="current-password" />
              </div>
              <div className="ad-form-row">
                <label>새 비밀번호 (6자 이상)</label>
                <input className="ad-input" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} autoComplete="new-password" />
              </div>
              <div className="ad-form-row">
                <label>새 비밀번호 확인</label>
                <input className="ad-input" type="password" value={newPwd2} onChange={(e) => setNewPwd2(e.target.value)} autoComplete="new-password" />
              </div>
              {pwdMsg && (
                <div className={"ad-callout " + (pwdMsg.ok ? "" : "danger")}>{pwdMsg.msg}</div>
              )}
              <button className="ad-btn primary" onClick={changePwd}>비밀번호 변경</button>
            </React.Fragment>
          )}

          {tab === "help" && (
            <React.Fragment>
              <div className="ad-callout">
                <b>사용 방법</b><br />
                1. 좌측에서 편집할 섹션을 선택합니다.<br />
                2. 상단의 KO / EN / JA / ZH 탭에서 편집할 언어를 고릅니다.<br />
                3. 필드에 새 내용을 입력합니다. 비워두면 기본값(원본)이 사용됩니다.<br />
                4. <b>미리보기</b> 패널로 변경 사항을 실시간으로 확인할 수 있습니다.<br />
                5. <b>임시 저장</b>은 이 브라우저에만 저장, <b>게시</b>는 GitHub에 커밋합니다.
              </div>
              <div className="ad-callout">
                <b>HTML 필드</b>는 <code>&lt;br&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;span class="accent"&gt;</code> 등을 사용할 수 있습니다. 잘못된 HTML을 입력하면 페이지가 깨질 수 있으니 주의하세요.
              </div>
              <div className="ad-callout warn">
                <b>주의</b>: 게시는 GitHub에 커밋되므로 모든 방문자에게 즉시 반영됩니다. 큰 변경은 임시 저장으로 충분히 확인한 뒤 게시하세요.
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="ad-modal-foot">
          {tab === "github" && (
            <React.Fragment>
              <button className="ad-btn ghost" onClick={test} disabled={testBusy || !cfg.token || !cfg.owner || !cfg.repo}>
                {testBusy ? "확인 중…" : "연결 테스트"}
              </button>
              <button className="ad-btn primary" onClick={saveGh}>설정 저장</button>
            </React.Fragment>
          )}
          {tab !== "github" && (
            <button className="ad-btn" onClick={onClose}>닫기</button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, danger, onConfirm, onClose }) {
  return (
    <div className="ad-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ad-modal" style={{ width: "min(440px, 100%)" }}>
        <div className="ad-modal-head">
          <h2 className="ad-modal-h">{title}</h2>
          <button className="ad-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="ad-modal-body">
          <div style={{ fontSize: 13, color: "var(--ad-text-dim)", lineHeight: 1.6 }}>
            {message}
          </div>
        </div>
        <div className="ad-modal-foot">
          <button className="ad-btn" onClick={onClose}>취소</button>
          <button className={"ad-btn " + (danger ? "danger" : "primary")} onClick={() => { onConfirm(); }}>
            {confirmLabel || "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== META ============================== */
const META_SECTION = { id: "meta", label: "메타태그", fields: [] };

const META_CONFIG = [
  { key: "title",               label: "페이지 타이틀 (title)",          type: "text",     hint: "브라우저 탭 · 검색 결과에 표시됩니다." },
  { key: "description",         label: "설명 (description)",            type: "textarea", hint: "검색 엔진 결과 설명. 150–160자 권장." },
  { key: "keywords",            label: "키워드 (keywords)",              type: "text" },
  { key: "og:title",            label: "OG 제목 (og:title)",            type: "text",     hint: "SNS 공유 제목." },
  { key: "og:description",      label: "OG 설명 (og:description)",      type: "textarea" },
  { key: "og:image",            label: "OG 이미지 URL (og:image)",      type: "text",     hint: "SNS 공유 썸네일 URL." },
  { key: "og:url",              label: "OG URL (og:url)",               type: "text",     hint: "정규 URL. 예: https://tikke.kr" },
  { key: "og:type",             label: "OG 타입 (og:type)",             type: "text" },
  { key: "og:site_name",        label: "OG 사이트명 (og:site_name)",    type: "text" },
  { key: "twitter:card",        label: "Twitter 카드",                   type: "text",     hint: "예: summary_large_image" },
  { key: "twitter:title",       label: "Twitter 제목",                   type: "text" },
  { key: "twitter:description", label: "Twitter 설명",                   type: "textarea" },
];

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function parseMetaFromHtml(html) {
  const tags = {};
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) tags["title"] = titleMatch[1];
  const re = /<meta\b([^>]+)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const nameMatch = attrs.match(/(?:name|property)="([^"]+)"/i);
    const contentMatch = attrs.match(/content="([^"]*)"/i);
    if (nameMatch && contentMatch) tags[nameMatch[1]] = contentMatch[1];
  }
  return tags;
}

function applyMetaToHtml(html, fields) {
  let result = html;
  for (const [key, val] of Object.entries(fields)) {
    const safe = val.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    if (key === "title") {
      result = result.replace(/(<title[^>]*>)[^<]*(<\/title>)/i, `$1${safe}$2`);
      continue;
    }
    const ek = escapeRegex(key);
    // name/property before content
    result = result.replace(
      new RegExp(`(<meta\\b[^>]*?(?:name|property)="${ek}"[^>]*?content=")[^"]*(")`,"i"),
      `$1${safe}$2`
    );
    // content before name/property
    result = result.replace(
      new RegExp(`(<meta\\b[^>]*?content=")[^"]*("[^>]*?(?:name|property)="${ek}")`,"i"),
      `$1${safe}$2`
    );
  }
  return result;
}

function MetaDirectEditor({ ghCfg, onToast }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rawHtml, setRawHtml] = useState("");
  const [htmlSha, setHtmlSha] = useState(null);
  const [fields, setFields] = useState({});
  const [error, setError] = useState(null);

  const htmlCfg = { ...ghCfg, path: "index.html" };

  useEffect(() => {
    if (!ghCfg.token) { setLoading(false); return; }
    (async () => {
      try {
        const res = await window.tikkeGitHub.getFile(htmlCfg);
        if (!res.exists) { setError("index.html 파일을 찾을 수 없습니다."); setLoading(false); return; }
        setRawHtml(res.content);
        setHtmlSha(res.sha);
        setFields(parseMetaFromHtml(res.content));
      } catch(e) { setError("불러오기 실패: " + e.message); }
      setLoading(false);
    })();
  }, []);

  function set(key, val) { setFields(f => ({ ...f, [key]: val })); }

  async function save() {
    if (!ghCfg.token) { onToast("GitHub 토큰이 없습니다. 설정에서 입력하세요.", "error"); return; }
    setSaving(true);
    try {
      const updated = applyMetaToHtml(rawHtml, fields);
      await window.tikkeGitHub.putFile(htmlCfg, updated, "Update meta tags via admin", htmlSha);
      setRawHtml(updated);
      const fresh = await window.tikkeGitHub.getFile(htmlCfg);
      if (fresh.exists) setHtmlSha(fresh.sha);
      onToast("메타태그가 저장되었습니다. 사이트에 곧 반영됩니다.", "success");
    } catch(e) { onToast("저장 실패: " + e.message, "error"); }
    setSaving(false);
  }

  if (!ghCfg.token) return (
    <div className="ad-callout warn">GitHub 토큰이 없습니다. ⚙ 설정에서 입력하세요.</div>
  );
  if (loading) return <div className="ad-callout">index.html 불러오는 중…</div>;
  if (error) return <div className="ad-callout" style={{ color: "var(--ad-danger)" }}>{error}</div>;

  return (
    <div>
      {META_CONFIG.map(({ key, label, type, hint }) => (
        <div className="ad-field" key={key}>
          <div className="ad-field-head">
            <span className="ad-field-label">{label}</span>
            <span className="ad-field-key">{key}</span>
          </div>
          {type === "textarea"
            ? <textarea className="ad-input" value={fields[key] ?? ""} rows={3}
                onChange={e => set(key, e.target.value)} />
            : <input type="text" className="ad-input" value={fields[key] ?? ""}
                onChange={e => set(key, e.target.value)} />
          }
          {hint && <div className="ad-field-hint">{hint}</div>}
        </div>
      ))}
      <div style={{ padding: "8px 0 16px" }}>
        <button className="ad-btn primary" onClick={save} disabled={saving} style={{ minWidth: 200 }}>
          {saving ? "저장 중…" : "💾 index.html에 저장 (GitHub 커밋)"}
        </button>
      </div>
    </div>
  );
}

/* ============================== MAIN ============================== */
function AdminApp() {
  // session
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  // overrides state
  const [overrides, setOverrides] = useState({ ko: {}, en: {}, ja: {}, zh: {} });
  const [savedOverrides, setSavedOverrides] = useState(null); // last published snapshot

  // UI state
  const [lang, setLang] = useState("ko");
  const [section, setSection] = useState(window.ADMIN_SCHEMA[0].id);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [toast, setToastState] = useState(null);
  const [ghCfg, setGhCfgState] = useState(() => loadJSON(GH_CFG_KEY, DEFAULT_GH_CFG));
  const [publishing, setPublishing] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);

  const previewIframe = useRef(null);

  function showToast(text, kind) {
    setToastState({ text, kind });
    setTimeout(() => setToastState(null), 3500);
  }
  function setGhCfg(c) {
    setGhCfgState(c);
    saveJSON(GH_CFG_KEY, c);
  }

  // Initial load: fetch content.json, merge with localStorage draft if any
  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;

    (async () => {
      let published = null;
      try {
        const r = await fetch("content.json?v=" + Date.now(), { cache: "no-store" });
        if (r.ok) published = await r.json();
      } catch (e) {}

      const draft = loadJSON(DRAFT_KEY, null);
      const initial = normalize(draft || published || {});

      if (!cancelled) {
        setOverrides(initial);
        setSavedOverrides(normalize(published || {}));
        setBootLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [loggedIn]);

  function normalize(o) {
    return {
      ko: (o && o.ko) || {},
      en: (o && o.en) || {},
      ja: (o && o.ja) || {},
      zh: (o && o.zh) || {}
    };
  }

  // Compute "clean" overrides (drop empty keys)
  const cleanOverrides = useMemo(() => {
    const out = { ko: {}, en: {}, ja: {}, zh: {} };
    for (const L of ["ko", "en", "ja", "zh"]) {
      const dict = overrides[L] || {};
      for (const k of Object.keys(dict)) {
        if (!isEmptyOverride(dict[k])) out[L][k] = dict[k];
      }
    }
    return out;
  }, [overrides]);

  // dirty = differs from savedOverrides
  const dirty = useMemo(() => {
    if (!savedOverrides) return false;
    return JSON.stringify(cleanOverrides) !== JSON.stringify(savedOverrides);
  }, [cleanOverrides, savedOverrides]);

  // edits per section (for sidebar count) — meta excluded (direct HTML edit)
  const editsPerSection = useMemo(() => {
    const counts = {};
    window.ADMIN_SCHEMA.filter(s => s.id !== "meta").forEach((sec) => {
      let n = 0;
      sec.fields.forEach((f) => {
        for (const L of ["ko", "en", "ja", "zh"]) {
          const v = overrides[L] && overrides[L][f.key];
          if (!isEmptyOverride(v)) n += 1;
        }
      });
      counts[sec.id] = n;
    });
    return counts;
  }, [overrides]);

  // Postmessage overrides to preview iframe when they change
  useEffect(() => {
    if (!showPreview) return;
    const iframe = previewIframe.current;
    if (!iframe) return;
    function send() {
      try {
        iframe.contentWindow.postMessage({ type: "tikke-overrides", data: cleanOverrides }, "*");
      } catch (e) {}
    }
    // delay slightly to allow iframe to load
    send();
    const t = setTimeout(send, 400);
    return () => clearTimeout(t);
  }, [cleanOverrides, showPreview]);

  useEffect(() => {
    function onMsg(e) {
      if (e.data && e.data.type === "tikke-preview-ready") {
        const iframe = previewIframe.current;
        if (iframe && e.source === iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: "tikke-overrides", data: cleanOverrides }, "*");
        }
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [cleanOverrides]);

  // beforeunload warning if dirty
  useEffect(() => {
    function warn(e) {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /* ----- actions ----- */
  function setField(key, value) {
    setOverrides((prev) => {
      const next = { ...prev, [lang]: { ...(prev[lang] || {}), [key]: value } };
      return next;
    });
  }
  function resetField(key) {
    setOverrides((prev) => {
      const next = { ...prev, [lang]: { ...(prev[lang] || {}) } };
      delete next[lang][key];
      return next;
    });
  }

  function saveDraft() {
    saveJSON(DRAFT_KEY, cleanOverrides);
    showToast("임시 저장되었습니다 (이 브라우저에만 저장).", "success");
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setOverrides(savedOverrides || { ko: {}, en: {}, ja: {}, zh: {} });
    showToast("임시 저장을 초기화하고 게시된 내용으로 되돌렸습니다.", "success");
    setShowReset(false);
  }

  async function publish() {
    if (!ghCfg.token || !ghCfg.owner || !ghCfg.repo) {
      showToast("먼저 설정에서 GitHub 정보를 입력하세요.", "error");
      setShowSettings(true);
      setShowPublish(false);
      return;
    }
    setPublishing(true);
    try {
      // Get current file (for SHA)
      let sha = null;
      try {
        const existing = await window.tikkeGitHub.getFile(ghCfg);
        if (existing.exists) sha = existing.sha;
      } catch (e) {
        // 404 fine; other errors will surface in put
      }

      const json = JSON.stringify(cleanOverrides, null, 2) + "\n";
      const totalEdits = Object.values(editsPerSection).reduce((a, b) => a + b, 0);
      const message = `Update site content (${totalEdits} field${totalEdits === 1 ? "" : "s"})`;

      await window.tikkeGitHub.putFile(ghCfg, json, message, sha);

      setSavedOverrides(cleanOverrides);
      localStorage.removeItem(DRAFT_KEY);
      showToast("게시되었습니다. 사이트에 곧 반영됩니다.", "success");
      setShowPublish(false);
    } catch (e) {
      showToast("게시 실패: " + (e.message || "알 수 없는 오류"), "error");
    }
    setPublishing(false);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  }

  /* ----- render ----- */
  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setLoggedIn(true);
        }}
      />
    );
  }

  const currentSection = section === "meta"
    ? META_SECTION
    : (window.ADMIN_SCHEMA.find((s) => s.id === section) || window.ADMIN_SCHEMA[0]);
  const langOverrides = overrides[lang] || {};
  const totalEdits = Object.values(editsPerSection).reduce((a, b) => a + b, 0);

  return (
    <div className="ad-shell">
      <header className="ad-topbar">
        <div className="ad-brand">
          <div className="ad-brand-mark"></div>
          <span className="ad-brand-name">TIKKE</span>
          <span className="ad-brand-tag">Admin</span>
        </div>

        <div className="ad-langs">
          {window.ADMIN_LANGS.map((l) => (
            <button
              key={l.code}
              className={"ad-lang-btn" + (lang === l.code ? " active" : "")}
              onClick={() => setLang(l.code)}
              title={l.label}
            >
              <span>{l.flag}</span>
              <span>{l.code.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <div className={"ad-status " + (dirty ? "dirty" : (totalEdits > 0 ? "saved" : ""))}>
          <span className="dot"></span>
          <span>
            {bootLoading ? "불러오는 중…" : (
              dirty
                ? "저장되지 않은 변경"
                : (totalEdits > 0 ? `${totalEdits}개 필드 게시됨` : "변경 사항 없음")
            )}
          </span>
        </div>

        <div className="ad-spacer"></div>

        <button className="ad-btn ghost" onClick={() => setShowPreview((v) => !v)} title="미리보기">
          {showPreview ? "👁 미리보기 닫기" : "👁 미리보기"}
        </button>
        <button className="ad-btn ghost" onClick={() => setShowSettings(true)}>⚙ 설정</button>
        <button className="ad-btn" onClick={saveDraft} disabled={!dirty}>임시 저장</button>
        <button className="ad-btn primary" onClick={() => setShowPublish(true)} disabled={!dirty}>게시</button>
        <button className="ad-btn ghost" onClick={logout} title="로그아웃">⎋</button>
      </header>

      <div className={"ad-main" + (showPreview ? " with-preview" : "")}>
        <aside className="ad-side">
          <div className="ad-side-section">메타태그</div>
          {(() => {
            const metaSec = window.ADMIN_SCHEMA.find(s => s.id === "meta");
            const n = metaSec ? (editsPerSection["meta"] || 0) : 0;
            return (
              <button
                className={"ad-side-item" + (section === "meta" ? " active" : "") + (n > 0 ? " has-edits" : "")}
                onClick={() => setSection("meta")}
              >
                <span>🏷 메타태그 편집</span>
                <span className="ad-side-count">{n}</span>
              </button>
            );
          })()}

          <div className="ad-side-section" style={{ marginTop: 14 }}>섹션</div>
          {window.ADMIN_SCHEMA.filter(s => s.id !== "meta").map((sec) => {
            const n = editsPerSection[sec.id] || 0;
            return (
              <button
                key={sec.id}
                className={"ad-side-item" + (section === sec.id ? " active" : "") + (n > 0 ? " has-edits" : "")}
                onClick={() => setSection(sec.id)}
              >
                <span>{sec.label}</span>
                <span className="ad-side-count">{n}</span>
              </button>
            );
          })}

          <div className="ad-side-section" style={{ marginTop: 14 }}>도구</div>
          <button className="ad-side-item" onClick={() => setShowReset(true)}>
            <span>임시 저장 초기화</span>
          </button>
          <button className="ad-side-item" onClick={() => setShowSettings(true)}>
            <span>설정</span>
          </button>
        </aside>

        <main className="ad-content">
          <div className="ad-section-head">
            <h2 className="ad-section-h">{currentSection.label}</h2>
            <p className="ad-section-sub">
              현재 편집 언어: <b>{window.ADMIN_LANGS.find((l) => l.code === lang).label}</b>
              {" · "}
              필드를 비워두면 기본값(원본)이 사용됩니다.
            </p>
          </div>

          {currentSection.id === "meta"
            ? <MetaDirectEditor ghCfg={ghCfg} onToast={showToast} />
            : currentSection.fields.map((f) => (
                <FieldRow
                  key={f.key}
                  field={f}
                  lang={lang}
                  value={langOverrides[f.key]}
                  onChange={setField}
                  onReset={resetField}
                />
              ))
          }
        </main>

        {showPreview && (
          <aside className="ad-preview">
            <div className="ad-preview-head">
              <span className="dot"></span>
              <span>실시간 미리보기 · /index.html?preview=1</span>
              <span style={{ marginLeft: "auto" }}>
                <button className="ad-btn ghost" style={{ padding: "3px 8px", fontSize: 11 }} onClick={() => {
                  if (previewIframe.current) previewIframe.current.src = previewIframe.current.src;
                }}>새로고침</button>
              </span>
            </div>
            <div className="ad-preview-body">
              <iframe
                ref={previewIframe}
                src="index.html?preview=1"
                title="Tikke preview"
              ></iframe>
            </div>
          </aside>
        )}
      </div>

      {showSettings && (
        <SettingsModal
          ghCfg={ghCfg}
          setGhCfg={setGhCfg}
          onClose={() => setShowSettings(false)}
          toast={showToast}
        />
      )}

      {showPublish && (
        <ConfirmModal
          title="GitHub에 게시"
          message={
            <React.Fragment>
              현재 변경 내용을 GitHub <code>{ghCfg.owner}/{ghCfg.repo}</code> 의 <code>{ghCfg.path}</code> 파일에 커밋합니다.
              <br /><br />
              <b>{Object.values(editsPerSection).reduce((a, b) => a + b, 0)}개</b>의 수정된 필드가 사이트에 반영됩니다.
              <br /><br />
              {publishing && "커밋 중…"}
            </React.Fragment>
          }
          confirmLabel={publishing ? "커밋 중…" : "게시"}
          onConfirm={publish}
          onClose={() => { if (!publishing) setShowPublish(false); }}
        />
      )}

      {showReset && (
        <ConfirmModal
          title="임시 저장 초기화"
          message="저장하지 않은 변경 사항이 모두 사라지고 게시된 내용으로 되돌아갑니다. 계속하시겠습니까?"
          confirmLabel="초기화"
          danger
          onConfirm={clearDraft}
          onClose={() => setShowReset(false)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("ad-root"));
root.render(<AdminApp />);
