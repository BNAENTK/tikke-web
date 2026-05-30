// 홈·어드민 공용 i18n 기본값 (단일 출처). index.html(DICT)과 admin(placeholder 기본값)이 둘 다 로드.
// 키는 새 사이버펑크 홈 + 어드민 schema.js와 1:1. 값 수정 시 홈·어드민 placeholder 동시 반영.
window.I18N = {
  ko:{
    nav_features:"기능", nav_guide:"가이드", nav_cutoffs:"🏆 리그 조각컷",
    h1a:"라이브 방송,", h1b:"완전 장악.",
    sub:"TikTok LIVE에 직결되는 데스크톱 관제 센터. 채팅·번역·선물·오버레이부터 리그 조각컷·흥미도 분석·코호스트 AI까지 — 모든 모듈을 한 화면에서 지휘.",
    cta_modules:"모듈 탐색", cta_agency:"💬 에이전시 가입 문의",
    stat1u:"개 언어", stat2u:"오버레이", stat3u:"분",
    foot_tag:"TikTok LIVE 스트리머를 위한 데스크톱 방송 툴킷. 채팅·선물·사운드·TTS·오버레이를 한 화면에서.",
    foot_product:"제품", foot_company:"회사",
    foot_features:"기능", foot_cutoffs:"리그 조각컷", foot_guide:"가이드", foot_download:"다운로드",
    foot_about:"Tikke 소개", foot_privacy:"개인정보처리방침", foot_terms:"이용약관", foot_contact:"문의하기",
    dep_eyebrow:"DEPLOY // 다운로드",
    dep_h2:'지금 바로 <span class="gradtext">관제를 시작</span>하세요.',
    dep_lead:"설치 후 3분이면, 방송이 달라집니다. 데스크톱에서, 바로.",
    dep_ver:'최신 버전 v1.8.46 · <a href="https://github.com/BNAENTK/tikke-download/releases">변경 사항</a>'
  },
  en:{
    nav_features:"Features", nav_guide:"Guide", nav_cutoffs:"🏆 League Cutoffs",
    h1a:"Master your", h1b:"live broadcast.",
    sub:"A desktop control center wired straight into TikTok LIVE. Chat, translation, gifts and overlays — plus league cutoffs, interest analytics and a cohost AI — command every module from one screen.",
    cta_modules:"Explore Modules", cta_agency:"💬 Agency Inquiry",
    stat1u:" languages", stat2u:" overlays", stat3u:" min",
    foot_tag:"A desktop broadcast toolkit for TikTok LIVE streamers. Chat, gifts, sound, TTS and overlays — all on one screen.",
    foot_product:"Product", foot_company:"Company",
    foot_features:"Features", foot_cutoffs:"League Cutoffs", foot_guide:"Guide", foot_download:"Download",
    foot_about:"About Tikke", foot_privacy:"Privacy Policy", foot_terms:"Terms of Service", foot_contact:"Contact",
    dep_eyebrow:"DEPLOY // DOWNLOAD",
    dep_h2:'Start your <span class="gradtext">command center</span> now.',
    dep_lead:"Three minutes after install, your broadcast is different. Right on your desktop.",
    dep_ver:'Latest v1.8.46 · <a href="https://github.com/BNAENTK/tikke-download/releases">Changelog</a>'
  },
  ja:{
    nav_features:"機能", nav_guide:"ガイド", nav_cutoffs:"🏆 リーグカット",
    h1a:"ライブ配信を、", h1b:"完全掌握。",
    sub:"TikTok LIVEに直結するデスクトップ管制センター。チャット・翻訳・ギフト・オーバーレイから、リーグカット・興味度分析・コホストAIまで — すべてのモジュールを一画面で指揮。",
    cta_modules:"モジュール一覧", cta_agency:"💬 代理店のお問い合わせ",
    stat1u:"言語", stat2u:"オーバーレイ", stat3u:"分",
    foot_tag:"TikTok LIVE配信者のためのデスクトップ放送ツールキット。チャット・ギフト・サウンド・TTS・オーバーレイを一画面で。",
    foot_product:"製品", foot_company:"会社",
    foot_features:"機能", foot_cutoffs:"リーグカット", foot_guide:"ガイド", foot_download:"ダウンロード",
    foot_about:"Tikkeについて", foot_privacy:"プライバシーポリシー", foot_terms:"利用規約", foot_contact:"お問い合わせ",
    dep_eyebrow:"DEPLOY // ダウンロード",
    dep_h2:'今すぐ<span class="gradtext">管制を開始</span>。',
    dep_lead:"インストール後3分で、配信が変わる。デスクトップで、すぐに。",
    dep_ver:'最新版 v1.8.46 · <a href="https://github.com/BNAENTK/tikke-download/releases">変更履歴</a>'
  },
  zh:{
    nav_features:"功能", nav_guide:"指南", nav_cutoffs:"🏆 段位分数线",
    h1a:"直播，", h1b:"完全掌控。",
    sub:"直连 TikTok LIVE 的桌面控制中心。聊天、翻译、礼物、悬浮层，到段位分数线、兴趣度分析、副播 AI — 一屏掌控所有模块。",
    cta_modules:"探索模块", cta_agency:"💬 代理加盟咨询",
    stat1u:"种语言", stat2u:"悬浮层", stat3u:"分钟",
    foot_tag:"为 TikTok LIVE 主播打造的桌面直播工具包。聊天、礼物、音效、TTS、悬浮层 — 集于一屏。",
    foot_product:"产品", foot_company:"公司",
    foot_features:"功能", foot_cutoffs:"段位分数线", foot_guide:"指南", foot_download:"下载",
    foot_about:"关于 Tikke", foot_privacy:"隐私政策", foot_terms:"服务条款", foot_contact:"联系我们",
    dep_eyebrow:"DEPLOY // 下载",
    dep_h2:'立即<span class="gradtext">开始管控</span>。',
    dep_lead:"安装后三分钟，直播焕然一新。就在桌面上。",
    dep_ver:'最新版本 v1.8.46 · <a href="https://github.com/BNAENTK/tikke-download/releases">更新日志</a>'
  }
};
Object.assign(window.I18N.ko,{
  m1t:"라이브 관제", m1d:"연결 한 번으로 흥미도·리그·룸 상태를 실시간 장악. 방송 중 무슨 일이 벌어지는지 한 화면에서 읽는다.",
  m2t:"대화 · 번역 · AI", m2d:"언어 장벽도, 반복 응대도 — 시청자와의 모든 대화를 Tikke가 통역하고 자동화한다.",
  m3t:"화면 송출", m3d:"방송 화면 위에 띄우는 모든 것. 드래그 한 번으로 TikTok LIVE Studio에 연결된다.",
  m4t:"선물 · 사운드", m4d:"선물 하나하나에 소리와 반응을. 시청자의 후원이 방송 안에서 살아난다.",
  m5t:"단골 · 통합", m5d:"한 번 온 시청자를 단골로, 그리고 쓰던 도구와 매끄럽게 연결."
});
Object.assign(window.I18N.en,{
  m1t:"Broadcast Control", m1d:"Capture interest, league and room status in real time with one connection. Read everything happening during your broadcast from a single screen.",
  m2t:"Chat · Translation · AI", m2d:"Language barriers and repetitive replies — Tikke translates and automates every conversation with your viewers.",
  m3t:"On-Screen", m3d:"Everything you put on your broadcast screen. Connect to TikTok LIVE Studio with a single drag.",
  m4t:"Gifts · Sound", m4d:"Sound and reaction for every gift. Your viewers' support comes alive inside the broadcast.",
  m5t:"Regulars · Integration", m5d:"Turn one-time viewers into regulars, and connect seamlessly with the tools you already use."
});
Object.assign(window.I18N.ja,{
  m1t:"配信管制", m1d:"ワンクリック接続で興味度・リーグ・ルーム状況をリアルタイムに掌握。配信中に何が起きているかを一画面で読む。",
  m2t:"会話・翻訳・AI", m2d:"言語の壁も、繰り返しの対応も — 視聴者とのすべての会話をTikkeが通訳し自動化する。",
  m3t:"画面送出", m3d:"配信画面に表示するすべて。ドラッグ一つでTikTok LIVE Studioに接続。",
  m4t:"ギフト・サウンド", m4d:"ギフト一つ一つに音と反応を。視聴者の支援が配信の中で生きる。",
  m5t:"常連・連携", m5d:"一度来た視聴者を常連に、そして使い慣れたツールと滑らかに連携。"
});
Object.assign(window.I18N.zh,{
  m1t:"直播管控", m1d:"一次连接即可实时掌握兴趣度、段位与房间状态。一屏读懂直播中发生的一切。",
  m2t:"聊天 · 翻译 · AI", m2d:"语言障碍、重复应答 — Tikke 为你翻译并自动化与观众的每一次对话。",
  m3t:"画面输出", m3d:"叠加在直播画面上的一切。一次拖拽即可接入 TikTok LIVE Studio。",
  m4t:"礼物 · 音效", m4d:"为每一份礼物配上声音与反应。观众的打赏在直播中鲜活起来。",
  m5t:"常客 · 集成", m5d:"把来过一次的观众变成常客，并与你惯用的工具无缝衔接。"
});
Object.assign(window.I18N.ko,{ stat1n:"38", stat2n:"20+", stat3n:"<3", stat1l:"실시간 번역", stat2l:"화면 송출 모듈", stat3l:"설치 → 방송" });
Object.assign(window.I18N.en,{ stat1n:"38", stat2n:"20+", stat3n:"<3", stat1l:"Real-time Translate", stat2l:"On-screen Modules", stat3l:"Setup → On-air" });
Object.assign(window.I18N.ja,{ stat1n:"38", stat2n:"20+", stat3n:"<3", stat1l:"リアルタイム翻訳", stat2l:"画面送出モジュール", stat3l:"設定 → 配信" });
Object.assign(window.I18N.zh,{ stat1n:"38", stat2n:"20+", stat3n:"<3", stat1l:"实时翻译", stat2l:"画面输出模块", stat3l:"安装 → 开播" });
