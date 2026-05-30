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
      { key: "cta_agency",  label: "에이전시 문의 버튼",         type: "text" }
    ]
  },
  {
    id: "stats",
    label: "통계 (Stats)",
    fields: [
      { key: "stat1n", label: "통계1 숫자 (예: 38)",                  type: "text" },
      { key: "stat1u", label: "통계1 단위 (예: 개 언어)",            type: "text" },
      { key: "stat1l", label: "통계1 라벨 (예: Real-time Translate)", type: "text" },
      { key: "stat2n", label: "통계2 숫자 (예: 20+)",                 type: "text" },
      { key: "stat2u", label: "통계2 단위 (예: 오버레이)",           type: "text" },
      { key: "stat2l", label: "통계2 라벨 (예: On-screen Modules)",   type: "text" },
      { key: "stat3n", label: "통계3 숫자 (예: <3)",                  type: "text" },
      { key: "stat3u", label: "통계3 단위 (예: 분)",                 type: "text" },
      { key: "stat3l", label: "통계3 라벨 (예: Setup → On-air)",      type: "text" }
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

// 메타태그 (언어 공통 한 벌). 저장 형식: { meta: { title, description, keywords, og_image } } → KV.
// 홈 Pages Function(functions/_middleware.js)이 <head>에 서버 주입. 각 필드는 여러 태그로 팬아웃.
window.ADMIN_META_FIELDS = [
  { key: "title",       label: "페이지 제목",            type: "text",
    placeholder: "Tikke — TikTok Live 스트리머를 위한 방송 보조 도구",
    hint: "브라우저 탭 · 검색 결과 · 공유 제목(og·twitter)에 모두 반영됩니다." },
  { key: "description", label: "설명",                   type: "textarea",
    placeholder: "Tikke는 TikTok LIVE에 바로 연결되는 데스크탑 방송 툴킷입니다…",
    hint: "검색 결과 · 공유 설명. 150자 내외 권장." },
  { key: "keywords",    label: "키워드 (keywords)",      type: "textarea",
    placeholder: "Tikke, TikTok LIVE, TikTok LIVE Studio, 방송 툴킷, 채팅 모더레이션, 실시간 번역, 라이브 스트리밍, 오버레이, TTS, 리그 조각컷, 스트리머 도구",
    hint: "검색 키워드. 쉼표(,)로 구분해 입력. 검색엔진용 keywords 태그에 반영." },
  { key: "og_image",    label: "공유 썸네일 이미지 URL", type: "text",
    placeholder: "https://www.tikke.kr/og-image.png",
    hint: "카톡 · 페북 · 트위터 공유 시 보이는 이미지(og:image · twitter:image)." }
];
