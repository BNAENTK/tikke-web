// admin/schema.js — Defines all editable fields, grouped by section.
// "html" type = rich content that may contain <br>, <em>, <span class="accent">, etc.
// "array_strings" = ordered list of strings (e.g. marquee).
// "array_objects" = ordered list of objects with named subfields (e.g. steps, faq_items).

window.ADMIN_SCHEMA = [
  {
    id: "meta",
    label: "메타태그 (Meta)",
    fields: [
      { key: "meta_title",    label: "페이지 타이틀 (title)",         type: "text",     hint: "브라우저 탭 · 검색 결과에 표시됩니다." },
      { key: "meta_desc",     label: "설명 (description)",           type: "textarea", hint: "검색 엔진 결과 설명. 150–160자 권장." },
      { key: "meta_keywords", label: "키워드 (keywords)",             type: "text" },
      { key: "meta_og_title", label: "OG 제목 (og:title)",           type: "text",     hint: "SNS 공유 제목. 비워두면 meta_title 사용." },
      { key: "meta_og_desc",  label: "OG 설명 (og:description)",     type: "textarea" },
      { key: "meta_og_image", label: "OG 이미지 URL (og:image)",     type: "text",     hint: "SNS 공유 썸네일 URL." },
      { key: "meta_og_url",   label: "OG URL (og:url)",              type: "text",     hint: "정규 URL. 예: https://tikke.kr" },
      { key: "meta_tw_card",  label: "Twitter 카드 (twitter:card)",  type: "text",     hint: "예: summary_large_image" }
    ]
  },

  {
    id: "hero",
    label: "히어로 (Hero)",
    fields: [
      { key: "hero_pill",         label: "상단 배지",            type: "text" },
      { key: "hero_h1",           label: "메인 타이틀",           type: "html", hint: "&lt;br&gt;, &lt;span class=&quot;accent&quot;&gt; 사용 가능" },
      { key: "hero_sub",          label: "서브 설명",            type: "textarea" },
      { key: "hero_cta_download", label: "주요 CTA 버튼",        type: "text" },
      { key: "hero_cta_how",      label: "보조 CTA 버튼",        type: "text" },
      { key: "hero_stat1_v",      label: "통계1 — 숫자",         type: "text" },
      { key: "hero_stat1_l",      label: "통계1 — 라벨",         type: "text" },
      { key: "hero_stat2_v",      label: "통계2 — 숫자",         type: "text" },
      { key: "hero_stat2_l",      label: "통계2 — 라벨",         type: "text" },
      { key: "hero_stat3_v",      label: "통계3 — 숫자",         type: "text" },
      { key: "hero_stat3_l",      label: "통계3 — 라벨",         type: "text" }
    ]
  },

  {
    id: "nav",
    label: "내비게이션 (Nav)",
    fields: [
      { key: "nav_features", label: "기능",      type: "text" },
      { key: "nav_preview",  label: "미리보기",   type: "text" },
      { key: "nav_how",      label: "사용법",    type: "text" },
      { key: "nav_faq",      label: "FAQ",      type: "text" },
      { key: "nav_download", label: "다운로드",   type: "text" }
    ]
  },

  {
    id: "marquee",
    label: "마퀴 (스크롤 배너)",
    fields: [
      { key: "marquee", label: "마퀴 항목 목록", type: "array_strings" }
    ]
  },

  {
    id: "features",
    label: "기능 (Features)",
    fields: [
      { key: "features_eyebrow", label: "섹션 라벨",          type: "text" },
      { key: "features_title",   label: "섹션 타이틀",        type: "html", hint: "&lt;em&gt;강조&lt;/em&gt; 사용 가능" },
      { key: "features_lead",    label: "리드 설명",          type: "textarea" },

      { key: "feat_chat_h",     label: "1. 스마트 채팅 — 제목",   type: "text" },
      { key: "feat_chat_p",     label: "1. 스마트 채팅 — 설명",   type: "textarea" },
      { key: "feat_trans_h",    label: "2. 실시간 번역 — 제목",  type: "text" },
      { key: "feat_trans_p",    label: "2. 실시간 번역 — 설명",  type: "textarea" },
      { key: "feat_connect_h",  label: "3. 원클릭 연결 — 제목",  type: "text" },
      { key: "feat_connect_p",  label: "3. 원클릭 연결 — 설명",  type: "textarea" },
      { key: "feat_gift_h",     label: "4. 선물 알림 — 제목",    type: "text" },
      { key: "feat_gift_p",     label: "4. 선물 알림 — 설명",    type: "textarea" },
      { key: "feat_overlay_h",  label: "5. 오버레이 — 제목",     type: "text" },
      { key: "feat_overlay_p",  label: "5. 오버레이 — 설명",     type: "textarea" },
      { key: "feat_sound_h",    label: "6. 사운드 — 제목",       type: "text" },
      { key: "feat_sound_p",    label: "6. 사운드 — 설명",       type: "textarea" },
      { key: "feat_tts_h",      label: "7. TTS — 제목",         type: "text" },
      { key: "feat_tts_p",      label: "7. TTS — 설명",         type: "textarea" },
      { key: "feat_command_h",  label: "8. 챗 명령어 — 제목",    type: "text" },
      { key: "feat_command_p",  label: "8. 챗 명령어 — 설명",    type: "textarea" },

      { key: "feat_chat_tag_reply", label: "채팅 데모 — 답장 태그",   type: "text" },
      { key: "feat_chat_tag_faq",   label: "채팅 데모 — FAQ 태그",   type: "text" },
      { key: "feat_chat_tag_block", label: "채팅 데모 — 차단 태그",   type: "text" },
      { key: "feat_chat_q1",        label: "채팅 데모 — 메시지 1",   type: "text" },
      { key: "feat_chat_q2",        label: "채팅 데모 — 메시지 2",   type: "text" },
      { key: "feat_chat_q3",        label: "채팅 데모 — 메시지 3",   type: "text" },
      { key: "feat_chat_q4",        label: "채팅 데모 — 메시지 4",   type: "text" },

      { key: "feat_trans_src1", label: "번역 데모 — 원문 1",     type: "text" },
      { key: "feat_trans_dst1", label: "번역 데모 — 번역 1",     type: "text" },
      { key: "feat_trans_src2", label: "번역 데모 — 원문 2",     type: "text" },
      { key: "feat_trans_dst2", label: "번역 데모 — 번역 2",     type: "text" },

      { key: "feat_overlay_chat",  label: "오버레이 — 채팅 라벨",  type: "text" },
      { key: "feat_overlay_alert", label: "오버레이 — 알림 라벨",  type: "text" },
      { key: "feat_overlay_goal",  label: "오버레이 — 목표 라벨",  type: "text" },

      { key: "feat_gift_days", label: "선물 차트 요일 (8개)", type: "array_strings", maxLen: 8 }
    ]
  },

  {
    id: "preview",
    label: "앱 미리보기 (Preview)",
    fields: [
      { key: "preview_eyebrow",      label: "섹션 라벨",       type: "text" },
      { key: "preview_title",        label: "섹션 타이틀",     type: "html" },
      { key: "preview_lead",         label: "리드 설명",       type: "textarea" },
      { key: "preview_win_title",    label: "윈도우 제목",     type: "text" },
      { key: "preview_connected",    label: "연결 상태 라벨",  type: "text" },
      { key: "preview_side_broadcast", label: "사이드 — 방송",     type: "text" },
      { key: "preview_side_settings",  label: "사이드 — 설정",     type: "text" },
      { key: "preview_side_dashboard", label: "사이드 — 대시보드",  type: "text" },
      { key: "preview_side_chat",      label: "사이드 — 채팅",      type: "text" },
      { key: "preview_side_gifts",     label: "사이드 — 선물",      type: "text" },
      { key: "preview_side_viewers",   label: "사이드 — 시청자",    type: "text" },
      { key: "preview_side_overlay",   label: "사이드 — 오버레이",   type: "text" },
      { key: "preview_side_translate", label: "사이드 — 번역",      type: "text" },
      { key: "preview_side_prefs",     label: "사이드 — 환경설정",   type: "text" },
      { key: "preview_today",          label: "오늘의 방송 라벨",   type: "text" },
      { key: "preview_kpi_viewers",    label: "KPI — 시청자",      type: "text" },
      { key: "preview_kpi_followers",  label: "KPI — 신규 팔로우",  type: "text" },
      { key: "preview_kpi_gifts",      label: "KPI — 선물",        type: "text" },
      { key: "preview_kpi_dwell",      label: "KPI — 평균 체류",    type: "text" },
      { key: "preview_chart_legend_viewers", label: "차트 범례 — 시청자", type: "text" },
      { key: "preview_chart_legend_gifts",   label: "차트 범례 — 선물",   type: "text" },
      { key: "preview_chart_period",   label: "차트 기간",        type: "text" },
      { key: "preview_host_cat",       label: "호스트 카테고리",    type: "text" }
    ]
  },

  {
    id: "steps",
    label: "사용 방법 (Steps)",
    fields: [
      { key: "steps_eyebrow", label: "섹션 라벨",   type: "text" },
      { key: "steps_title",   label: "섹션 타이틀", type: "html" },
      { key: "steps_lead",    label: "리드 설명",   type: "textarea" },
      {
        key: "steps",
        label: "단계 목록",
        type: "array_objects",
        shape: [
          { key: "h", label: "단계 제목",   type: "text" },
          { key: "p", label: "단계 설명",   type: "textarea" },
          { key: "t", label: "소요 시간",   type: "text" }
        ]
      }
    ]
  },

  {
    id: "download",
    label: "다운로드 (Download)",
    fields: [
      { key: "download_eyebrow", label: "섹션 라벨",       type: "text" },
      { key: "download_h2",      label: "섹션 타이틀",     type: "html" },
      { key: "download_p",       label: "설명",           type: "textarea" },
      { key: "download_cta",     label: "다운로드 버튼",   type: "text", hint: "버튼 옆에 자동으로 (vX.X.X) 버전이 붙습니다" },
      { key: "download_meta_version", label: "메타 — 버전 라벨",      type: "text" },
      { key: "download_meta_updated", label: "메타 — 업데이트 라벨",   type: "text" },
      { key: "download_meta_size",    label: "메타 — 크기 라벨",       type: "text" },
      { key: "download_meta_os",      label: "메타 — 지원 OS 라벨",    type: "text" },
      { key: "download_platform_mac_l",     label: "플랫폼 — macOS 라벨",     type: "text" },
      { key: "download_platform_mac_n",     label: "플랫폼 — macOS 설명",     type: "text" },
      { key: "download_platform_win_l",     label: "플랫폼 — Windows 라벨",   type: "text" },
      { key: "download_platform_win_n",     label: "플랫폼 — Windows 설명",   type: "text" },
      { key: "download_platform_changes_l", label: "플랫폼 — 변경사항 라벨",  type: "text" },
      { key: "download_platform_changes_n", label: "플랫폼 — 변경사항 설명",  type: "text" },
      { key: "download_platform_updates_l", label: "플랫폼 — 업데이트 라벨",  type: "text" },
      { key: "download_platform_updates_n", label: "플랫폼 — 업데이트 설명",  type: "text" }
    ]
  },

  {
    id: "partner",
    label: "파트너 (Partner)",
    fields: [
      { key: "partner_chip_creator", label: "칩 — 크리에이터",  type: "text" },
      { key: "partner_chip_host",    label: "칩 — 호스트",       type: "text" },
      { key: "partner_chip_agent",   label: "칩 — 에이전트",     type: "text" },
      { key: "partner_h",            label: "헤드라인",          type: "textarea" },
      { key: "partner_p",            label: "본문",              type: "textarea" },
      { key: "partner_cta",          label: "CTA 버튼",          type: "text" }
    ]
  },

  {
    id: "faq",
    label: "FAQ",
    fields: [
      { key: "faq_eyebrow", label: "섹션 라벨",   type: "text" },
      { key: "faq_title",   label: "섹션 타이틀", type: "html" },
      { key: "faq_lead",    label: "리드 설명",   type: "textarea" },
      {
        key: "faq_items",
        label: "FAQ 항목",
        type: "array_objects",
        shape: [
          { key: "q", label: "질문", type: "text" },
          { key: "a", label: "답변", type: "textarea" }
        ]
      }
    ]
  },

  {
    id: "video",
    label: "데모 영상 (Demo)",
    fields: [
      { key: "video_sub",     label: "상단 라벨",   type: "text" },
      { key: "video_title",   label: "타이틀",     type: "textarea" },
      { key: "video_pill",    label: "배지 텍스트", type: "text" },
      { key: "video_ch1",     label: "챕터 1",    type: "text" },
      { key: "video_ch2",     label: "챕터 2",    type: "text" },
      { key: "video_ch3",     label: "챕터 3",    type: "text" },
      { key: "video_ch4",     label: "챕터 4",    type: "text" },
      { key: "video_caption", label: "재생 캡션",  type: "text" },
      { key: "video_play",    label: "재생 버튼 (a11y)", type: "text" }
    ]
  },

  {
    id: "sticky",
    label: "고정 CTA",
    fields: [
      { key: "sticky_tagline", label: "고정 CTA 문구", type: "text" }
    ]
  },

  {
    id: "footer",
    label: "푸터 (Footer)",
    fields: [
      { key: "footer_about",         label: "푸터 소개문",          type: "textarea" },
      { key: "footer_product",       label: "그룹 — Product 라벨",  type: "text" },
      { key: "footer_resources",     label: "그룹 — Resources 라벨", type: "text" },
      { key: "footer_community",     label: "그룹 — Community 라벨", type: "text" },
      { key: "footer_link_features", label: "링크 — 기능",          type: "text" },
      { key: "footer_link_preview",  label: "링크 — 앱 미리보기",   type: "text" },
      { key: "footer_link_download", label: "링크 — 다운로드",      type: "text" },
      { key: "footer_link_changes",  label: "링크 — 변경 사항",     type: "text" },
      { key: "footer_link_how",      label: "링크 — 사용 방법",     type: "text" },
      { key: "footer_link_faq",      label: "링크 — FAQ",          type: "text" },
      { key: "footer_link_docs",     label: "링크 — 문서",         type: "text" },
      { key: "footer_link_shortcuts",label: "링크 — 단축키",        type: "text" },
      { key: "footer_link_kakao",    label: "링크 — 카카오톡",      type: "text" },
      { key: "footer_link_contact",  label: "링크 — 문의하기",      type: "text" },
      { key: "footer_link_feedback", label: "링크 — 피드백",        type: "text" },
      { key: "footer_link_notice",   label: "링크 — 공지사항",      type: "text" },
      { key: "footer_copy",          label: "저작권 표기",          type: "text" }
    ]
  }
];

window.ADMIN_LANGS = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語",  flag: "🇯🇵" },
  { code: "zh", label: "中文",    flag: "🇨🇳" }
];
