"use client";

import dynamic from "next/dynamic";
import F1Overlay from "@/components/F1Overlay";

// Dynamically import the 3D scene to disable SSR (Three.js requires window)
const F1Scene = dynamic(() => import("@/components/F1Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-black text-[#00D2BE] font-mono text-xl tracking-widest">
      LOADING TELEMETRY...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen font-sans overflow-x-hidden selection:bg-[#00D2BE] selection:text-black">
      {/* 3D Canvas Container - Fixed in background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <F1Scene />
      </div>

      {/* Scrollytelling Content Overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Scene 1: Hero Reveal */}
        <section
          id="scene-1"
          className="min-h-[150vh] flex flex-col justify-center items-start p-8 md:p-24 pb-[20vh]"
        >
          <div className="pointer-events-auto z-10">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500 mb-4 drop-shadow-lg">
              Mercedes-AMG
              <br />
              <span className="text-[#00D2BE]">W14 E Performance</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl font-light tracking-wide backdrop-blur-sm bg-black/30 p-4 rounded-xl border border-white/10">
              The pinnacle of motorsport engineering. Experience the evolution
              of aerodynamics and hybrid power.
            </p>
            <div className="mt-12 animate-bounce flex flex-col items-center opacity-70">
              <span className="text-xs uppercase tracking-widest text-[#00D2BE] mb-2">
                Initiate Sequence
              </span>
              <div className="w-px h-16 bg-linear-to-b from-[#00D2BE] to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Scene 2: Front Wing Focus */}
        <section
          id="scene-2"
          className="min-h-[150vh] flex flex-col justify-center items-end p-8 md:p-24 pb-[20vh] text-right"
        >
          <div className="max-w-xl backdrop-blur-md bg-black/40 p-8 rounded-2xl border border-[#00D2BE]/30 pointer-events-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider">
              Front Wing <span className="text-[#00D2BE]">Aero</span>
            </h2>
            <p className="text-lg text-gray-300">
              Precision-engineered flaps and endplates channel airflow around
              the front tires, reducing drag and generating critical front-end
              downforce for cornering mastery.
            </p>
          </div>
        </section>

        {/* Scene 3: Sidepod Aerodynamics */}
        <section
          id="scene-3"
          className="min-h-[150vh] flex flex-col justify-center items-start p-8 md:p-24 pb-[20vh]"
        >
          <div className="max-w-xl backdrop-blur-md bg-black/40 p-8 rounded-2xl border border-[#00D2BE]/30 pointer-events-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider">
              <span className="text-[#00D2BE]">Zero-pod</span> Evolution
            </h2>
            <p className="text-lg text-gray-300">
              Aggressive sidepod sculpting optimizes cooling efficiency while
              maintaining a minimal aerodynamic profile, slicing through the air
              with unparalleled efficiency.
            </p>
          </div>
        </section>

        {/* Scene 4: Engine Reveal */}
        <section
          id="scene-4"
          className="min-h-[150vh] flex flex-col justify-center items-end p-8 md:p-24 pb-[20vh] text-right"
        >
          <div className="max-w-xl backdrop-blur-md bg-black/40 p-8 rounded-2xl border border-[#00D2BE]/30 pointer-events-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-[#00D2BE] mb-4 uppercase tracking-wider">
              V6 Turbo Hybrid
            </h2>
            <p className="text-lg text-gray-300">
              A masterclass in thermal efficiency. The 1.6-liter turbocharged
              V6, paired with an advanced MGU-K and MGU-H energy recovery
              system, delivers blistering horsepower.
            </p>
          </div>
        </section>

        {/* Scene 5: Cockpit View */}
        <section
          id="scene-5"
          className="min-h-[150vh] flex flex-col justify-center items-center p-8 pb-[20vh]"
        >
          <div className="bg-black/60 backdrop-blur-lg p-8 rounded-2xl border border-[#00D2BE]/50 text-center pointer-events-auto shadow-[0_0_30px_rgba(0,210,190,0.1)] z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-widest">
              The Command Center
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Surrounded by the titanium halo safety structure, the bespoke
              steering wheel puts brake bias, differential settings, and energy
              deployment directly at the driver&apos;s fingertips.
            </p>
          </div>
        </section>

        {/* Scene 6: Exploded Engineering View */}
        <section
          id="scene-6"
          className="min-h-[200vh] flex flex-col justify-center items-start p-8 md:p-24 pb-[20vh]"
        >
          <div className="max-w-xl backdrop-blur-md bg-black/40 p-8 rounded-2xl border-l-4 border-[#00D2BE] pointer-events-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider">
              <span className="text-gray-500">De</span>constructed
            </h2>
            <p className="text-lg text-gray-300">
              Over 10,000 individual components acting as one. The chassis is an
              intricate symphony of carbon fiber, titanium, and advanced
              electronics designed for absolute performance.
            </p>
          </div>
        </section>

        {/* Scene 7: Race Mode */}
        <section
          id="scene-7"
          className="min-h-[150vh] flex flex-col justify-center items-center p-8 pb-[20vh] text-center"
        >
          <div className="backdrop-blur-md bg-black/20 p-12 rounded-full border border-white/10 pointer-events-auto z-10">
            <h2 className="text-7xl md:text-9xl font-black italic text-transparent bg-clip-text bg-linear-to-br from-[#00D2BE] to-white mb-4 drop-shadow-[0_0_25px_rgba(0,210,190,0.6)]">
              RACE MODE
            </h2>
            <p className="text-xl md:text-3xl text-white font-mono tracking-widest uppercase">
              Deploying maximum performance
            </p>
          </div>
        </section>
      </div>

      {/* Global UI Overlay (Telemetry) */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <F1Overlay />
      </div>
    </main>
  );
}
