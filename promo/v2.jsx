// V2: 스토리텔링 (문제 → 해결) — 차분하고 시네마틱
// 0-4s: 문제 — 외국인 채팅, 놓친 멘트, 복잡한 외산 도구
// 4-7s: 해결 — Tikke 등장
// 7-13s: TTS
// 13-19s: 커스텀 오버레이
// 19-24s: 한국 스트리머에 의한, 한국 스트리머를 위한
// 24-30s: CTA

function V2Scene({ showCaption }) {
  return (
    <>
      <NeonBackground intensity={0.7} />

      {/* 0-4s: 문제 시퀀스 */}
      <Sprite start={0} end={4.0}>
        {({ localTime }) => {
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              {/* 외국어 채팅 — 못 읽음 */}
              {localTime < 1.5 && (() => {
                const t = clamp(localTime / 0.4, 0, 1) * clamp((1.5 - localTime) / 0.3, 0, 1);
                return (
                  <div style={{
                    position: 'absolute', left: 60, top: 700,
                    opacity: t,
                  }}>
                    <ChatRow
                      name="haruki_jp"
                      msg="今夜のセットリスト教えて?"
                      color={NEON.violet}
                      width={960}
                    />
                  </div>
                );
              })()}

              {/* 멘트 놓침 — chat scroll */}
              {localTime > 1.4 && localTime < 2.8 && (() => {
                const t0 = clamp((localTime - 1.4) / 0.3, 0, 1) * clamp((2.8 - localTime) / 0.3, 0, 1);
                return (
                  <>
                    {['민지  화면 안 보이는데?', 'soyeon  지금 뭐하는거에요', 'jiwon  답 좀!'].map((c, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        left: 60, top: 740 + i * 140,
                        padding: '18px 24px',
                        borderRadius: 16,
                        background: 'rgba(20,20,28,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontFamily: 'Pretendard Variable',
                        fontSize: 28,
                        color: '#fff',
                        opacity: t0,
                        width: 700,
                      }}>{c}</div>
                    ))}
                  </>
                );
              })()}

              {/* 큰 텍스트 — 문제 */}
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 280,
                fontFamily: 'JetBrains Mono', fontSize: 24,
                color: NEON.pink, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
              }}>매일 같은 고민</div>
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 360,
                fontFamily: 'Pretendard Variable',
                fontWeight: 800, fontSize: 88,
                color: '#fff',
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                opacity: Easing.easeOutCubic(clamp((localTime - 0.2) / 0.5, 0, 1)),
              }}>
                채팅 놓치고,<br />
                외국어 못 읽고,<br />
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>외산 툴은 어렵고.</span>
              </div>
              {showCaption && <Caption text={'라이브, 혼자 다 하기 힘들었죠?'} sub={'스트리머의 진짜 고민'} accent={NEON.pink} />}
            </div>
          );
        }}
      </Sprite>

      {/* 4-7s: Solution reveal */}
      <Sprite start={4.0} end={7.0}>
        {({ localTime }) => {
          const inT = Easing.easeOutBack(clamp(localTime / 0.6, 0, 1));
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 380,
                textAlign: 'center',
                fontFamily: 'JetBrains Mono', fontSize: 28,
                color: NEON.cyan, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
                textShadow: `0 0 14px ${NEON.cyan}aa`,
              }}>그래서 만들었어요</div>

              <div style={{
                position: 'absolute', left: 0, right: 0, top: 720,
                textAlign: 'center',
                transform: `scale(${inT})`,
              }}>
                <TikkeLogo size={240} />
              </div>

              <div style={{
                position: 'absolute', left: 60, right: 60, top: 1080,
                textAlign: 'center',
                fontFamily: 'Pretendard Variable',
                fontWeight: 700, fontSize: 44,
                color: '#fff',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                opacity: Easing.easeOutCubic(clamp((localTime - 0.6) / 0.5, 0, 1)),
              }}>
                채팅 · 번역 · 알림 · 오버레이
                <br /><span style={{ color: NEON.cyan }}>한 화면에서, 한국어로.</span>
              </div>

              {showCaption && <Caption text={'한국어 라이브 도구, Tikke'} sub={'데스크탑 방송 툴킷'} accent={NEON.cyan} />}
            </div>
          );
        }}
      </Sprite>

      {/* 7-13s: TTS */}
      <Sprite start={7.0} end={13.0}>
        {({ localTime }) => {
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 60, top: 280,
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 22,
                  color: NEON.gold, letterSpacing: '0.16em',
                  textTransform: 'uppercase', marginBottom: 12,
                }}>FEATURE 01</div>
                <div style={{
                  fontFamily: 'Pretendard Variable',
                  fontWeight: 800, fontSize: 84,
                  color: '#fff', letterSpacing: '-0.02em', lineHeight: 1,
                }}>읽어줄게요</div>
                <div style={{
                  marginTop: 16,
                  fontFamily: 'Pretendard Variable',
                  fontSize: 32, color: 'rgba(255,255,255,0.65)',
                  fontWeight: 500,
                }}>채팅을 자연스러운 한국어 음성으로</div>
              </div>

              {/* 채팅 → 음성 데모 */}
              {localTime > 1.0 && (
                <div style={{
                  position: 'absolute', left: 60, top: 720,
                  opacity: clamp((localTime - 1.0) * 3, 0, 1),
                  transform: `translateY(${(1 - clamp((localTime - 1.0) * 3, 0, 1)) * 24}px)`,
                }}>
                  <ChatRow name="민지" msg="오늘 라이브 몇시까지 해?" color={NEON.pink} width={960} />
                </div>
              )}

              {localTime > 2.2 && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: 920,
                  textAlign: 'center',
                  fontSize: 56,
                  color: NEON.gold,
                  opacity: clamp((localTime - 2.2) * 4, 0, 1),
                  textShadow: `0 0 24px ${NEON.gold}`,
                }}>↓</div>
              )}

              {localTime > 2.6 && (() => {
                const t = clamp((localTime - 2.6) * 2, 0, 1);
                return (
                  <div style={{
                    position: 'absolute', left: 60, right: 60, top: 1020,
                    padding: 36,
                    borderRadius: 28,
                    background: `linear-gradient(135deg, ${NEON.gold}22, transparent)`,
                    border: `2px solid ${NEON.gold}77`,
                    boxShadow: `0 0 40px ${NEON.gold}44`,
                    opacity: t,
                    transform: `translateY(${(1 - t) * 32}px)`,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16,
                    }}>
                      <div style={{
                        width: 80, height: 80,
                        borderRadius: '50%',
                        background: NEON.gold,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 42,
                        boxShadow: `0 0 24px ${NEON.gold}aa`,
                      }}>🔊</div>
                      <div style={{
                        fontFamily: 'JetBrains Mono', fontSize: 18,
                        color: NEON.gold, letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                      }}>한국어 음성 · 자연스러움</div>
                    </div>
                    <div style={{
                      fontFamily: 'Pretendard Variable', fontSize: 36,
                      color: '#fff', fontWeight: 600,
                    }}>"오늘 라이브 몇시까지 해?"</div>
                    <div style={{ marginTop: 20 }}>
                      <VoiceWave color={NEON.gold} height={48} bars={28} />
                    </div>
                  </div>
                );
              })()}

              {showCaption && <Caption text={'시청자 멘트, 놓치지 마세요'} sub={'TTS — 음성 변환'} accent={NEON.gold} />}
            </div>
          );
        }}
      </Sprite>

      {/* 13-19s: Custom overlay */}
      <Sprite start={13.0} end={19.0}>
        {({ localTime }) => {
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 60, top: 280,
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 22,
                  color: NEON.cyan, letterSpacing: '0.16em',
                  textTransform: 'uppercase', marginBottom: 12,
                }}>FEATURE 02</div>
                <div style={{
                  fontFamily: 'Pretendard Variable',
                  fontWeight: 800, fontSize: 84,
                  color: '#fff', letterSpacing: '-0.02em', lineHeight: 1,
                }}>화면 위에, 자유롭게</div>
                <div style={{
                  marginTop: 16,
                  fontFamily: 'Pretendard Variable',
                  fontSize: 32, color: 'rgba(255,255,255,0.65)',
                  fontWeight: 500,
                }}>채팅 · 선물 · 목표 — 원하는 곳에 드래그</div>
              </div>

              {/* 라이브 화면 mock */}
              <div style={{
                position: 'absolute', left: 60, right: 60, top: 700,
                height: 640,
                borderRadius: 32,
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${NEON.violet}33, ${NEON.pink}33), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 20px, rgba(255,255,255,0.08) 20px 40px)`,
                border: '2px solid rgba(255,255,255,0.12)',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1)),
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'JetBrains Mono', fontSize: 28,
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.2em',
                }}>STREAMER · CAM</div>

                {/* Chat overlay slides in */}
                {localTime > 1.0 && (() => {
                  const t = clamp((localTime - 1.0) / 0.6, 0, 1);
                  return (
                    <div style={{
                      position: 'absolute', left: 24, top: 24,
                      width: 320, height: 420,
                      borderRadius: 18,
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(12px)',
                      border: `2px solid ${NEON.cyan}`,
                      boxShadow: `0 0 24px ${NEON.cyan}88`,
                      padding: 16,
                      transform: `translateX(${(1 - Easing.easeOutCubic(t)) * -380}px)`,
                      opacity: t,
                    }}>
                      <div style={{
                        fontFamily: 'JetBrains Mono', fontSize: 14,
                        color: NEON.cyan, letterSpacing: '0.14em',
                        textTransform: 'uppercase', marginBottom: 12,
                      }}>💬 LIVE CHAT</div>
                      {['민지  대박이다 ㅋㅋ', 'soyeon  Tikke ✨', 'haruki  すごい', 'jiwon  굿굿', 'yujin  📺📺'].map((c, i) => (
                        <div key={i} style={{
                          padding: '6px 0',
                          fontFamily: 'Pretendard Variable',
                          fontSize: 18, color: 'rgba(255,255,255,0.9)',
                          opacity: clamp((localTime - 1.0 - i * 0.12) * 4, 0, 1),
                        }}>{c}</div>
                      ))}
                    </div>
                  );
                })()}

                {/* Gift alert slides in from right */}
                {localTime > 2.0 && (() => {
                  const t = clamp((localTime - 2.0) / 0.5, 0, 1);
                  return (
                    <div style={{
                      position: 'absolute', right: 24, top: 24,
                      width: 280,
                      transform: `translateX(${(1 - Easing.easeOutBack(t)) * 380}px)`,
                      opacity: t,
                    }}>
                      <div style={{
                        padding: 16,
                        borderRadius: 18,
                        background: `linear-gradient(135deg, ${NEON.pink}cc, ${NEON.violet}cc)`,
                        border: '2px solid rgba(255,255,255,0.25)',
                        boxShadow: `0 0 24px ${NEON.pink}aa`,
                      }}>
                        <div style={{
                          fontFamily: 'JetBrains Mono', fontSize: 12,
                          color: '#fff', letterSpacing: '0.12em',
                          textTransform: 'uppercase', opacity: 0.9, marginBottom: 4,
                        }}>🎁 NEW GIFT</div>
                        <div style={{
                          fontFamily: 'Pretendard Variable', fontSize: 22,
                          color: '#fff', fontWeight: 700,
                        }}>kpop_fan → 🌹×10</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Goal bar slides up from bottom */}
                {localTime > 3.0 && (() => {
                  const t = clamp((localTime - 3.0) / 0.6, 0, 1);
                  const bar = clamp((localTime - 3.4) / 2.0, 0, 1);
                  return (
                    <div style={{
                      position: 'absolute', left: 24, right: 24, bottom: 24,
                      padding: 20,
                      borderRadius: 18,
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(12px)',
                      border: `2px solid ${NEON.gold}`,
                      boxShadow: `0 0 24px ${NEON.gold}88`,
                      transform: `translateY(${(1 - Easing.easeOutCubic(t)) * 200}px)`,
                      opacity: t,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontFamily: 'JetBrains Mono', fontSize: 16,
                        color: NEON.gold, letterSpacing: '0.14em',
                        textTransform: 'uppercase', marginBottom: 10,
                      }}>
                        <span>🎯 팔로워 목표</span>
                        <span>{Math.floor(380 + bar * 80)} / 500</span>
                      </div>
                      <div style={{
                        height: 14, borderRadius: 8,
                        background: 'rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${(76 + bar * 16)}%`,
                          background: `linear-gradient(90deg, ${NEON.gold}, ${NEON.pink})`,
                          boxShadow: `0 0 16px ${NEON.gold}`,
                        }} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {showCaption && <Caption text={'드래그 한 번이면 끝'} sub={'커스텀 오버레이'} accent={NEON.cyan} />}
            </div>
          );
        }}
      </Sprite>

      {/* 19-24s: 한국 스트리머에 의해, 한국 스트리머를 위해 */}
      <Sprite start={19.0} end={24.0}>
        {({ localTime }) => {
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 320,
                textAlign: 'center',
                fontFamily: 'JetBrains Mono', fontSize: 24,
                color: NEON.cyan, letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1)),
              }}>MADE IN KOREA</div>

              <div style={{
                position: 'absolute', left: 60, right: 60, top: 480,
                textAlign: 'center',
                fontFamily: 'Pretendard Variable',
                fontWeight: 800, fontSize: 96,
                color: '#fff',
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                opacity: Easing.easeOutCubic(clamp((localTime - 0.3) / 0.6, 0, 1)),
                transform: `translateY(${(1 - Easing.easeOutCubic(clamp((localTime - 0.3) / 0.6, 0, 1))) * 30}px)`,
              }}>
                한국 스트리머에게,
                <br />
                <span style={{
                  background: `linear-gradient(135deg, ${NEON.cyan}, ${NEON.pink})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>편하게 만들었습니다</span>
              </div>

              {/* 비교 라인 */}
              {localTime > 1.6 && (() => {
                const items = [
                  '한글 UI · 한국어 음성',
                  '익숙한 단축키 · 한 화면 구성',
                  '복잡한 설정 없이 30초 시작',
                ];
                return (
                  <div style={{
                    position: 'absolute', left: 60, right: 60, top: 980,
                    display: 'flex', flexDirection: 'column', gap: 14,
                  }}>
                    {items.map((it, i) => {
                      const t = clamp((localTime - 1.6 - i * 0.4) / 0.4, 0, 1);
                      return (
                        <div key={i} style={{
                          padding: '22px 28px',
                          borderRadius: 18,
                          background: 'rgba(20,20,28,0.6)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontFamily: 'Pretendard Variable',
                          fontSize: 38, fontWeight: 600,
                          color: '#fff',
                          display: 'flex', alignItems: 'center', gap: 18,
                          opacity: t,
                          transform: `translateX(${(1 - Easing.easeOutBack(t)) * -40}px)`,
                        }}>
                          <span style={{
                            color: NEON.green,
                            fontSize: 36,
                          }}>✓</span>
                          {it}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {showCaption && <Caption text={'한국인이 쓰기, 더 익숙하게'} sub={'Made for Korean Streamers'} accent={NEON.cyan} />}
            </div>
          );
        }}
      </Sprite>

      {/* 24-30s: CTA */}
      <Sprite start={24.0} end={30.0}>
        {({ localTime }) => {
          const inT = Easing.easeOutBack(clamp(localTime / 0.6, 0, 1));
          return (
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0,242,234,0.15), transparent 70%)',
                opacity: clamp(localTime * 3, 0, 1),
              }} />

              <div style={{
                position: 'absolute', left: 0, right: 0, top: 580,
                textAlign: 'center',
                transform: `scale(${inT})`,
              }}>
                <TikkeLogo size={200} />
              </div>

              <div style={{
                position: 'absolute', left: 60, right: 60, top: 880,
                textAlign: 'center',
                fontFamily: 'Pretendard Variable',
                fontWeight: 800, fontSize: 84,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                opacity: Easing.easeOutCubic(clamp((localTime - 0.5) / 0.5, 0, 1)),
              }}>
                지금 다운로드하고
                <br />
                <span style={{ color: NEON.cyan }}>오늘 라이브부터.</span>
              </div>

              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 360,
                textAlign: 'center',
                opacity: Easing.easeOutCubic(clamp((localTime - 1.2) / 0.5, 0, 1)),
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '24px 56px',
                  borderRadius: 999,
                  background: `linear-gradient(135deg, ${NEON.cyan}, ${NEON.pink})`,
                  fontFamily: 'Pretendard Variable',
                  fontWeight: 700, fontSize: 40,
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

window.V2Scene = V2Scene;
