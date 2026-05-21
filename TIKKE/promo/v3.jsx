// V3: 기능 데모 쇼케이스 — 클린, 정확한 데모
// 0-3s: 로고 + 인트로
// 3-9s: TTS — 정밀한 데모
// 9-15s: 커스텀 오버레이 — 드래그 시퀀스
// 15-21s: 채팅 모더 + 번역
// 21-27s: 대시보드 통계
// 27-30s: CTA

function V3Scene({ showCaption }) {
  return (
    <>
      <NeonBackground intensity={0.55} />

      {/* 0-3s: 인트로 */}
      <Sprite start={0} end={3.0}>
        {({ localTime }) => {
          const inT = Easing.easeOutCubic(clamp(localTime / 0.6, 0, 1));
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 760,
                textAlign: 'center',
                transform: `translateY(${(1 - inT) * 30}px)`,
                opacity: inT,
              }}>
                <TikkeLogo size={200} />
              </div>
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 1060,
                textAlign: 'center',
                fontFamily: 'Pretendard Variable',
                fontWeight: 600, fontSize: 42,
                color: 'rgba(255,255,255,0.75)',
                letterSpacing: '-0.01em',
                opacity: Easing.easeOutCubic(clamp((localTime - 0.6) / 0.5, 0, 1)),
              }}>
                라이브 방송, 더 똑똑하게
              </div>
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 1180,
                display: 'flex', justifyContent: 'center', gap: 16,
                opacity: Easing.easeOutCubic(clamp((localTime - 1.0) / 0.5, 0, 1)),
              }}>
                {['TTS', 'OVERLAY', 'MOD', '38 LANGS', 'STATS'].map((c, i) => (
                  <div key={i} style={{
                    padding: '10px 20px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.18)',
                    fontFamily: 'JetBrains Mono', fontSize: 20,
                    color: 'rgba(255,255,255,0.8)',
                    letterSpacing: '0.1em',
                  }}>{c}</div>
                ))}
              </div>
              {showCaption && <Caption text={'한 화면에 다 있어요'} sub={'데스크탑 라이브 도구'} accent={NEON.cyan} />}
            </div>
          );
        }}
      </Sprite>

      {/* 3-9s: TTS */}
      <Sprite start={3.0} end={9.0}>
        {({ localTime }) => {
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              {/* Tab indicator */}
              <FeatureHeader index={1} total={4} title="음성으로 읽어주기" code="TTS · KO" color={NEON.gold} localTime={localTime} />

              {/* Input row */}
              {localTime > 0.5 && (() => {
                const t = clamp((localTime - 0.5) / 0.5, 0, 1);
                return (
                  <div style={{
                    position: 'absolute', left: 60, top: 520,
                    opacity: t, transform: `translateY(${(1 - t) * 20}px)`,
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono', fontSize: 18,
                      color: 'rgba(255,255,255,0.45)',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      marginBottom: 12,
                    }}>INPUT · 채팅 메시지</div>
                    <ChatRow name="민지" msg="오늘 라이브 몇시까지 해?" color={NEON.pink} width={960} />
                  </div>
                );
              })()}

              {/* Pipeline visualization */}
              {localTime > 1.6 && (() => {
                const t = clamp((localTime - 1.6) / 0.5, 0, 1);
                return (
                  <div style={{
                    position: 'absolute', left: 60, right: 60, top: 880,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
                    opacity: t,
                  }}>
                    {['DETECT', 'TTS-KO', 'OUTPUT'].map((s, i) => (
                      <React.Fragment key={i}>
                        <div style={{
                          padding: '14px 22px',
                          borderRadius: 12,
                          border: `1px solid ${NEON.gold}88`,
                          background: `${NEON.gold}11`,
                          fontFamily: 'JetBrains Mono', fontSize: 20,
                          color: NEON.gold, letterSpacing: '0.12em',
                          textShadow: `0 0 12px ${NEON.gold}66`,
                        }}>{s}</div>
                        {i < 2 && <span style={{ color: NEON.gold, fontSize: 26 }}>→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                );
              })()}

              {/* Output player */}
              {localTime > 2.4 && (() => {
                const t = clamp((localTime - 2.4) / 0.5, 0, 1);
                return (
                  <div style={{
                    position: 'absolute', left: 60, right: 60, top: 1040,
                    padding: 36,
                    borderRadius: 28,
                    background: 'rgba(20,20,28,0.8)',
                    border: `2px solid ${NEON.gold}77`,
                    boxShadow: `0 0 40px ${NEON.gold}33`,
                    opacity: t,
                    transform: `translateY(${(1 - t) * 32}px)`,
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono', fontSize: 18,
                      color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      marginBottom: 14,
                    }}>OUTPUT · 한국어 음성</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 24,
                    }}>
                      <div style={{
                        width: 84, height: 84,
                        borderRadius: '50%',
                        background: NEON.gold,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 40,
                        boxShadow: `0 0 30px ${NEON.gold}99`,
                      }}>🔊</div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: 'Pretendard Variable', fontSize: 32,
                          color: '#fff', fontWeight: 600, marginBottom: 14,
                        }}>"오늘 라이브 몇시까지 해?"</div>
                        <VoiceWave color={NEON.gold} height={36} bars={24} />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tag list — voice options */}
              {localTime > 3.5 && (() => {
                const t = clamp((localTime - 3.5) / 0.5, 0, 1);
                return (
                  <div style={{
                    position: 'absolute', left: 60, right: 60, top: 1220,
                    display: 'flex', flexWrap: 'wrap', gap: 12,
                    opacity: t,
                  }}>
                    {['보이스 8종', '속도 조절', '필터·블록 단어', '커맨드 트리거'].map((s, i) => (
                      <div key={i} style={{
                        padding: '12px 20px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        fontFamily: 'Pretendard Variable', fontSize: 22,
                        color: '#fff', fontWeight: 500,
                      }}>· {s}</div>
                    ))}
                  </div>
                );
              })()}

              {showCaption && <Caption text={'시청자 채팅, 자연스러운 한국어 음성으로'} sub={'01 · TTS'} accent={NEON.gold} />}
            </div>
          );
        }}
      </Sprite>

      {/* 9-15s: Custom Overlay — drag sequence */}
      <Sprite start={9.0} end={15.0}>
        {({ localTime }) => {
          // Drag start at 1.0s, end at 2.4s. Path: from palette to placement.
          const dragT = clamp((localTime - 1.0) / 1.4, 0, 1);
          const eased = Easing.easeInOutCubic(dragT);
          const fromX = 720, fromY = 200;
          const toX = 160, toY = 460;
          const dx = fromX + (toX - fromX) * eased;
          const dy = fromY + (toY - fromY) * eased;

          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <FeatureHeader index={2} total={4} title="화면 위에, 자유롭게" code="CUSTOM OVERLAY" color={NEON.cyan} localTime={localTime} />

              {/* Stream preview frame */}
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 520,
                height: 820,
                borderRadius: 28,
                background: `linear-gradient(180deg, ${NEON.violet}22, ${NEON.pink}22), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 20px, rgba(255,255,255,0.08) 20px 40px)`,
                border: '2px solid rgba(255,255,255,0.12)',
                overflow: 'hidden',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1)),
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'JetBrains Mono', fontSize: 28,
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.2em',
                }}>STREAMER · CAM</div>

                {/* Palette in upper right */}
                {localTime > 0.4 && (
                  <div style={{
                    position: 'absolute', right: 20, top: 20,
                    padding: 14,
                    borderRadius: 16,
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    opacity: clamp((localTime - 0.4) * 3, 0, 1),
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono', fontSize: 12,
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      marginBottom: 10,
                    }}>PALETTE</div>
                    {[
                      { label: 'CHAT', c: NEON.cyan },
                      { label: 'GIFT', c: NEON.pink },
                      { label: 'GOAL', c: NEON.gold },
                    ].map((p, i) => (
                      <div key={i} style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: i === 0 && dragT > 0 && dragT < 1 ? `${p.c}33` : 'transparent',
                        border: `1px solid ${p.c}77`,
                        fontFamily: 'JetBrains Mono', fontSize: 14,
                        color: p.c, marginBottom: 6,
                        letterSpacing: '0.1em',
                      }}>{p.label}</div>
                    ))}
                  </div>
                )}

                {/* Dragging tile */}
                {localTime > 1.0 && localTime < 2.4 && (
                  <div style={{
                    position: 'absolute',
                    left: dx, top: dy,
                    width: 220, height: 260,
                    borderRadius: 16,
                    background: `${NEON.cyan}22`,
                    border: `2px dashed ${NEON.cyan}`,
                    boxShadow: `0 16px 48px ${NEON.cyan}55`,
                    transform: 'rotate(-2deg) scale(0.95)',
                    transition: 'none',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      position: 'absolute', top: 12, left: 14,
                      fontFamily: 'JetBrains Mono', fontSize: 13,
                      color: NEON.cyan, letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}>💬 CHAT</div>
                    {/* cursor */}
                    <div style={{
                      position: 'absolute', right: -30, bottom: -30,
                      width: 36, height: 36,
                    }}>
                      <svg viewBox="0 0 24 24" width="36" height="36">
                        <path d="M3 2 L3 18 L8 14 L11 20 L13 19 L10 14 L17 14 Z" fill="#fff" stroke="#000" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Placed chat overlay (after drop) */}
                {localTime > 2.4 && (() => {
                  const t = clamp((localTime - 2.4) / 0.4, 0, 1);
                  return (
                    <div style={{
                      position: 'absolute', left: 20, top: 20,
                      width: 280, height: 300,
                      borderRadius: 18,
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(12px)',
                      border: `2px solid ${NEON.cyan}`,
                      boxShadow: `0 0 24px ${NEON.cyan}88`,
                      padding: 14,
                      transform: `scale(${Easing.easeOutBack(t)})`,
                      transformOrigin: 'top left',
                    }}>
                      <div style={{
                        fontFamily: 'JetBrains Mono', fontSize: 14,
                        color: NEON.cyan, letterSpacing: '0.14em',
                        textTransform: 'uppercase', marginBottom: 10,
                      }}>💬 LIVE CHAT · 380×500</div>
                      {['minji  🔥🔥🔥', 'soyeon  Tikke ✨', 'haruki  すごい', 'jiwon  ㄴㅈ'].map((c, i) => (
                        <div key={i} style={{
                          padding: '6px 0',
                          fontFamily: 'Pretendard Variable',
                          fontSize: 18, color: 'rgba(255,255,255,0.9)',
                          opacity: clamp((localTime - 2.6 - i * 0.1) * 4, 0, 1),
                        }}>{c}</div>
                      ))}
                    </div>
                  );
                })()}

                {/* Additional gift overlay */}
                {localTime > 3.6 && (() => {
                  const t = clamp((localTime - 3.6) / 0.4, 0, 1);
                  return (
                    <div style={{
                      position: 'absolute', left: 24, bottom: 24, right: 24,
                      padding: 18,
                      borderRadius: 18,
                      background: `linear-gradient(135deg, ${NEON.pink}cc, ${NEON.violet}cc)`,
                      border: '2px solid rgba(255,255,255,0.25)',
                      boxShadow: `0 0 24px ${NEON.pink}99`,
                      transform: `scale(${Easing.easeOutBack(t)})`,
                      transformOrigin: 'bottom center',
                    }}>
                      <div style={{
                        fontFamily: 'JetBrains Mono', fontSize: 12,
                        color: '#fff', letterSpacing: '0.12em',
                        textTransform: 'uppercase', opacity: 0.9, marginBottom: 4,
                      }}>🎁 NEW GIFT · 340×120</div>
                      <div style={{
                        fontFamily: 'Pretendard Variable', fontSize: 22,
                        color: '#fff', fontWeight: 700,
                      }}>kpop_fan → 🌹 ×10</div>
                    </div>
                  );
                })()}
              </div>

              {showCaption && <Caption text={'드래그해서 배치, 끝.'} sub={'02 · 커스텀 오버레이'} accent={NEON.cyan} />}
            </div>
          );
        }}
      </Sprite>

      {/* 15-21s: Moderation + Translation */}
      <Sprite start={15.0} end={21.0}>
        {({ localTime }) => {
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <FeatureHeader index={3} total={4} title="모더 · 38개 언어 번역" code="MOD · TRANSLATE" color={NEON.violet} localTime={localTime} />

              {/* Rows */}
              {[
                { delay: 0.4, name: 'haruki_jp', msg: '今夜のセットリスト教えて?', color: NEON.violet, translated: '오늘밤 셋리스트 알려줘?', tag: 'JA→KO' },
                { delay: 1.0, name: 'sneaky_42', msg: 'click my bio LINK', color: NEON.pink, blocked: true, tag: 'SPAM' },
                { delay: 1.6, name: 'bts_fan', msg: 'love from brazil 💚', color: NEON.green, translated: '브라질에서 사랑해요 💚', tag: 'EN→KO' },
                { delay: 2.2, name: '신규팬', msg: '처음 와봤어요!', color: NEON.cyan, tag: 'NEW' },
                { delay: 2.8, name: 'wang_zh', msg: '你直播好棒!', color: NEON.gold, translated: '라이브 진짜 멋져요!', tag: 'ZH→KO' },
              ].map((c, i) => {
                if (localTime < c.delay) return null;
                const t = clamp((localTime - c.delay) / 0.4, 0, 1);
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    left: 60, right: 60,
                    top: 480 + i * 170,
                    opacity: t,
                    transform: `translateY(${(1 - Easing.easeOutCubic(t)) * 30}px)`,
                  }}>
                    <ChatRow
                      name={c.name}
                      msg={c.msg}
                      color={c.color}
                      tag={c.tag}
                      blocked={c.blocked}
                      translated={c.translated}
                      width={960}
                    />
                  </div>
                );
              })}

              {showCaption && <Caption text={'외국인 시청자도, 스팸도 자동 처리'} sub={'03 · 모더 + 번역'} accent={NEON.violet} />}
            </div>
          );
        }}
      </Sprite>

      {/* 21-27s: Dashboard */}
      <Sprite start={21.0} end={27.0}>
        {({ localTime }) => {
          const c1 = Math.floor(8000 + (localTime / 6) * 4500);
          const c2 = Math.floor(100 + (localTime / 6) * 215);
          const c3 = Math.floor(800 + (localTime / 6) * 1140);
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <FeatureHeader index={4} total={4} title="대시보드 한눈에" code="LIVE STATS" color={NEON.cyan} localTime={localTime} />

              {/* KPI grid */}
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 540,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
                opacity: Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1)),
              }}>
                {[
                  { l: '실시간 시청자', v: c1.toLocaleString(), d: '▲ 8.2%', c: NEON.cyan, accent: true },
                  { l: '신규 팔로워', v: c2.toLocaleString(), d: '▲ 12%', c: NEON.cyan },
                  { l: '받은 선물', v: c3.toLocaleString(), d: '▲ 24%', c: NEON.pink },
                  { l: '평균 체류', v: '8:42', d: '▼ 0.4%', c: NEON.gold },
                ].map((k, i) => (
                  <div key={i} style={{
                    padding: 28,
                    borderRadius: 22,
                    background: k.accent
                      ? `linear-gradient(135deg, ${NEON.cyan}22, ${NEON.pink}22)`
                      : 'rgba(20,20,28,0.7)',
                    border: `1px solid ${k.accent ? NEON.cyan : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: k.accent ? `0 0 32px ${NEON.cyan}33` : 'none',
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono', fontSize: 18,
                      color: 'rgba(255,255,255,0.55)',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      marginBottom: 12,
                    }}>{k.l}</div>
                    <div style={{
                      fontFamily: 'Space Grotesk',
                      fontSize: 72, fontWeight: 700,
                      color: '#fff', letterSpacing: '-0.02em', lineHeight: 1,
                    }}>{k.v}</div>
                    <div style={{
                      marginTop: 12,
                      fontFamily: 'JetBrains Mono', fontSize: 22,
                      color: k.d.startsWith('▲') ? NEON.green : NEON.pink,
                    }}>{k.d}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 980,
                padding: 28,
                borderRadius: 22,
                background: 'rgba(20,20,28,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                opacity: Easing.easeOutCubic(clamp((localTime - 0.6) / 0.5, 0, 1)),
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 18,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  marginBottom: 18,
                }}>시청자 · 선물 추이 (LAST 30 MIN)</div>
                <svg viewBox="0 0 400 110" preserveAspectRatio="none" style={{ width: '100%', height: 220 }}>
                  <defs>
                    <linearGradient id="g3a" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={NEON.cyan} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={NEON.cyan} stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="g3b" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={NEON.pink} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={NEON.pink} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1="0" y1={20 + i * 22} x2="400" y2={20 + i * 22}
                      stroke="rgba(255,255,255,0.05)" />
                  ))}
                  <path d="M0,80 C30,72 60,60 90,55 C120,50 150,58 180,45 C210,30 240,38 270,28 C300,18 330,32 360,22 L400,18 L400,110 L0,110 Z" fill="url(#g3a)" />
                  <path d="M0,80 C30,72 60,60 90,55 C120,50 150,58 180,45 C210,30 240,38 270,28 C300,18 330,32 360,22 L400,18" stroke={NEON.cyan} strokeWidth="1.8" fill="none" />
                  <path d="M0,95 C40,88 70,84 110,80 C150,76 190,70 230,62 C270,54 310,48 350,44 L400,40 L400,110 L0,110 Z" fill="url(#g3b)" />
                  <path d="M0,95 C40,88 70,84 110,80 C150,76 190,70 230,62 C270,54 310,48 350,44 L400,40" stroke={NEON.pink} strokeWidth="1.6" fill="none" />
                </svg>
              </div>

              {showCaption && <Caption text={'방송하면서 한눈에 확인'} sub={'04 · 대시보드'} accent={NEON.cyan} />}
            </div>
          );
        }}
      </Sprite>

      {/* 27-30s: CTA */}
      <Sprite start={27.0} end={30.0}>
        {({ localTime }) => {
          const inT = Easing.easeOutBack(clamp(localTime / 0.5, 0, 1));
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: '#06060c',
                opacity: clamp(localTime * 4, 0, 1),
              }} />
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 600,
                textAlign: 'center',
                transform: `scale(${inT})`,
              }}>
                <TikkeLogo size={200} />
              </div>
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 920,
                textAlign: 'center',
                fontFamily: 'Pretendard Variable',
                fontWeight: 800, fontSize: 76,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                opacity: Easing.easeOutCubic(clamp((localTime - 0.4) / 0.5, 0, 1)),
              }}>
                무료 다운로드<br />
                <span style={{ color: NEON.cyan, fontSize: 56, opacity: 0.85 }}>Windows · macOS</span>
              </div>
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 360,
                textAlign: 'center',
                opacity: Easing.easeOutCubic(clamp((localTime - 0.8) / 0.5, 0, 1)),
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '24px 56px',
                  borderRadius: 999,
                  background: `linear-gradient(135deg, ${NEON.cyan}, ${NEON.pink})`,
                  fontFamily: 'Pretendard Variable',
                  fontWeight: 700, fontSize: 42,
                  color: '#06060c',
                  boxShadow: `0 0 40px ${NEON.pink}aa`,
                }}>
                  www.tikke.kr
                </div>
              </div>
            </div>
          );
        }}
      </Sprite>
    </>
  );
}

// Common feature header
function FeatureHeader({ index, total, title, code, color, localTime }) {
  const t = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));
  return (
    <div style={{
      position: 'absolute', left: 60, right: 60, top: 280,
      opacity: t, transform: `translateY(${(1 - t) * 20}px)`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 22,
          color, letterSpacing: '0.14em',
          textShadow: `0 0 14px ${color}aa`,
        }}>0{index}/0{total}</div>
        <div style={{
          flex: 1, height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }} />
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 18,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.16em',
        }}>{code}</div>
      </div>
      <div style={{
        fontFamily: 'Pretendard Variable',
        fontWeight: 800, fontSize: 72,
        color: '#fff', letterSpacing: '-0.025em',
        lineHeight: 1,
      }}>{title}</div>
    </div>
  );
}

window.V3Scene = V3Scene;
