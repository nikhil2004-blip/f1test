"use client";
//final code
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, PerspectiveCamera, Html, MeshReflectorMaterial, Lightformer } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CarModel from "./CarModel";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const LABELS = [
  { pos: [0, -1, 5.2] as [number, number, number], title: "Front Wing", sub: "35% Front Downforce", color: "#00D2BE" },
  { pos: [0, 3.2, -4.5] as [number, number, number], title: "Rear Wing", sub: "High-Downforce Spec", color: "#00D2BE" },
  { pos: [-2.2, 1.5, -3.2] as [number, number, number], title: "V6 Turbo Hybrid", sub: "1000+ HP Power Unit", color: "#E3001B" },
  { pos: [4.5, 0.8, 0.5] as [number, number, number], title: "Zero-Pod", sub: "Minimal Cooling Cell", color: "#00D2BE" },
  { pos: [0.5, 5.2, 0.5] as [number, number, number], title: "Halo", sub: "Titanium Safety Arc", color: "#C9A84C" },
  { pos: [-3.5, -0.6, 2.2] as [number, number, number], title: "Floor & Diffuser", sub: "Ground Effect System", color: "#00D2BE" },
];

function PartLabel({ title, sub, color, visible }: { title: string; sub: string; color: string; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.92)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
      pointerEvents: "none", userSelect: "none",
      background: "rgba(7,8,14,0.85)", backdropFilter: "blur(10px)",
      border: `1px solid ${color}40`, borderLeft: `3px solid ${color}`,
      borderRadius: "6px", padding: "8px 12px", minWidth: "150px",
      fontFamily: "system-ui, sans-serif",
      boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 10px ${color}20`
    }}>
      <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color, marginBottom: 4, fontWeight: "bold" }}>
        ● {title}
      </div>
      <div style={{ fontSize: 11, color: "rgba(200,210,220,0.8)", lineHeight: 1.4 }}>{sub}</div>
    </div>
  );
}

interface MCache { mesh: THREE.Mesh; origPos: THREE.Vector3; dir: THREE.Vector3; }

/* ── Web Audio Synth for F1 V6 Turbo Engine ───────────────────────────────── */
let lastEnginePlay = 0;
const playEngineSound = () => {
  const now = Date.now();
  if (now - lastEnginePlay < 4000) return; // 4 second cooldown
  lastEnginePlay = now;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // V6 Combustion Rumble
    const engine = ctx.createOscillator();
    engine.type = "sawtooth";

    // MGU-H Turbo Whine
    const turbo = ctx.createOscillator();
    turbo.type = "sine";

    const engineGain = ctx.createGain();
    const turboGain = ctx.createGain();

    engine.connect(engineGain);
    turbo.connect(turboGain);
    engineGain.connect(ctx.destination);
    turboGain.connect(ctx.destination);

    const t = ctx.currentTime;

    // RPM Pitch Envelope (Start at idle, aggressively ramp to redline)
    engine.frequency.setValueAtTime(140, t);
    engine.frequency.exponentialRampToValueAtTime(750, t + 2.5);

    turbo.frequency.setValueAtTime(1000, t);
    turbo.frequency.exponentialRampToValueAtTime(8500, t + 2.5);

    // Volume Envelope
    engineGain.gain.setValueAtTime(0, t);
    engineGain.gain.linearRampToValueAtTime(0.2, t + 0.2); // Initial punch
    engineGain.gain.linearRampToValueAtTime(0.2, t + 2.5);
    engineGain.gain.linearRampToValueAtTime(0, t + 3.5); // Fade out

    turboGain.gain.setValueAtTime(0, t);
    turboGain.gain.linearRampToValueAtTime(0.0, t + 0.5); // Turbo lag
    turboGain.gain.linearRampToValueAtTime(0.08, t + 1.5); // Turbo spooling up
    turboGain.gain.linearRampToValueAtTime(0, t + 3.5);

    engine.start(t);
    turbo.start(t);
    engine.stop(t + 4);
    turbo.stop(t + 4);
  } catch (e) {
    console.warn("Audio blocked by browser policies.");
  }
};

function SceneContent() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const carRef = useRef<THREE.Group>(null);
  const lookRef = useRef(new THREE.Vector3(0, 0.4, 0));
  const floatRef = useRef<THREE.Group>(null);
  const explodeRef = useRef(0);
  const prevLabel = useRef(false);
  const [labelsOn, setLabelsOn] = useState(false);

  useGSAP(() => {
    if (!camRef.current || !carRef.current) return;

    // Start with a heroic low-angle wide shot
    camRef.current.position.set(6, 2.5, 6);
    lookRef.current.set(0, 0.4, 0);

    const animProps = { explode: 0 };

    /* Cache meshes once */
    const cache: MCache[] = [];
    carRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const wp = new THREE.Vector3();
      child.getWorldPosition(wp);
      const dir = wp.length() > 0.001 ? wp.clone().normalize() : new THREE.Vector3(0, 1, 0);
      cache.push({ mesh: child, origPos: child.position.clone(), dir });
    });

    const updateExplode = () => {
      const e = animProps.explode;
      explodeRef.current = e;
      for (const { mesh, origPos, dir } of cache) {
        if (e > 0.001) {
          mesh.position.set(
            origPos.x + dir.x * e * 3.5,
            origPos.y + dir.y * e * 3.5,
            origPos.z + dir.z * e * 3.5,
          );
        } else {
          mesh.position.copy(origPos);
        }
      }
    };

    const cam = camRef.current;
    const car = carRef.current;
    const look = lookRef.current;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.2 },
    });

    // Sc2 — Initial text appear (camera pulls in slightly)
    tl.to(cam.position, { x: 6.5, y: 2.2, z: 6.5, ease: "power2.inOut" }, 0)
      .to(look, { x: 0, y: 0.4, z: 0, ease: "power2.inOut" }, 0)
      .to(car.rotation, { y: Math.PI / 12, ease: "power2.inOut" }, 0);

    // Sc3 — Front wing
    tl.to(cam.position, { x: 0, y: 0.6, z: 5.8, ease: "power2.inOut" }, 1)
      .to(look, { x: 0, y: 0.2, z: 2, ease: "power2.inOut" }, 1)
      .to(car.rotation, { y: Math.PI / 6, ease: "power2.inOut" }, 1);

    // Sc4 — Sidepod
    tl.to(cam.position, { x: 5.8, y: 1.0, z: 0, ease: "power2.inOut" }, 2)
      .to(look, { x: 0, y: 0.4, z: 0, ease: "power2.inOut" }, 2)
      .to(car.rotation, { y: -Math.PI / 10, ease: "power2.inOut" }, 2);

    // Sc5 — Engine rear
    tl.to(cam.position, { x: -4.5, y: 3.0, z: -3.9, ease: "power2.inOut" }, 3)
      .to(look, { x: 0, y: 0.7, z: -0.8, ease: "power2.inOut" }, 3)
      .to(car.rotation, { y: -Math.PI / 4, ease: "power2.inOut" }, 3);

    // Sc6 — Cockpit
    tl.to(cam.position, { x: 0, y: 2.2, z: 1.2, ease: "power2.inOut" }, 4)
      .to(look, { x: 0, y: 1.0, z: -0.4, ease: "power2.inOut" }, 4)
      .to(car.rotation, { y: 0, ease: "power2.inOut" }, 4);

    // Sc7 — Exploded
    tl.to(cam.position, { x: 9.8, y: 7.7, z: 9.8, ease: "power2.inOut" }, 5)
      .to(look, { x: 0, y: 1, z: 0, ease: "power2.inOut" }, 5)
      .to(car.rotation, { y: Math.PI * 1.5, ease: "power2.inOut" }, 5)
      .to(animProps, { explode: 1, ease: "power2.inOut", onUpdate: updateExplode }, 5);

    let lastP = 0;
    // Sc8 — Race mode (and trigger aggressive engine sound)
    tl.to(cam.position, { x: 0, y: 1.0, z: -7.0, ease: "power2.inOut" }, 6)
      .to(look, { x: 0, y: 0.5, z: 3, ease: "power2.inOut" }, 6)
      .to(car.rotation, { y: Math.PI * 2, ease: "power2.inOut" }, 6)
      .to(animProps, {
        explode: 0,
        ease: "power2.inOut",
        onUpdate: function () {
          updateExplode();
          const p = this.progress();
          // Trigger audio only when scrolling DOWN deeply into the final section
          if (p > 0.8 && p > lastP) playEngineSound();
          lastP = p;
        }
      }, 6);
  }, { dependencies: [] });

  useFrame((state, delta) => {
    camRef.current?.lookAt(lookRef.current);

    if (carRef.current && window.scrollY < 20)
      carRef.current.rotation.y += 0.001;

    if (floatRef.current && floatRef.current.position.z < 0.1)
      floatRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.025;

    const on = explodeRef.current > 0.42;
    if (on !== prevLabel.current) { prevLabel.current = on; setLabelsOn(on); }
  });

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault position={[6, 2.5, 6]} fov={40} />

      {/* ── Hyper-realistic Studio Lighting ─────────────────────────────── */}
      {/* Base ambient to ensure absolute visibility of black carbon fiber */}
      <ambientLight intensity={4} color="#ffffff" />

      {/* Key light for heavy detail on carbon textures */}
      <directionalLight position={[5, 10, 5]} intensity={8} color="#ffffff" castShadow />
      <directionalLight position={[-5, 5, 8]} intensity={6} color="#e0f0ff" />
      <directionalLight position={[0, -2, -8]} intensity={5} color="#00D2BE" />

      {/* Sharp rim lighting from behind/sides for edge highlights */}
      <spotLight position={[-8, 4, -8]} intensity={45} color="#00D2BE" angle={0.6} penumbra={1} distance={30} />
      <spotLight position={[8, 4, -8]} intensity={45} color="#00D2BE" angle={0.6} penumbra={1} distance={30} />

      {/* Top down fill to hit the upper chassis and halo */}
      <spotLight position={[0, 12, 0]} intensity={30} color="#ffffff" angle={0.6} penumbra={0.5} distance={20} />

      {/* HDRI Environment for maximum glossy reflections on the car's metallic surfaces 
          (Not set to background, so the stage remains a clean matte dark void) */}
      <Environment preset="city" />

      {/* ── High-Tech Stage ─────────────────────────────────── */}
      <group>
        {/* Subtle, matte black stage floor so the contact shadow has a perfect canvas 
            without turning into a glitchy shifting mirror */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
          <planeGeometry args={[150, 150]} />
          {/* meshBasicMaterial completely ignores lighting, guaranteeing the floor
              NEVER changes color, turns grey, or washes out under the intense spotlights! */}
          <meshBasicMaterial color="#050505" />
        </mesh>
      </group>

      <group ref={floatRef} scale={1.4}>
        <group ref={carRef}>
          <CarModel scale={1} position={[0, -0.38, 0]} />

          {/* Part labels */}
          {LABELS.map((l, i) => (
            <Html key={i} position={l.pos} center distanceFactor={10}>
              <PartLabel title={l.title} sub={l.sub} color={l.color} visible={labelsOn} />
            </Html>
          ))}
        </group>

        {/* Subtle contact shadow */}
        <ContactShadows
          position={[0, -0.38, 0]}
          opacity={0.8}
          scale={14}
          blur={1.5}
          far={3}
          color="#000000"
          frames={1}
        />
      </group>
    </>
  );
}

import { Sparkles, Grid } from "@react-three/drei";

export default function F1Scene() {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[1, 2]} /* Enforce 4K retina display rendering */
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: "high-performance",
        alpha: false,
      }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 10, 40]} />

      <Suspense fallback={null}>
        <SceneContent />
        <Sparkles count={600} scale={35} size={1.8} speed={0.5} opacity={0.55} color="#00D2BE" />
        <Sparkles count={200} scale={25} size={3.0} speed={0.3} opacity={0.3} color="#ffffff" />
      </Suspense>
    </Canvas>
  );
}
