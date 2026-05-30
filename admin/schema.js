// admin/schema.js — 어드민에서 편집 가능한 필드 정의 (새 사이버펑크 홈의 i18n 키와 1:1 매핑).
// 저장 형식: { ko:{key:val}, en:{...}, ja:{...}, zh:{...} } → KV → 홈이 런타임 머지.
// type: text | textarea | html(<span>/<a> 등 마크업 허용). 메타태그는 코드에서 관리(편집 대상 아님).

window.ADMIN_SCHEMA = [
  {
    id: "hero",
    label: "히어로 (Hero)",
    fields: [
      { key: "h1a",         label: "메인 타이틀 — 1줄",        type: "text" },
      { key: "h1b",         label: "메인 타이틀 — 2줄 (그라디언트)", type: "text" },
      { key: "sub",         label: "서브 설명",                type: "textarea" },
      { key: "cta_modules", label: "보조 CTA (모듈 탐색)",      type: "text" },
      { key: "cta_agency",  label: "에이전시 문의 버튼",         type: "text" },
      { key: "stat1u",      label: "통계1 단위 (예: 개 언어)",   type: "text" },
      { key: "stat2u",      label: "통계2 단위 (예: 오버레이)",  type: "text" },
      { key: "stat3u",      label: "통계3 단위 (예: 분)",       type: "text" }
    ]
  },
  {
    id: "nav",
    label: "내비게이션 (Nav)",
    fields: [
      { key: "nav_features", label: "기능",            type: "text" },
      { key: "nav_guide",    label: "가이드",          type: "text" },
      { key: "nav_cutoffs",  label: "리그 조각컷 버튼", type: "text" }
    ]
  },
  {
    id: "modules",
    label: "모듈 (5개 섹션)",
    fields: [
      { key: "m1t", label: "01 BROADCAST — 제목", type: "text" },     { key: "m1d", label: "01 — 설명", type: "textarea" },
      { key: "m2t", label: "02 INTELLIGENCE — 제목", type: "text" },  { key: "m2d", label: "02 — 설명", type: "textarea" },
      { key: "m3t", label: "03 ON-SCREEN — 제목", type: "text" },     { key: "m3d", label: "03 — 설명", type: "textarea" },
      { key: "m4t", label: "04 GIFTS·SOUND — 제목", type: "text" },   { key: "m4d", label: "04 — 설명", type: "textarea" },
      { key: "m5t", label: "05 ENGAGE·EXT — 제목", type: "text" },    { key: "m5d", label: "05 — 설명", type: "textarea" }
    ]
  },
  {
    id: "download",
    label: "다운로드 (Deploy)",
    fields: [
      { key: "dep_eyebrow", label: "섹션 라벨",       type: "text" },
      { key: "dep_h2",      label: "타이틀 (HTML)",   type: "html", hint: "&lt;span class=&quot;gradtext&quot;&gt;강조&lt;/span&gt; 사용 가능" },
      { key: "dep_lead",    label: "리드 설명",        type: "textarea" },
      { key: "dep_ver",     label: "버전 줄 (HTML)",  type: "html", hint: "&lt;a href=...&gt;변경 사항&lt;/a&gt; 링크 포함 가능" }
    ]
  },
  {
    id: "footer",
    label: "푸터 (Footer)",
    fields: [
      { key: "foot_tag",     label: "태그라인",         type: "textarea" },
      { key: "foot_product", label: "제품 컬럼 제목",    type: "text" },
      { key: "foot_company", label: "회사 컬럼 제목",    type: "text" },
      { key: "foot_about",   label: "Tikke 소개 링크",  type: "text" },
      { key: "foot_privacy", label: "개인정보처리방침 링크", type: "text" },
      { key: "foot_terms",   label: "이용약관 링크",     type: "text" },
      { key: "foot_contact", label: "문의하기 링크",     type: "text" }
    ]
  }
];

// 편집 언어 (새 홈 i18n 4개국어와 일치)
window.ADMIN_LANGS = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" }
];
