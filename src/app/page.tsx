"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import F1Overlay from "@/components/F1Overlay";

const F1Scene = dynamic(() => import("@/components/F1Scene"), { ssr: false, loading: () => null });

type Stage = "landing" | "loading" | "experience";

/* ── Speed streaks decoration ───────────────────────────────────────────── */
const STREAKS = [
  { w: 180, top: "12%", delay: 0 },   { w: 110, top: "27%", delay: 0.7 },
  { w: 260, top: "44%", delay: 1.4 }, { w: 140, top: "59%", delay: 0.3 },
  { w: 220, top: "73%", delay: 1.1 }, { w: 90,  top: "88%", delay: 0.6 },
];

function Streaks() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {STREAKS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: s.top, left: 0,
          height: "1px", width: `${s.w}px`,
          background: "linear-gradient(to right, transparent, rgba(0,210,190,0.35), transparent)",
          animation: `streak 4s linear ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ── Animated Mouse Parallax Container ──────────────────────────────────── */
function MouseParallax({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    setPos({ x, y });
  };
  return (
    <div onMouseMove={handleMouseMove} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `translate(${-pos.x}px, ${-pos.y}px)`, transition: "transform 0.1s out" }}>
        {children}
      </div>
    </div>
  );
}

/* ── Landing Page ───────────────────────────────────────────────────────── */
function LandingPage({ onStart }: { onStart: () => void }) {
  const [hot, setHot] = useState(false);
  const STATS = [{ v: "1000+", u: "HP" }, { v: "2.6", u: "0–100 s" }, { v: "340", u: "km/h max" }];

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {/* Subtle radial gradient overlay so text is readable over 3D background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(3,4,8,0.4) 0%, rgba(3,4,8,0.8) 100%)", pointerEvents: "none" }} />
      <Streaks />

      {/* Top bar */}
      <div style={{ position: "absolute", top: 22, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 28px", animation: "appear .9s ease-out .2s both" }}>
        <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(0,210,190,.65)", textShadow: "0 0 10px rgba(0,0,0,0.8)" }}>Mercedes‑AMG Petronas F1 Team</span>
        <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,.3)", textShadow: "0 0 10px rgba(0,0,0,0.8)" }}>Season 2023</span>
      </div>

      <MouseParallax>
        <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 20px" }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(0,210,190,.8)", marginBottom: 14, animation: "appear .9s ease-out .4s both", textShadow: "0 0 20px rgba(0,0,0,0.8)" }}>
            Constructors · Formula One · W14
          </p>
          <h1 style={{ fontSize: "clamp(70px,16vw,190px)", fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(255,255,255,0.05)", WebkitTextStroke: "2px rgba(255,255,255,0.8)", margin: 0, textShadow: "0 0 40px rgba(0,210,190,.15)", animation: "appear .9s ease-out .5s both" }}>
            W14
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 8, animation: "appear .9s ease-out .65s both" }}>
            <div style={{ height: 1, width: 60, background: "rgba(0,210,190,.6)" }} />
            <span style={{ fontFamily: "monospace", fontSize: "clamp(10px,1.2vw,14px)", letterSpacing: "0.5em", textTransform: "uppercase", color: "#00D2BE", textShadow: "0 0 10px rgba(0,0,0,0.8)" }}>E Performance</span>
            <div style={{ height: 1, width: 60, background: "rgba(0,210,190,.6)" }} />
          </div>
          <p style={{ fontSize: "clamp(13px,1.8vw,18px)", color: "rgba(220,230,240,.9)", marginTop: 28, letterSpacing: "0.06em", fontWeight: 300, animation: "appear .9s ease-out .8s both", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            Where Engineering Becomes Art
          </p>

          <div style={{ display: "flex", gap: "clamp(30px,6vw,80px)", justifyContent: "center", marginTop: 40, animation: "appear .9s ease-out 1s both" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(24px,3.8vw,38px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, textShadow: "0 0 15px rgba(0,0,0,0.5)" }}>{s.v}</div>
                <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(0,210,190,.7)", marginTop: 6, textShadow: "0 0 10px rgba(0,0,0,0.8)" }}>{s.u}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, animation: "appear .9s ease-out 1.2s both" }}>
            <button
              onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)}
              onClick={onStart}
              style={{
                padding: "16px 50px", background: hot ? "rgba(0,210,190,.15)" : "rgba(0,0,0,0.4)",
                border: `1px solid ${hot ? "#00D2BE" : "rgba(0,210,190,.5)"}`,
                color: "#00D2BE", fontFamily: "monospace", fontSize: 11, fontWeight: "bold",
                letterSpacing: "0.5em", textTransform: "uppercase", cursor: "pointer",
                transition: "all .3s ease", backdropFilter: "blur(5px)",
                boxShadow: hot ? "0 0 35px rgba(0,210,190,.25)" : "none",
              }}
            >
              Enter Experience <span style={{ marginLeft: 10 }}>→</span>
            </button>
          </div>
        </div>
      </MouseParallax>

      {/* Bottom accent line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(to right, transparent, #00D2BE, transparent)", animation: "horizon .9s ease-out .8s both", transformOrigin: "left" }} />
    </div>
  );
}

/* ── Loading Screen ─────────────────────────────────────────────────────── */
// ... (LoadingScreen remains unchanged structurally)
const LOAD_TEXTS = ["CONNECTING TO TELEMETRY", "FETCHING AERO MAPS", "POWERING MGU-K", "INITIALIZING 3D ENGINE", "SYSTEMS OPTIMAL"];

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0);
  const [txt, setTxt]  = useState(LOAD_TEXTS[0]);
  const DURATION = 2800;

  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * 100);
      setPct(val);
      setTxt(LOAD_TEXTS[Math.min(LOAD_TEXTS.length - 1, Math.floor(eased * LOAD_TEXTS.length))]);
      if (p < 1) { raf = requestAnimationFrame(tick); }
      else { setTimeout(onComplete, 350); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#030408", zIndex: 200,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "monospace",
    }}>
      <div style={{ width: 56, height: 56, border: "2px solid rgba(0,210,190,.1)", borderTop: "2px solid #00D2BE", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 28 }} />
      <div style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(0,210,190,.75)", marginBottom: 18, minHeight: 12 }}>{txt}</div>
      <div style={{ width: 220, height: 2, background: "rgba(255,255,255,.05)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(to right, rgba(0,210,190,.4), #00D2BE)", boxShadow: "0 0 8px rgba(0,210,190,.6)", transition: "width .1s linear" }} />
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: "0.2em", marginTop: 10 }}>{String(pct).padStart(3, "0")} %</div>
    </div>
  );
}

/* ── Scene Label component (used in scrollytelling) ─────────────────────── */
function SceneLabel({ side = "left", tag, title, accent, body }: { side?: "left" | "right" | "center"; tag: string; title: React.ReactNode; accent?: string; body: string; }) {
  const align = side === "right" ? "flex-end" : side === "center" ? "center" : "flex-start";
  const textAlign = side === "right" ? "right" : side === "center" ? "center" : "left";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align, textAlign, maxWidth: 280, pointerEvents: "auto" }}>
      <span style={{ display: "inline-block", fontSize: 8, fontFamily: "monospace", letterSpacing: "0.25em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(0,210,190,.25)", color: "#00D2BE", background: "rgba(0,210,190,.05)", marginBottom: 10 }}>{tag}</span>
      <h2 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: accent ?? "#F2F4F8", lineHeight: 1.2, marginBottom: 10 }}>{title}</h2>
      <p style={{ fontSize: "clamp(12px,1.2vw,14px)", lineHeight: 1.65, color: "rgba(180,195,212,.75)", background: "rgba(3,4,8,.7)", backdropFilter: "blur(12px)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>{body}</p>
    </div>
  );
}

/* ── Full scrollytelling experience ─────────────────────────────────────── */
function Experience() {
  return (
    <main className="experience-enter" style={{ background: "#07080E", color: "#F2F4F8", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Fixed 3D canvas */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <F1Scene />
      </div>

      {/* Scrollytelling container */}
      <div style={{ position: "relative", zIndex: 10, pointerEvents: "none" }}>
        {/* Scene 1 — Pure visual startup */}
        <section style={{ minHeight: "120vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", paddingBottom: "10vh" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 0.6 }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "#00D2BE", textTransform: "uppercase", animation: "labelIn 1s ease 1s both" }}>Scroll to engage system</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #00D2BE, transparent)", animation: "fadeIn 1s ease 1.2s both" }} />
          </div>
        </section>

        {/* Scene 2 — Introduce Car via scroll */}
        <section style={{ minHeight: "160vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", padding: "0 clamp(20px,6vw,72px) 14vh" }}>
          <div style={{ pointerEvents: "auto", maxWidth: 360 }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(0,210,190,.7)", marginBottom: 12 }}>The 2023 Challenger</p>
            <h1 style={{ fontSize: "clamp(28px,5vw,50px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 12, background: "linear-gradient(135deg, #F2F4F8 40%, rgba(0,210,190,.85))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mercedes-AMG<br /><span style={{ color: "#00D2BE", WebkitTextFillColor: "#00D2BE" }}>W14 E Performance</span></h1>
            <p style={{ fontSize: 14, color: "rgba(180,195,212,.7)", lineHeight: 1.6, background: "rgba(3,4,8,.6)", backdropFilter: "blur(10px)", padding: "12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)" }}>The pinnacle of motorsport engineering — aerodynamics and hybrid power fused into one single carbon-fibre entity.</p>
          </div>
        </section>

        {/* Scene 3 — Front wing */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", padding: "0 clamp(20px,6vw,72px)" }}>
          <SceneLabel side="right" tag="01 · Aerodynamics" title={<>Front Wing <span style={{ color: "#00D2BE" }}>Aero</span></>} body="Precision-engineered flaps and endplates channel airflow around the front tires — generating critical downforce." />
        </section>

        {/* Scene 4 — Sidepod */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "0 clamp(20px,6vw,72px)" }}>
          <SceneLabel side="left" tag="02 · Cooling" title={<><span style={{ color: "#00D2BE" }}>Zero‑pod</span> Evolution</>} body="Sculpted sidepod minimizes the cooling inlet profile while maintaining thermal efficiency — slicing through air with surgical precision." />
        </section>

        {/* Scene 5 — Engine */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", padding: "0 clamp(20px,6vw,72px) 16vh" }}>
          <SceneLabel side="right" tag="03 · Power Unit" accent="#00D2BE" title="V6 Turbo Hybrid" body="1.6L turbocharged V6 paired with MGU-K and MGU-H energy recovery. 1000+ HP of thermal efficiency seamlessly distributed." />
        </section>

        {/* Scene 6 — Cockpit */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", padding: "14vh clamp(20px,6vw,72px) 0" }}>
          <div style={{ pointerEvents: "auto", textAlign: "center", maxWidth: 280 }}>
            <span style={{ display: "inline-block", fontSize: 8, fontFamily: "monospace", letterSpacing: "0.25em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(0,210,190,.25)", color: "#00D2BE", background: "rgba(0,210,190,.05)", marginBottom: 10 }}>04 · Driver Interface</span>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "#F2F4F8", marginBottom: 10 }}>Command Center</h2>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(180,195,212,.7)", background: "rgba(3,4,8,.6)", backdropFilter: "blur(12px)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)" }}>The bespoke steering wheel gives the driver instant control over brake bias, ERS deployment, and differential settings.</p>
          </div>
        </section>

        {/* Scene 7 — Exploded */}
        <section style={{ minHeight: "200vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", padding: "0 clamp(20px,6vw,72px) 14vh" }}>
          <SceneLabel side="left" tag="05 · Engineering" title={<><span style={{ color: "rgba(130,145,160,.85)" }}>De</span>constructed</>} body="Over 10,000 components working as one — carbon fibre, titanium, and advanced electronics engineered for absolute performance." />
        </section>

        {/* Scene 8 — Race mode */}
        <section style={{ minHeight: "150vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 20px", textAlign: "center" }}>
          <div style={{ pointerEvents: "auto" }}>
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(0,210,190,.65)", marginBottom: 12 }}>Full Performance Unlocked</p>
            <h2 style={{ fontSize: "clamp(50px,10vw,100px)", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.03em", background: "linear-gradient(135deg, #00D2BE, rgba(255,255,255,.9))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px rgba(0,210,190,.4))", marginBottom: 10 }}>Race Mode</h2>
            <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,210,190,.8)" }}>Deploying maximum performance</p>
          </div>
        </section>
      </div>

      {/* Fixed HUD */}
      <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none" }}>
        <F1Overlay />
      </div>
    </main>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────── */
export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const handleStart   = useCallback(() => setStage("loading"), []);
  const handleLoaded  = useCallback(() => setStage("experience"), []);

  return (
    <>
      {stage === "landing"     && <LandingPage onStart={handleStart} />}
      {stage === "loading"     && (
        <>
          <LoadingScreen onComplete={handleLoaded} />
          {/* Mount 3D in background so it's ready instantly */}
          <div style={{ position: "fixed", inset: 0, opacity: 0, pointerEvents: "none", zIndex: -1 }}>
            <F1Scene />
          </div>
        </>
      )}
      {stage === "experience"  && <Experience />}
    </>
  );
}
