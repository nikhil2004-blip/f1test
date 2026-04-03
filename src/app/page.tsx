"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import F1Overlay from "@/components/F1Overlay";

const F1Scene = dynamic(() => import("@/components/F1Scene"), { ssr: false, loading: () => null });

type Stage = "landing" | "loading" | "experience";

/* ── Interactive Background Components ───────────────────────────── */

const TelemetryFragment = ({ x, y, delay }: { x: number; y: number; delay: number }) => {
  const [mounted, setMounted] = useState(false);
  const fragments = ["MGU-K: ACTIVE", "FLOW: 100kg/h", "TEMP: 102°C", "ERS: 98%", "LAT: 43.734", "LON: 7.421"];
  const [text, setText] = useState("");

  useEffect(() => {
    setMounted(true);
    setText(fragments[Math.floor(Math.random() * fragments.length)]);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        fontFamily: "var(--font-mono)",
        fontSize: "7px",
        color: "rgba(0,210,190,0.3)",
        letterSpacing: "0.1em",
        whiteSpace: "nowrap",
        animation: `flicker 4s infinite ${delay}s`,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

const BackgroundInteractions = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1 }}>
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-10%",
        right: "-10%",
        height: "60%",
        background: `linear-gradient(to top, rgba(0,210,190,0.05) 1px, transparent 1px), 
                     linear-gradient(to right, rgba(0,210,190,0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        transform: `perspective(800px) rotateX(60deg) translateY(${mouse.y * 0.5}px) translateX(${mouse.x * 0.5}px)`,
        maskImage: "linear-gradient(to top, black, transparent)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle 400px at ${50 + mouse.x * 2}% ${50 + mouse.y * 2}%, rgba(0,210,190,0.08), transparent 80%)`,
        pointerEvents: "none",
      }} />

      {[...Array(12)].map((_, i) => (
        <TelemetryFragment
          key={i}
          x={10 + (i * 15) % 80}
          y={20 + (i * 23) % 60}
          delay={i * 0.5}
        />
      ))}
    </div>
  );
};

/* ── Corner bracket decoration ──────────────────────────────────────── */
const bracketStyle = (pos: { top?: string; bottom?: string; left?: string; right?: string }): React.CSSProperties => ({
  position: "absolute", ...pos, width: 40, height: 40, pointerEvents: "none",
  borderTop: pos.bottom ? "none" : "2px solid rgba(0,210,190,0.6)",
  borderBottom: pos.top ? "none" : "2px solid rgba(0,210,190,0.6)",
  borderLeft: pos.right ? "none" : "2px solid rgba(0,210,190,0.6)",
  borderRight: pos.left ? "none" : "2px solid rgba(0,210,190,0.6)",
  zIndex: 100,
});

