// admin/editors.jsx — Field editor components.

const { useState: useStateEd, useEffect: useEffectEd } = React;

/* ---------- helpers ---------- */
function defaultValueFor(lang, key) {
  const dict = (window.I18N && window.I18N[lang]) || {};
  return dict[key];
}

function defaultAsHtmlOrText(v) {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) {
    return v.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" / ");
  }
  if (React.isValidElement(v)) {
    try {
      return window.ReactDOMServer.renderToStaticMarkup(v);
    } catch (e) {
      return "";
    }
  }
  return String(v);
}

function isEmptyOverride(v) {
  if (v == null) return true;
  if (typeof v === "string") return v === "";
  if (Array.isArray(v)) {
    if (v.length === 0) return true;
    return v.every((item) => {
      if (typeof item === "string") return item === "";
      if (item && typeof item === "object") {
        return Object.values(item).every((s) => s === "" || s == null);
      }
      return false;
    });
  }
  return false;
}

/* ---------- TEXT / TEXTAREA / HTML ---------- */
function TextEditor({ field, value, defaultValue, onChange }) {
  const isHtml = field.type === "html";
  const multiline = field.type === "textarea" || field.type === "html";
  const placeholder = defaultAsHtmlOrText(defaultValue);

  if (multiline) {
    return (
      <textarea
        className={"ad-input" + (isHtml ? " html-input" : "")}
        value={value || ""}
        placeholder={placeholder}
        onChange={(ev) => onChange(ev.target.value)}
        rows={isHtml ? 4 : 3}
      />
    );
  }
  return (
    <input
      type="text"
      className="ad-input"
      value={value || ""}
      placeholder={placeholder}
      onChange={(ev) => onChange(ev.target.value)}
    />
  );
}

/* ---------- ARRAY OF STRINGS (marquee, feat_gift_days) ---------- */
function ArrayStringsEditor({ field, value, defaultValue, onChange }) {
  const effective = (Array.isArray(value) && value.length > 0 ? value : defaultValue) || [];
  const items = Array.isArray(value) && value.length > 0 ? value : [...effective];

  function update(newItems) {
    onChange(newItems);
  }
  function setAt(i, v) {
    const next = [...items];
    next[i] = v;
    update(next);
  }
  function move(i, dir) {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }
  function remove(i) {
    const next = items.filter((_, idx) => idx !== i);
    update(next);
  }
  function add() {
    const next = [...items, ""];
    update(next);
  }

  const max = field.maxLen || 50;

  return (
    <div className="ad-array">
      {items.map((s, i) => (
        <div className="ad-array-item" key={i}>
          <div className="ad-array-num">{String(i + 1).padStart(2, "0")}</div>
          <input
            type="text"
            className="ad-input"
            value={s || ""}
            placeholder={defaultValue && defaultValue[i] ? String(defaultValue[i]) : ""}
            onChange={(ev) => setAt(i, ev.target.value)}
            style={{ flex: 1 }}
          />
          <div className="ad-array-controls">
            <button className="ad-array-icon-btn" disabled={i === 0} onClick={() => move(i, -1)} title="위로">↑</button>
            <button className="ad-array-icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} title="아래로">↓</button>
            <button className="ad-array-icon-btn" onClick={() => remove(i)} title="삭제">✕</button>
          </div>
        </div>
      ))}
      {items.length < max && (
        <button className="ad-array-add" onClick={add}>+ 항목 추가</button>
      )}
    </div>
  );
}

/* ---------- ARRAY OF OBJECTS (steps, faq_items) ---------- */
function ArrayObjectsEditor({ field, value, defaultValue, onChange }) {
  const items = Array.isArray(value) && value.length > 0 ? value : (defaultValue || []).map((d) => ({ ...d }));

  function update(newItems) {
    onChange(newItems);
  }
  function setSub(i, k, v) {
    const next = items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it));
    update(next);
  }
  function move(i, dir) {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }
  function remove(i) {
    update(items.filter((_, idx) => idx !== i));
  }
  function add() {
    const blank = {};
    (field.shape || []).forEach((s) => { blank[s.key] = ""; });
    update([...items, blank]);
  }

  return (
    <div className="ad-array">
      {items.map((it, i) => (
        <div className="ad-array-item object" key={i}>
          <div className="ad-array-obj-head">
            <span className="ad-array-obj-title">#{i + 1}</span>
            <div className="ad-array-controls">
              <button className="ad-array-icon-btn" disabled={i === 0} onClick={() => move(i, -1)} title="위로">↑</button>
              <button className="ad-array-icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} title="아래로">↓</button>
              <button className="ad-array-icon-btn" onClick={() => remove(i)} title="삭제">✕</button>
            </div>
          </div>
          {(field.shape || []).map((s) => {
            const def = (defaultValue && defaultValue[i] && defaultValue[i][s.key]) || "";
            return (
              <div className="ad-sub-field" key={s.key}>
                <label className="ad-sub-label">{s.label}</label>
                {s.type === "textarea" ? (
                  <textarea
                    className="ad-input"
                    value={it[s.key] || ""}
                    placeholder={def}
                    onChange={(ev) => setSub(i, s.key, ev.target.value)}
                    rows={3}
                  />
                ) : (
                  <input
                    type="text"
                    className="ad-input"
                    value={it[s.key] || ""}
                    placeholder={def}
                    onChange={(ev) => setSub(i, s.key, ev.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button className="ad-array-add" onClick={add}>+ 항목 추가</button>
    </div>
  );
}

/* ---------- FIELD WRAPPER ---------- */
function FieldRow({ field, lang, value, onChange, onReset }) {
  const defaultValue = defaultValueFor(lang, field.key);
  const hasOverride = !isEmptyOverride(value);

  function handleChange(newVal) {
    onChange(field.key, newVal);
  }

  const editor = (() => {
    if (field.type === "array_strings") {
      return (
        <ArrayStringsEditor
          field={field}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    }
    if (field.type === "array_objects") {
      return (
        <ArrayObjectsEditor
          field={field}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    }
    return (
      <TextEditor
        field={field}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
    );
  })();

  return (
    <div className="ad-field">
      <div className="ad-field-head">
        <span className="ad-field-label">{field.label}</span>
        <span className="ad-field-key">{field.key}</span>
        {hasOverride && <span className="ad-field-mod">수정됨</span>}
        {hasOverride && (
          <button className="ad-field-reset" onClick={() => onReset(field.key)}>
            기본값으로 되돌리기
          </button>
        )}
      </div>
      {editor}
      {field.hint && (
        <div className="ad-field-hint" dangerouslySetInnerHTML={{ __html: field.hint }} />
      )}
    </div>
  );
}

window.AdminEditors = {
  FieldRow,
  TextEditor,
  ArrayStringsEditor,
  ArrayObjectsEditor,
  isEmptyOverride,
  defaultValueFor,
  defaultAsHtmlOrText
};
