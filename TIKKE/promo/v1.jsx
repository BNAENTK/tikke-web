// V1: 에너제틱 빠른 컷 (TikTok 스타일)
// 0-2s: 카오스 훅
// 2-5s: 로고 임팩트
// 5-11s: TTS 데모
// 11-17s: 오버레이 데모
// 17-22s: "한국 스트리머에게 더 편하게"
// 22-27s: 빠른 몽타주
// 27-30s: CTA

function V1Scene({ showCaption }) {
  const t = useTime();
  // shake on cuts
  const shake = (intensity) => {
    const sx = Math.sin(t * 60) * intensity;
    const sy = Math.cos(t * 50) * intensity;
    return `translate(${sx}px, ${sy}px)`;
  };

  return (
    <>
      <NeonBackground intensity={1} />

      {/* 0-2s: Chaos — chat spam */}
      <Sprite start={0} end={2.0}>
        {({ progress }) => (
          <div style={{ position: 'absolute', inset: 0 }}>
            {[
              { y: 460, x: 80, n: 'user_1', m: 'asdfasdf', c: '#FF7AB3', d: 0.1 },
              { y: 600, x: 140, n: 'spammer', m: 'follow back???', c: '#FFC857', d: 0.0 },
              { y: 740, x: 60, n: 'unknown', m: '???? 무슨말?', c: '#A78BFA', d: 0.2 },
              { y: 880, x: 160, n: 'kpop_fan', m: 'hi from 🇯🇵', c: '#00F2EA', d: 0.15 },
              { y: 1020, x: 80, n: 'sneaky', m: 'CHECK BIO 👀', c: '#FF0050', d: 0.3 },
              { y: 1160, x: 140, n: 'random', m: '뭐라는거임 ㅋㅋ', c: '#FF7AB3', d: 0.25 },
              { y: 1300, x: 60, n: 'haruki', m: 'こんばんは!!', c: '#00FFA3', d: 0.18 },
              { y: 1440, x: 160, n: 'spam_99', m: 'click link', c: '#FF0050', d: 0.4 },
            ].map((c, i) => {
              const localT = clamp(progress * 2 - c.d, 0, 1);
              const opacity = Easing.easeOutCubic(clamp(localT * 3, 0, 1));
              const tx = (1 - opacity) * 80;
              return (
                <div key={i} style={{
                  position: 'absolute', left: c.x, top: c.y,
                  transform: `translateX(${tx}px) rotate(${(i % 2 ? -1 : 1) * 1.5}deg)`,
                  opacity,
                }}>
                  <ChatRow name={c.n} msg={c.m} color={c.c} width={780} />
                </div>
              );
            })}
            {/* Big red question */}
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 200,
              textAlign: 'center',
              fontFamily: 'Pretendard Variable',
              fontWeight: 900,
              fontSize: 130,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: '#fff',
              textShadow: `0 0 36px ${NEON.pink}, 0 4px 20px rgba(0,0,0,0.6)`,
              opacity: Easing.easeOutBack(clamp(progress * 1.5, 0, 1)),
            }}>
              감당 안 돼?
            </div>
          </div>
        )}
      </Sprite>

      {/* 2-5s: Logo impact */}
      <Sprite start={2.0} end={5.0}>
        {({ progress, localTime }) => {
          const inT = Easing.easeOutBack(clamp(localTime / 0.5, 0, 1));
          const scale = 0.5 + inT * 0.5;
          const flash = clamp(1 - localTime * 4, 0, 1);
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: '#fff',
                opacity: flash * 0.8,
              }} />
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 700,
                textAlign: 'center',
                transform: `scale(${scale})`,
              }}>
                <TikkeLogo size={220} />
              </div>
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 1020,
                textAlign: 'center',
                opacity: Easing.easeOutCubic(clamp((localTime - 0.4) / 0.5, 0, 1)),
                fontFamily: 'Pretendard Variable',
                fontWeight: 700,
                fontSize: 48,
                color: '#fff',
                letterSpacing: '-0.01em',
              }}>
                <span style={{ color: NEON.cyan }}>한국 스트리머</span>를 위한
                <br />라이브 방송 도구
              </div>
            </div>
          );
        }}
      </Sprite>

      {/* 5-11s: TTS demo */}
      <Sprite start={5.0} end={11.0}>
        {({ localTime }) => {
          const showChat = localTime > 0.2;
          const showArrow = localTime > 1.4;
          const showSpeaker = localTime > 1.8;
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              {/* 헤더 라벨 */}
              <div style={{
                position: 'absolute', left: 60, top: 280,
                fontFamily: 'JetBrains Mono', fontSize: 28,
                color: NEON.gold,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
                textShadow: `0 0 12px ${NEON.gold}aa`,
              }}>01 · TTS</div>
              {showChat && (
                <div style={{
                  position: 'absolute', left: 60, top: 380,
                  transform: `translateY(${(1 - Easing.easeOutBack(clamp((localTime - 0.2) / 0.5, 0, 1))) * 40}px)`,
                  opacity: clamp((localTime - 0.2) * 3, 0, 1),
                }}>
                  <ChatRow name="민지" msg="오빠 오늘 노래 뭐 부를거임?" color={NEON.pink} width={960} />
                </div>
              )}
              {showArrow && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: 620,
                  textAlign: 'center',
                  fontSize: 88,
                  color: NEON.gold,
                  opacity: clamp((localTime - 1.4) * 3, 0, 1),
                  textShadow: `0 0 30px ${NEON.gold}`,
                  transform: `scale(${0.6 + Easing.easeOutBack(clamp((localTime - 1.4) / 0.4, 0, 1)) * 0.4})`,
                }}>↓</div>
              )}
              {showSpeaker && (
                <div style={{
                  position: 'absolute', left: 60, right: 60, top: 760,
                  padding: 32,
                  borderRadius: 28,
                  background: `linear-gradient(135deg, ${NEON.gold}22, transparent)`,
                  border: `2px solid ${NEON.gold}66`,
                  boxShadow: `0 0 40px ${NEON.gold}33`,
                  display: 'flex', alignItems: 'flex-start', gap: 24,
                  opacity: clamp((localTime - 1.8) * 3, 0, 1),
                  transform: `translateY(${(1 - clamp((localTime - 1.8) * 3, 0, 1)) * 40}px)`,
                }}>
                  <div style={{
                    width: 96, height: 96, flexShrink: 0,
                    borderRadius: '50%',
                    background: NEON.gold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 48,
                    boxShadow: `0 0 30px ${NEON.gold}aa`,
                  }}>🔊</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono', fontSize: 18,
                      color: NEON.gold, letterSpacing: '0.14em',
                      textTransform: 'uppercase', marginBottom: 10,
                    }}>한국어 음성 · 자연스러운 톤</div>
                    <div style={{
                      fontFamily: 'Pretendard Variable', fontSize: 34,
                      color: '#fff', fontWeight: 600, lineHeight: 1.25,
                      marginBottom: 20,
                    }}>"오빠 오늘 노래 뭐 부를거임?"</div>
                    <VoiceWave color={NEON.gold} height={56} bars={24} />
                  </div>
                </div>
              )}
              {showCaption && <Caption text={'멘트 놓칠 일 없이.'} sub={'TTS · 음성 변환'} accent={NEON.gold} />}
            </div>
          );
        }}
      </Sprite>

      {/* 11-17s: Custom overlay demo */}
      <Sprite start={11.0} end={17.0}>
        {({ localTime }) => {
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 60, top: 280,
                fontFamily: 'JetBrains Mono', fontSize: 26,
                color: NEON.cyan,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
                textShadow: `0 0 12px ${NEON.cyan}aa`,
              }}>02 · 커스텀 오버레이</div>

              {/* 배경: 가상 라이브 스트림 화면 */}
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 400,
                height: 940,
                borderRadius: 32,
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${NEON.violet}33, ${NEON.pink}33), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 20px, rgba(255,255,255,0.08) 20px 40px)`,
                border: '2px solid rgba(255,255,255,0.12)',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1)),
              }}>
                {/* "PRESENTER" placeholder */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'JetBrains Mono', fontSize: 32,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.2em',
                }}>STREAMER · CAM</div>

                {/* 오버레이 1 — 채팅창 (왼쪽 위) */}
                {localTime > 0.8 && (() => {
                  const t = clamp((localTime - 0.8) / 0.6, 0, 1);
                  const eased = Easing.easeOutBack(t);
                  return (
                    <div style={{
                      position: 'absolute', left: 24, top: 24,
                      width: 340, height: 380,
                      borderRadius: 18,
                      background: 'rgba(0,0,0,0.55)',
                      backdropFilter: 'blur(12px)',
                      border: `2px solid ${NEON.cyan}`,
                      boxShadow: `0 0 24px ${NEON.cyan}77`,
                      padding: 16,
                      transform: `scale(${eased})`,
                      transformOrigin: 'top left',
                      opacity: t,
                    }}>
                      <div style={{
                        fontFamily: 'JetBrains Mono', fontSize: 14,
                        color: NEON.cyan, letterSpacing: '0.16em',
                        textTransform: 'uppercase', marginBottom: 10,
                      }}>LIVE CHAT · 380×500</div>
                      {['minji  🔥🔥', 'soyeon  Tikke ✨', 'haruki  こんばんは', 'jiwon  대박', 'yujin  ㅋㅋㅋ'].map((c, i) => (
                        <div key={i} style={{
                          padding: '6px 0',
                          fontFamily: 'Pretendard Variable',
                          fontSize: 18, color: 'rgba(255,255,255,0.9)',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>{c}</div>
                      ))}
                    </div>
                  );
                })()}

                {/* 오버레이 2 — 선물 알림 (오른쪽 위) */}
                {localTime > 1.6 && (() => {
                  const t = clamp((localTime - 1.6) / 0.5, 0, 1);
                  const eased = Easing.easeOutBack(t);
                  return (
                    <div style={{
                      position: 'absolute', right: 24, top: 24,
                      width: 280, padding: 14,
                      borderRadius: 18,
                      background: `linear-gradient(135deg, ${NEON.pink}cc, ${NEON.violet}cc)`,
                      border: '2px solid rgba(255,255,255,0.25)',
                      boxShadow: `0 0 24px ${NEON.pink}99`,
                      transform: `scale(${eased})`,
                      transformOrigin: 'top right',
                      opacity: t,
                    }}>
                      <div style={{
                        fontFamily: 'JetBrains Mono', fontSize: 12,
                        color: '#fff', letterSpacing: '0.12em',
                        textTransform: 'uppercase', opacity: 0.9, marginBottom: 4,
                      }}>🎁 GIFT · 340×120</div>
                      <div style={{
                        fontFamily: 'Pretendard Variable', fontSize: 22,
                        color: '#fff', fontWeight: 700,
                      }}>kpop_fan → 🌹×10</div>
                    </div>
                  );
                })()}

                {/* 오버레이 3 — 목표 진행 (하단) */}
                {localTime > 2.4 && (() => {
                  const t = clamp((localTime - 2.4) / 0.5, 0, 1);
                  const eased = Easing.easeOutBack(t);
                  const bar = clamp((localTime - 2.6) / 1.5, 0, 1);
                  return (
                    <div style={{
                      position: 'absolute', left: 24, right: 24, bottom: 24,
                      padding: 18,
                      borderRadius: 18,
                      background: 'rgba(0,0,0,0.55)',
                      backdropFilter: 'blur(12px)',
                      border: `2px solid ${NEON.gold}`,
                      boxShadow: `0 0 24px ${NEON.gold}77`,
                      transform: `scale(${eased})`,
                      transformOrigin: 'bottom center',
                      opacity: t,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontFamily: 'JetBrains Mono', fontSize: 14,
                        color: NEON.gold, letterSpacing: '0.14em',
                        textTransform: 'uppercase', marginBottom: 8,
                      }}>
                        <span>🎯 팔로워 목표</span>
                        <span>{Math.floor(bar * 380)} / 500</span>
                      </div>
                      <div style={{
                        height: 14, borderRadius: 8,
                        background: 'rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${bar * 76}%`,
                          background: `linear-gradient(90deg, ${NEON.gold}, ${NEON.pink})`,
                          boxShadow: `0 0 16px ${NEON.gold}`,
                        }} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {showCaption && <Caption text={'드래그해서 자유롭게 배치'} sub={'커스텀 오버레이'} accent={NEON.cyan} />}
            </div>
          );
        }}
      </Sprite>

      {/* 17-22s: "한국 스트리머에 맞춘" */}
      <Sprite start={17.0} end={22.0}>
        {({ localTime }) => {
          const lines = [
            '한국어 UI · 한국어 음성',
            '복잡한 외산 툴은 그만',
            '익숙하게, 빠르게',
          ];
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 60, top: 280,
                fontFamily: 'JetBrains Mono', fontSize: 26,
                color: NEON.pink,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
                textShadow: `0 0 12px ${NEON.pink}aa`,
              }}>03 · 한국 스트리머 맞춤</div>

              {lines.map((l, i) => {
                const start = 0.3 + i * 0.6;
                const t = clamp((localTime - start) / 0.4, 0, 1);
                const eased = Easing.easeOutBack(t);
                return (
                  <div key={i} style={{
                    position: 'absolute', left: 60, right: 60,
                    top: 480 + i * 200,
                    fontFamily: 'Pretendard Variable',
                    fontWeight: 800, fontSize: 76,
                    color: i === 1 ? NEON.pink : '#fff',
                    letterSpacing: '-0.02em',
                    transform: `translateX(${(1 - eased) * 80}px)`,
                    opacity: t,
                    textShadow: i === 1 ? `0 0 24px ${NEON.pink}66` : 'none',
                  }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 32, color: 'rgba(255,255,255,0.4)',
                      marginRight: 18,
                    }}>0{i + 1}</span>
                    {l}
                  </div>
                );
              })}
              {/* hint banner */}
              {localTime > 2.5 && (
                <div style={{
                  position: 'absolute', left: 60, right: 60, top: 1280,
                  padding: '22px 28px',
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${NEON.cyan}22, ${NEON.pink}22)`,
                  border: `2px solid ${NEON.cyan}66`,
                  fontFamily: 'Pretendard Variable',
                  fontSize: 32, fontWeight: 600,
                  color: '#fff',
                  textAlign: 'center',
                  opacity: clamp((localTime - 2.5) * 3, 0, 1),
                }}>
                  익숙한 한글 인터페이스 · 30초면 시작 끝
                </div>
              )}
            </div>
          );
        }}
      </Sprite>

      {/* 22-27s: Quick montage */}
      <Sprite start={22.0} end={27.0}>
        {({ localTime }) => {
          const features = [
            { t: 0.0, label: '실시간 채팅 모더레이션', color: NEON.cyan, icon: '💬' },
            { t: 0.45, label: '38개 언어 자동 번역', color: NEON.violet, icon: '🌐' },
            { t: 0.9, label: '선물·팔로우 알림', color: NEON.pink, icon: '🎁' },
            { t: 1.35, label: '커맨드 자동 응답', color: NEON.green, icon: '⚡' },
            { t: 1.8, label: '🏆 리그 조각컷 실시간', color: NEON.gold, icon: '🏆' },
            { t: 2.25, label: '⏱ 타이머 오버레이', color: NEON.cyan, icon: '⏱' },
            { t: 2.7, label: '👑 최고 후원자 랭킹', color: NEON.violet, icon: '👑' },
            { t: 3.15, label: '🎚 dB 측정기', color: NEON.pink, icon: '🎚' },
          ];
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 240,
                fontFamily: 'JetBrains Mono', fontSize: 26,
                color: '#fff', letterSpacing: '0.16em', textTransform: 'uppercase',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
                textAlign: 'center',
              }}>필요한 건, 한 화면에 전부</div>
              {features.map((f, i) => {
                const t = clamp((localTime - f.t) / 0.4, 0, 1);
                const eased = Easing.easeOutBack(t);
                const row = Math.floor(i / 2);
                const col = i % 2;
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    left: 60 + col * 500,
                    top: 360 + row * 360,
                    width: 460, height: 320,
                    padding: 28,
                    borderRadius: 26,
                    background: 'rgba(20,20,28,0.7)',
                    backdropFilter: 'blur(12px)',
                    border: `2px solid ${f.color}66`,
                    boxShadow: `0 0 28px ${f.color}33`,
                    transform: `scale(${eased}) rotate(${(1 - eased) * (col ? 4 : -4)}deg)`,
                    opacity: t,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ fontSize: 72 }}>{f.icon}</div>
                    <div style={{
                      fontFamily: 'Pretendard Variable',
                      fontWeight: 700, fontSize: 30,
                      color: '#fff', lineHeight: 1.2,
                    }}>{f.label}</div>
                  </div>
                );
              })}
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
                <TikkeLogo size={180} />
              </div>
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 880,
                textAlign: 'center',
                fontFamily: 'Pretendard Variable',
                fontWeight: 800, fontSize: 88,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                opacity: Easing.easeOutCubic(clamp((localTime - 0.4) / 0.5, 0, 1)),
              }}>
                지금 바로<br />
                <span style={{
                  background: `linear-gradient(135deg, ${NEON.cyan}, ${NEON.pink})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>무료 다운로드</span>
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
                <div style={{
                  marginTop: 28,
                  fontFamily: 'JetBrains Mono', fontSize: 22,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                }}>WINDOWS · MACOS · 무료</div>
              </div>
            </div>
          );
        }}
      </Sprite>
    </>
  );
}

window.V1Scene = V1Scene;