/* ── Landing Page ────────────────────────────────────────────────── */
function LandingPage({ onStart }: { onStart: () => void }) {
  const [hot, setHot] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [glitchStyle, setGlitchStyle] = useState({ x: 0, skew: 0 });

  const STATS = [{ v: "1000+", u: "HP" }, { v: "2.6", u: "0–100 s" }, { v: "340", u: "km/h max" }];

  useEffect(() => {
    const fire = () => {
      setGlitchStyle({ x: Math.random() * 6 - 3, skew: Math.random() * 3 - 1.5 });
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);

      setTimeout(() => {
        setGlitchStyle({ x: Math.random() * 6 - 3, skew: Math.random() * 3 - 1.5 });
        setGlitch(true);
        setTimeout(() => setGlitch(false), 130);
      }, 250);
    };
    const id = setInterval(fire, 3500);
    fire();
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#020408" }}>

      <BackgroundInteractions />

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)"
      }} />

      {["15%", "30%", "50%", "70%", "85%"].map((l, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, bottom: 0, left: l, width: "1px",
          background: `linear-gradient(to bottom, transparent, rgba(0,210,190,${0.03 + i * 0.01}), transparent)`,
          pointerEvents: "none", zIndex: 2
        }} />
      ))}

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, display: "flex",
        justifyContent: "space-between", alignItems: "center",
        padding: "18px 28px", borderBottom: "1px solid rgba(0,210,190,0.1)",
        animation: "appear .9s ease-out .2s both", zIndex: 50
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.35em",
          textTransform: "uppercase", color: "rgba(0,210,190,.7)"
        }}>Mercedes‑AMG Petronas F1 Team</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.2em",
            color: "rgba(255,255,255,.25)"
          }}>▶ POWER UNIT ACTIVE</span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.2em",
            color: "rgba(255,255,255,.25)"
          }}>Season 2023</span>
        </div>
      </div>

      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column", padding: "0 24px", zIndex: 40
      }}>

        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.7em",
          textTransform: "uppercase", color: "rgba(0,210,190,.6)",
          marginBottom: 12, animation: "appear .9s ease-out .3s both"
        }}>
          Constructors · Formula One · W14
        </p>

        <div style={{ position: "relative", lineHeight: 1, animation: "appear .8s ease-out .4s both" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(80px,18vw,210px)", fontWeight: 900, fontStyle: "italic",
            letterSpacing: "0.04em", margin: 0, userSelect: "none",
            position: "absolute", top: 0, left: 0,
            color: "transparent",
            textShadow: "0 0 80px rgba(0,210,190,0.35), 0 0 160px rgba(0,210,190,0.2)",
            filter: "blur(8px)",
          }}>W14</h1>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(80px,18vw,210px)", fontWeight: 900, fontStyle: "italic",
            letterSpacing: "0.04em", margin: 0, userSelect: "none",
            color: glitch ? "rgba(0,210,190,0.9)" : "rgba(255,255,255,0.04)",
            WebkitTextStroke: glitch ? "2px #00D2BE" : "2px rgba(255,255,255,0.85)",
            textShadow: glitch
              ? "4px 0 rgba(255,0,80,0.7), -4px 0 rgba(0,200,255,0.7), 0 0 60px rgba(0,210,190,0.6)"
              : "0 0 40px rgba(0,210,190,0.1)",
            transform: glitch ? `translate(${glitchStyle.x}px,0) skewX(${glitchStyle.skew}deg)` : "none",
            transition: glitch ? "none" : "all 0.15s ease",
            position: "relative",
          }}>W14</h1>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          marginTop: 4, animation: "appear .9s ease-out .6s both"
        }}>
          <div style={{ height: 1, width: 80, background: "linear-gradient(to right, transparent, rgba(0,210,190,.7))" }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.55em",
            textTransform: "uppercase", color: "#00D2BE",
            textShadow: "0 0 12px rgba(0,210,190,0.6)"
          }}>E Performance</span>
          <div style={{ height: 1, width: 80, background: "linear-gradient(to left, transparent, rgba(0,210,190,.7))" }} />
        </div>

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "clamp(13px,1.6vw,18px)", color: "rgba(200,215,230,.65)",
          marginTop: 22, letterSpacing: "0.15em", fontWeight: 400,
          animation: "appear .9s ease-out .75s both", textTransform: "uppercase"
        }}>
          Where Engineering Becomes Art
        </p>

        <div style={{
          display: "flex", gap: "clamp(30px,7vw,90px)", justifyContent: "center",
          marginTop: 44, animation: "appear .9s ease-out .9s both",
          padding: "22px 40px", border: "1px solid rgba(0,210,190,0.12)",
          background: "rgba(0,210,190,0.03)", backdropFilter: "blur(4px)"
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(20px,3.2vw,34px)", fontWeight: 700, color: "#fff",
                letterSpacing: "0.05em", lineHeight: 1
              }}>{s.v}</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.35em",
                textTransform: "uppercase", color: "rgba(0,210,190,.65)", marginTop: 8
              }}>{s.u}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 44, animation: "appear .9s ease-out 1.1s both", position: "relative" }}>
          {hot && <div style={{
            position: "absolute", inset: -8, borderRadius: 2,
            background: "rgba(0,210,190,0.1)", filter: "blur(12px)", zIndex: 0
          }} />}
          <button
            onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)}
            onClick={onStart}
            style={{
              position: "relative", zIndex: 1,
              padding: "16px 60px",
              background: hot ? "rgba(0,210,190,0.12)" : "rgba(0,0,0,0.5)",
              border: `1px solid ${hot ? "#00D2BE" : "rgba(0,210,190,.4)"}`,
              color: hot ? "#fff" : "#00D2BE",
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: "bold",
              letterSpacing: "0.5em", textTransform: "uppercase", cursor: "pointer",
              transition: "all .25s ease", backdropFilter: "blur(8px)",
              boxShadow: hot ? "0 0 40px rgba(0,210,190,.3), inset 0 0 20px rgba(0,210,190,0.05)" : "none",
              clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            }}
          >
            Enter Experience <span style={{ marginLeft: 10 }}>›</span>
          </button>
        </div>
      </div>

      <div style={bracketStyle({ top: "30px", left: "20px" })} />
      <div style={bracketStyle({ top: "30px", right: "20px" })} />
      <div style={bracketStyle({ bottom: "20px", left: "20px" })} />
      <div style={bracketStyle({ bottom: "20px", right: "20px" })} />

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(to right, transparent, #00D2BE, transparent)",
        animation: "horizon .9s ease-out .8s both", transformOrigin: "left", zIndex: 100
      }} />

      <style jsx global>{`
        @keyframes flicker {
          0%, 100% { opacity: 0; transform: translateY(0); }
          5% { opacity: 1; }
          90% { opacity: 1; }
          95% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes appear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

/* ── Improved F1 Loading Screen ─────────────────────────────────────────── */
const LOAD_TEXTS = ["CONNECTING TO TELEMETRY", "FETCHING AERO MAPS", "POWERING MGU-K", "INITIALIZING 3D ENGINE", "SYSTEMS OPTIMAL"];

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0);
  const [txt, setTxt] = useState(LOAD_TEXTS[0]);
  const DURATION = 4200;

  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 4);
      const val = Math.floor(eased * 100);
      setPct(val);
      setTxt(LOAD_TEXTS[Math.min(LOAD_TEXTS.length - 1, Math.floor(eased * LOAD_TEXTS.length))]);
      if (p < 1) { raf = requestAnimationFrame(tick); }
      else { setTimeout(onComplete, 500); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#010204", zIndex: 500,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", overflow: "hidden"
    }}>
      {/* Background Data Grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none",
        backgroundImage: `radial-gradient(#00D2BE 1px, transparent 0)`,
        backgroundSize: "30px 30px"
      }} />

      {/* Main Container */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", width: "100%", maxWidth: 400, padding: "0 40px" }}>

        <div style={{
          fontSize: 9, letterSpacing: "0.6em", color: "#00D2BE", marginBottom: 30,
          textTransform: "uppercase", fontWeight: "bold", animation: "pulse 1.5s infinite"
        }}>
          Status: {txt}
        </div>

        {/* F1 Rev-Limit Style Bar */}
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 12 }}>
          {[...Array(20)].map((_, i) => {
            const isActive = pct > (i / 20) * 100;
            let color = "rgba(255,255,255,0.05)";
            if (isActive) {
              if (i < 10) color = "#00D2BE"; // Petronas Teal
              else if (i < 16) color = "#facc15"; // Yellow
              else color = "#ef4444"; // Red (Overrev)
            }
            return (
              <div key={i} style={{
                width: 12, height: 24, borderRadius: 1, background: color,
                boxShadow: isActive ? `0 0 15px ${color}66` : "none",
                transition: "background 0.1s ease"
              }} />
            );
          })}
        </div>

        <div style={{ fontSize: 40, fontWeight: 900, fontStyle: "italic", color: "#fff", letterSpacing: "-0.05em", opacity: 0.9 }}>
          {String(pct).padStart(3, "0")}<span style={{ fontSize: 14, color: "#00D2BE", marginLeft: 4 }}>%</span>
        </div>

        <div style={{ marginTop: 40, height: 1, width: "100%", background: "linear-gradient(to right, transparent, rgba(0,210,190,0.3), transparent)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, opacity: 0.3, fontSize: 7, letterSpacing: "0.2em", color: "#fff" }}>
          <span>HYBRID ENERGY: {pct}%</span>
          <span>SYNC: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ── Experience ────────────────────────────────────────────────────────── */
function Experience() {
  return (
    <main className="experience-enter" style={{ background: "#07080E", color: "#F2F4F8", minHeight: "100vh", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <F1Scene />
      </div>

      <div style={{ position: "relative", zIndex: 10, pointerEvents: "none" }}>

        {/* Sc1 — Initial Hero (camera wide) */}
        <section style={{ minHeight: "120vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", paddingBottom: "10vh" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 0.6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em", color: "#00D2BE", textTransform: "uppercase" }}>Scroll to explore the machine</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #00D2BE, transparent)" }} />
          </div>
        </section>

        {/* Sc2 — W14 Intro (camera pulls in slightly) */}
        <section style={{ minHeight: "160vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", padding: "0 clamp(20px,6vw,72px) 14vh" }}>
          <div style={{ pointerEvents: "auto", maxWidth: 380 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(0,210,190,.7)", marginBottom: 12 }}>The 2023 Challenger</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 14, background: "linear-gradient(135deg, #F2F4F8 40%, rgba(0,210,190,.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mercedes-AMG<br /><span style={{ color: "#00D2BE", WebkitTextFillColor: "#00D2BE" }}>W14 E Performance</span></h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(180,195,212,.7)", lineHeight: 1.6, background: "rgba(3,4,8,.65)", backdropFilter: "blur(10px)", padding: "14px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)", borderLeft: "3px solid rgba(0,210,190,0.5)" }}>
              The pinnacle of motorsport engineering — aerodynamics and hybrid power fused into one single carbon-fibre entity at the edge of what physics allows.
            </p>
          </div>
        </section>

        {/* Sc3 — Front Wing */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", padding: "0 clamp(20px,6vw,72px) 12vh" }}>
          <div style={{ pointerEvents: "auto", maxWidth: 340, textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(0,210,190,.6)", marginBottom: 10 }}>01 / Aerodynamics</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, marginBottom: 12, color: "#fff" }}>Front Wing<br /><span style={{ color: "#00D2BE", fontSize: "0.7em" }}>35% Front Downforce</span></h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(180,195,212,.65)", lineHeight: 1.65, background: "rgba(3,4,8,.6)", backdropFilter: "blur(10px)", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)", borderRight: "3px solid rgba(0,210,190,0.5)" }}>
              Five-element cascade endplate generates 35% of the car's total downforce, precisely managing front-to-rear aero balance at 300+ km/h.
            </p>
          </div>
        </section>

        {/* Sc4 — Zero-Pod Sidepod */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", padding: "0 clamp(20px,6vw,72px) 12vh" }}>
          <div style={{ pointerEvents: "auto", maxWidth: 340 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(0,210,190,.6)", marginBottom: 10 }}>02 / Bodywork</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, marginBottom: 12, color: "#fff" }}>Zero-Pod<br /><span style={{ color: "#00D2BE", fontSize: "0.7em" }}>Minimal Cooling Cell</span></h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(180,195,212,.65)", lineHeight: 1.65, background: "rgba(3,4,8,.6)", backdropFilter: "blur(10px)", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)", borderLeft: "3px solid rgba(0,210,190,0.5)" }}>
              Mercedes' radical zero-sidepod concept eliminates conventional cooling inlets entirely, channelling airflow through a continuous undercut to feed the rear diffuser.
            </p>
          </div>
        </section>

        {/* Sc5 — V6 Power Unit */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", padding: "0 clamp(20px,6vw,72px) 12vh" }}>
          <div style={{ pointerEvents: "auto", maxWidth: 340, textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#E3001B", marginBottom: 10 }}>03 / Power Unit</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, marginBottom: 12, color: "#fff" }}>V6 Turbo<br /><span style={{ color: "#E3001B", fontSize: "0.7em" }}>1000+ HP Hybrid</span></h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(180,195,212,.65)", lineHeight: 1.65, background: "rgba(3,4,8,.6)", backdropFilter: "blur(10px)", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)", borderRight: "3px solid rgba(227,0,27,0.6)" }}>
              A 1.6L V6 turbocharged unit with MGU-H and MGU-K recovery systems delivering over 1000 combined horsepower — the most complex engine ever built for road racing.
            </p>
          </div>
        </section>

        {/* Sc6 — Cockpit / Halo */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", padding: "0 clamp(20px,6vw,72px) 12vh" }}>
          <div style={{ pointerEvents: "auto", maxWidth: 340 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 10 }}>04 / Safety</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, marginBottom: 12, color: "#fff" }}>Halo<br /><span style={{ color: "#C9A84C", fontSize: "0.7em" }}>Titanium Safety Arc</span></h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(180,195,212,.65)", lineHeight: 1.65, background: "rgba(3,4,8,.6)", backdropFilter: "blur(10px)", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)", borderLeft: "3px solid rgba(201,168,76,0.6)" }}>
              Machined from aircraft-grade titanium, the Halo structure withstands 125kN of load — equivalent to the weight of a double-decker bus — protecting the driver's head.
            </p>
          </div>
        </section>

        {/* Sc7 — Exploded View */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 20px" }}>
          <div style={{ pointerEvents: "auto", textAlign: "center", maxWidth: 500 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(0,210,190,.6)", marginBottom: 14 }}>05 / System Architecture</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, marginBottom: 16, color: "#fff" }}>Exploded<br /><span style={{ color: "#00D2BE" }}>Blueprint View</span></h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(180,195,212,.65)", lineHeight: 1.65, background: "rgba(3,4,8,.65)", backdropFilter: "blur(10px)", padding: "14px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)", borderTop: "2px solid rgba(0,210,190,0.5)" }}>
              Over 80,000 individual components disassembled into their constituent systems. Every part placed with micron-level precision to within 0.1g mass targets.
            </p>
          </div>
        </section>

        {/* Sc8 — Race Mode */}
        <section style={{ minHeight: "180vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "0 clamp(20px,6vw,72px)" }}>
          <div style={{ pointerEvents: "auto", maxWidth: 400 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(0,210,190,.6)", marginBottom: 14 }}>06 / Track Ready</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, marginBottom: 16, letterSpacing: "-0.02em" }}>
              <span style={{ display: "block", background: "linear-gradient(135deg, #fff 40%, #00D2BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Race</span>
              <span style={{ display: "block", color: "#00D2BE", WebkitTextFillColor: "#00D2BE" }}>Mode.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(180,195,212,.7)", lineHeight: 1.7, background: "rgba(3,4,8,.65)", backdropFilter: "blur(10px)", padding: "16px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)", borderLeft: "3px solid #00D2BE", marginBottom: 24 }}>
              From pit lane to 340 km/h in under 8 seconds. Every system primed. Every parameter optimised. The W14 at its most lethal.
            </p>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[["339", "km/h Top Speed"], ["1.8s", "Pit Stop Target"], ["15,000", "RPM Redline"]].map(([v, l]) => (
                <div key={l} style={{ pointerEvents: "auto" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(0,210,190,.6)", marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none" }}>
        <F1Overlay />
      </div>
    </main>
  );
}

/* ── Electrifying F1 Engine Synth ────────────────────────────────────────── */
const playStartSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const broom = t + 0.1; 
    const end = broom + 4.4; // Covers the 4.2s loading screen perfectly

    // Distortion Curve for maximum bite
    const distortion = ctx.createWaveShaper();
    const makeDistortionCurve = (amount: number) => {
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      for (let i = 0; i < n_samples; ++i) {
        const x = i * 2 / n_samples - 1;
        curve[i] = (3 + amount) * x * 20 * (Math.PI / 180) / (Math.PI + amount * Math.abs(x));
      }
      return curve;
    };
    distortion.curve = makeDistortionCurve(500);

    // Dynamic engine layering function
    const createV6Layer = (freq: number, type: OscillatorType, detune: number, startTime: number, stopTime: number, vol: number, spike = 2.5) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const f = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * spike, startTime + 0.15); // Powerful bite
      osc.frequency.exponentialRampToValueAtTime(freq * 1.1, stopTime); // Sustained idle
      osc.detune.setValueAtTime(detune, startTime);

      f.type = "bandpass";
      f.frequency.setValueAtTime(freq * 3, startTime);
      f.frequency.exponentialRampToValueAtTime(freq * 8, startTime + 0.3);
      f.Q.setValueAtTime(4, startTime);

      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(vol, startTime + 0.04);
      g.gain.setValueAtTime(vol, stopTime - 0.1); // HOLD full volume until the very end
      g.gain.linearRampToValueAtTime(0.001, stopTime);  // only 0.1s fade to avoid abrupt cut

      osc.connect(f); f.connect(distortion); distortion.connect(g); g.connect(ctx.destination);
      osc.start(startTime); osc.stop(stopTime);
    };

    // THE BROOOOOOM (Sustained & Loud)
    createV6Layer(58, "sawtooth", 10, broom, end, 0.65, 2.5);   // Sub thunder
    createV6Layer(116, "sawtooth", -15, broom, end, 0.55, 2.5); // Mid buzz
    createV6Layer(116, "square", 20, broom + 0.01, end, 0.4, 2.5); // Electric aggression
    createV6Layer(232, "sawtooth", 30, broom + 0.03, end, 0.2, 2.5); // High scream

    // Ignition Crackles
    for(let i = 0; i < 20; i++) {
      const pt = broom + Math.random() * 0.8;
      const pop = ctx.createOscillator();
      const pg = ctx.createGain();
      pop.type = "sawtooth";
      pop.frequency.setValueAtTime(Math.random() * 120 + 40, pt);
      pg.gain.setValueAtTime(0.8, pt);
      pg.gain.exponentialRampToValueAtTime(0.01, pt + 0.06);
      pop.connect(pg); pg.connect(ctx.destination);
      pop.start(pt); pop.stop(pt + 0.06);
    }



  } catch (e) {
    console.warn("Audio blocked");
  }
};


/* ── Root ───────────────────────────────────────────────────────────────── */
export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const handleStart = useCallback(() => {
    playStartSound();
    setStage("loading");
  }, []);
  const handleLoaded = useCallback(() => setStage("experience"), []);

  return (
    <>
      {stage === "landing" && <LandingPage onStart={handleStart} />}
      {stage === "loading" && (
        <>
          <LoadingScreen onComplete={handleLoaded} />
          <div style={{ position: "fixed", inset: 0, opacity: 0, pointerEvents: "none", zIndex: -1 }}>
            <F1Scene />
          </div>
        </>
      )}
      {stage === "experience" && <Experience />}
    </>
  );
}