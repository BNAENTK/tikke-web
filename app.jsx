// Tikke landing app root
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#00F2EA", "#FF0050", "#A78BFA"],
  "glassLevel": "medium",
  "showAmbient": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply palette as CSS custom properties
  React.useEffect(() => {
    const root = document.documentElement;
    const [c1, c2, c3] = t.palette || [];
    if (c1) root.style.setProperty("--cyan", c1);
    if (c2) root.style.setProperty("--pink", c2);
    if (c3) root.style.setProperty("--violet", c3);
  }, [t.palette]);

  // glass level adjustment
  React.useEffect(() => {
    const root = document.documentElement;
    if (t.glassLevel === "low") {
      root.style.setProperty("--hairline", "rgba(255,255,255,0.05)");
      root.style.setProperty("--hairline-hi", "rgba(255,255,255,0.10)");
      root.style.setProperty("--surface", "rgba(255,255,255,0.025)");
    } else if (t.glassLevel === "high") {
      root.style.setProperty("--hairline", "rgba(255,255,255,0.14)");
      root.style.setProperty("--hairline-hi", "rgba(255,255,255,0.22)");
      root.style.setProperty("--surface", "rgba(255,255,255,0.06)");
    } else {
      root.style.setProperty("--hairline", "rgba(255,255,255,0.08)");
      root.style.setProperty("--hairline-hi", "rgba(255,255,255,0.14)");
      root.style.setProperty("--surface", "rgba(255,255,255,0.04)");
    }
  }, [t.glassLevel]);

  return (
    <LangProvider>
      <React.Fragment>
        {t.showAmbient && (
          <React.Fragment>
            <div className="ambient"><div className="v"></div></div>
            <div className="grain"></div>
            <div className="cursor-spotlight"></div>
          </React.Fragment>
        )}

        <Nav />
        <Hero />
        <Marquee />
        <DemoVideo />
        <Features />
        <AppPreview />
        <Steps />
        <Download />
        <Partner />
        <FAQ />
        <Footer />
        <StickyCta />

        <TweaksPanel title="Tweaks">
        <TweakSection label="포인트 컬러">
          <TweakColor
            label="팔레트"
            value={t.palette}
            options={[
              ["#00F2EA", "#FF0050", "#A78BFA"],
              ["#00E5FF", "#FF2D87", "#7C3AED"],
              ["#25F4EE", "#FE2C55", "#7C3AED"],
              ["#A855F7", "#00E5FF", "#FF2D87"],
              ["#00FFA3", "#FF2D87", "#7C3AED"],
              ["#FFB344", "#FF2D87", "#7C3AED"],
            ]}
            onChange={(v) => setTweak("palette", v)}
          />
        </TweakSection>
        <TweakSection label="분위기">
          <TweakRadio
            label="글래스"
            value={t.glassLevel}
            options={[
              { value: "low",    label: "약" },
              { value: "medium", label: "중" },
              { value: "high",   label: "강" },
            ]}
            onChange={(v) => setTweak("glassLevel", v)}
          />
          <TweakToggle
            label="배경 글로우"
            value={t.showAmbient}
            onChange={(v) => setTweak("showAmbient", v)}
          />
        </TweakSection>
        </TweaksPanel>
      </React.Fragment>
    </LangProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
