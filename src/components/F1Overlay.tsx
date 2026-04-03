"use client";

import { useEffect, useRef, useState } from "react";

// ── Tiny mono label + value ─────────────────────────────────────────────────
function Stat({ label, value, unit, glow }: { label: string; value: string | number; unit: string; glow?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: "7px", color: "rgba(0,210,190,0.6)" }}
      >
        {label}
      </span>
      <span
        className="font-mono font-black leading-none"
        style={{
          fontSize: "18px",
          color: glow ? "#00D2BE" : "#fff",
          textShadow: glow ? "0 0 12px rgba(0,210,190,0.7)" : undefined,
        }}
      >
        {value}
        <span
          className="font-mono font-normal"
          style={{ fontSize: "8px", color: "rgba(0,210,190,0.8)", marginLeft: "2px" }}
        >
          {unit}
        </span>
      </span>
    </div>
  );
}

// ── Thin bar ────────────────────────────────────────────────────────────────
function Bar({ value, max, color = "#00D2BE" }: { value: number; max: number; color?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "2px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "2px",
        marginTop: "6px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(100, (value / max) * 100)}%`,
          background: color,
          boxShadow: `0 0 6px ${color}`,
          transition: "width 0.25s ease-out",
        }}
      />
    </div>
  );
}

const GLASS: React.CSSProperties = {
  background: "rgba(6,6,8,0.65)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "10px",
  padding: "10px 12px",
};

export default function F1Overlay() {
  const [speed, setSpeed] = useState(0);
  const [rpm,   setRpm]   = useState(8000);
  const [gear,  setGear]  = useState(1);
  const [gf,    setGf]    = useState("0.0");

  // throttle scroll listener with rAF
  const rafRef  = useRef<number | null>(null);
  const lastRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollY    = window.scrollY;
        const maxScroll  = document.body.scrollHeight - window.innerHeight;
        const p          = Math.max(0, Math.min(1, scrollY / maxScroll));
        setSpeed(Math.floor(p * 340));
        setRpm(Math.floor(8000 + p * 7000));
        setGear(Math.max(1, Math.ceil(p * 8)));
        setGf((p * 5.5).toFixed(1));
        lastRef.current  = scrollY;
        rafRef.current   = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >

      {/* ── TOP ROW — system checks left / mode flags right ─────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

        {/* Left: system statuses */}
        <div style={{ ...GLASS }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {[
              ["SYS", "OK"],
              ["MGU‑K", "ON"],
              ["MGU‑H", "ON"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  fontFamily: "monospace",
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "rgba(0,210,190,0.65)" }}>{k}</span>
                <span style={{ color: v === "OK" || v === "ON" ? "#fff" : "rgba(255,255,255,0.35)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: DRS / ERS / B-Bias */}
        <div style={{ ...GLASS }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", textAlign: "right" }}>
            {[
              ["DRS", "DISABLED", false],
              ["ERS", "DEPLOY",   true],
              ["B-BIAS", "56.5%", true],
            ].map(([k, v, hi]) => (
              <div
                key={k as string}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  fontFamily: "monospace",
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "rgba(0,210,190,0.65)" }}>{k}</span>
                <span style={{ color: hi ? "#fff" : "rgba(255,255,255,0.25)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW — speed left / gear centre / specs right ─────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >

        {/* Speed + sub-stats */}
        <div style={{ ...GLASS, minWidth: "110px" }}>
          <Stat label="Speed" value={String(speed).padStart(3, "0")} unit="km/h" />
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <Stat label="RPM" value={rpm.toLocaleString()} unit="" />
            <Stat label="G" value={gf} unit="g" />
          </div>
          <Bar value={rpm} max={15000} color={rpm > 12000 ? "#ef4444" : rpm > 10000 ? "#eab308" : "#22c55e"} />
        </div>

        {/* Gear indicator */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "7px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(0,210,190,0.6)",
              marginBottom: "4px",
            }}
          >
            Gear
          </span>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "1px solid rgba(0,210,190,0.45)",
              background: "rgba(6,6,8,0.75)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(0,210,190,0.25)",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: "22px",
                color: "#fff",
              }}
            >
              {gear}
            </span>
          </div>
        </div>

        {/* Max Power + specs */}
        <div style={{ ...GLASS, minWidth: "110px", textAlign: "right" }}>
          <Stat label="Max Power" value="1000+" unit="hp" glow />
          <div style={{ display: "flex", gap: "16px", marginTop: "8px", justifyContent: "flex-end" }}>
            <Stat label="0-100" value="2.6" unit="sec" />
            <Stat label="Aero" value="High" unit="" />
          </div>
          {/* ERS deployment bar */}
          <Bar value={85} max={100} />
        </div>

      </div>
    </div>
  );
}
