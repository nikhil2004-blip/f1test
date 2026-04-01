"use client";

import { useEffect, useState } from "react";

export default function F1Overlay() {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(8000);
  const [gear, setGear] = useState(1);
  const [gForce, setGForce] = useState("0.0");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

      // Simulate telemetry based on scroll progress
      setSpeed(Math.floor(progress * 340));
      setRpm(Math.floor(8000 + progress * 7000));
      setGear(Math.max(1, Math.ceil(progress * 8)));
      setGForce((progress * 5.5).toFixed(1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between h-screen w-full">
      {/* Top Bar - System Status */}
      <div className="flex justify-between items-start font-mono text-[10px] md:text-xs text-[#00D2BE] opacity-80 uppercase tracking-widest mt-4">
        <div className="space-y-1 bg-black/40 p-3 rounded-lg border border-[#00D2BE]/20 backdrop-blur-sm">
          <p className="flex justify-between w-32">
            <span>SYS. CHK.</span>
            <span className="text-white">OK</span>
          </p>
          <p className="flex justify-between w-32">
            <span>MGU-K</span>
            <span className="text-white">ON</span>
          </p>
          <p className="flex justify-between w-32">
            <span>MGU-H</span>
            <span className="text-white">ON</span>
          </p>
        </div>
        <div className="space-y-1 bg-black/40 p-3 rounded-lg border border-[#00D2BE]/20 backdrop-blur-sm text-right">
          <p className="flex justify-between w-32 gap-4">
            <span>DRS</span>
            <span className="text-gray-500">DISABLED</span>
          </p>
          <p className="flex justify-between w-32 gap-4">
            <span>ERS</span>
            <span className="text-white">DEPLOY</span>
          </p>
          <p className="flex justify-between w-32 gap-4">
            <span>B-BIAS</span>
            <span className="text-white">56.5%</span>
          </p>
        </div>
      </div>

      {/* Crosshair (Subtle) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center opacity-10">
        <div className="w-px h-25 bg-white absolute"></div>
        <div className="w-25 h-px bg-white absolute"></div>
        <div className="w-32 h-32 border border-white rounded-full absolute"></div>
      </div>

      {/* Bottom Bar - Telemetry */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-0 pb-2">
        {/* Left Stats */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-5 font-mono w-full md:w-auto shadow-[0_4px_30px_rgba(0,0,0,0.5)] origin-bottom-left md:scale-90">
          <div className="mb-2">
            <span className="text-gray-400 text-[10px] md:text-xs block mb-1 uppercase tracking-widest">
              Current Speed
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {speed.toString().padStart(3, "0")}
              </span>
              <span className="text-[#00D2BE] text-sm font-bold">KM/H</span>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <span className="text-gray-400 text-[10px] block mb-1 uppercase tracking-widest">
                Engine Speed
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg md:text-xl font-bold text-white">
                  {rpm}
                </span>
                <span className="text-[#00D2BE] text-[10px]">RPM</span>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block mb-1 uppercase tracking-widest">
                G-Force
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg md:text-xl font-bold text-white">
                  {gForce}
                </span>
                <span className="text-[#00D2BE] text-[10px]">G</span>
              </div>
            </div>
          </div>
          {/* RPM Bar */}
          <div className="w-full h-2 bg-gray-900 rounded-full mt-3 overflow-hidden border border-gray-800">
            <div
              className="h-full bg-linear-to-r from-green-500 via-yellow-400 to-red-600 transition-all duration-300 ease-out"
              style={{ width: `${(rpm / 15000) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Center - Gear Indicator */}
        <div className="flex flex-col items-center justify-end order-first md:order-0 mb-4 md:mb-0 md:-translate-y-4">
          <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest mb-2 font-mono">
            Gear
          </span>
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            <div className="absolute inset-0 border-2 border-[#00D2BE]/30 rounded-full animate-ping opacity-20"></div>
            <div className="w-full h-full border-2 border-[#00D2BE] rounded-full flex items-center justify-center bg-black/70 backdrop-blur-md shadow-[0_0_20px_rgba(0,210,190,0.4)]">
              <span className="text-3xl md:text-4xl font-black text-white font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                {gear}
              </span>
            </div>
          </div>
        </div>

        {/* Right Stats (Static Specs) */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-5 font-mono text-right w-full md:w-auto shadow-[0_4px_30px_rgba(0,0,0,0.5)] origin-bottom-right md:scale-90">
          <div className="mb-2">
            <span className="text-gray-400 text-[10px] md:text-xs block mb-1 uppercase tracking-widest">
              Max Power Output
            </span>
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-2xl md:text-4xl font-black text-white">
                1000<span className="text-lg text-gray-500">+</span>
              </span>
              <span className="text-[#00D2BE] text-sm font-bold">HP</span>
            </div>
          </div>
          <div className="flex gap-6 justify-end">
            <div className="text-right">
              <span className="text-gray-400 text-[10px] block mb-1 uppercase tracking-widest">
                Downforce
              </span>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-lg md:text-xl font-bold text-white">
                  High
                </span>
                <span className="text-[#00D2BE] text-[10px]">AERO</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px] block mb-1 uppercase tracking-widest">
                0-100 km/h
              </span>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-lg md:text-xl font-bold text-white">
                  2.6
                </span>
                <span className="text-[#00D2BE] text-[10px]">SEC</span>
              </div>
            </div>
          </div>
          {/* Battery Deployment Bar */}
          <div className="w-full h-2 bg-gray-900 rounded-full mt-3 overflow-hidden border border-gray-800 flex justify-end">
            <div className="h-full bg-[#00D2BE] w-[85%] shadow-[0_0_10px_#00D2BE]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
