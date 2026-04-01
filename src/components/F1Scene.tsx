"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CarModel from "./CarModel";

// Register ScrollTrigger only on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function SceneContent() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const carGroupRef = useRef<THREE.Group>(null);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const sceneRef = useRef<THREE.Group>(null);
  const engineGlowRef = useRef<THREE.Mesh>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);

  useGSAP(
    () => {
      if (!cameraRef.current || !carGroupRef.current) return;

      // Reset camera to initial position (Scene 1 - Hero Reveal)
      cameraRef.current.position.set(6, 2, 6);
      cameraTargetRef.current.set(0, 0.5, 0);

      const animProps = {
        opacity: 1,
        explode: 0,
      };

      const updateMaterialsAndPositions = () => {
        carGroupRef.current?.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Transparency
            if (child.material) {
              const mats = Array.isArray(child.material)
                ? child.material
                : [child.material];
              mats.forEach((mat) => {
                if (mat.userData.origTransparent === undefined) {
                  mat.userData.origTransparent = mat.transparent;
                  mat.userData.origOpacity = mat.opacity;
                }

                const targetOpacity =
                  mat.userData.origOpacity * animProps.opacity;

                if (animProps.opacity < 1 && !mat.transparent) {
                  mat.transparent = true;
                  mat.needsUpdate = true;
                } else if (
                  animProps.opacity === 1 &&
                  mat.transparent &&
                  !mat.userData.origTransparent
                ) {
                  mat.transparent = false;
                  mat.needsUpdate = true;
                }
                mat.opacity = targetOpacity;
              });
            }

            // Exploded view
            if (!child.userData.originalPosition) {
              child.userData.originalPosition = child.position.clone();
              child.geometry.computeBoundingBox();
              const center = new THREE.Vector3();
              if (child.geometry.boundingBox) {
                child.geometry.boundingBox.getCenter(center);
              }
              child.userData.explodeDir = center.normalize();
            }

            const dir = child.userData.explodeDir.clone();
            child.position
              .copy(child.userData.originalPosition)
              .add(dir.multiplyScalar(animProps.explode * 1.5));
          }
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Smoother scrubbing for cinematic feel
        },
      });

      // Scene 2 - Front Wing Focus
      tl.to(
        cameraRef.current.position,
        { x: 0, y: 0.5, z: 4.5, ease: "power2.inOut" },
        0,
      );
      tl.to(
        cameraTargetRef.current,
        { x: 0, y: 0.2, z: 2, ease: "power2.inOut" },
        0,
      );
      tl.to(
        carGroupRef.current.rotation,
        { y: Math.PI / 6, ease: "power2.inOut" },
        0,
      );

      // Scene 3 - Sidepod Aerodynamics
      tl.to(
        cameraRef.current.position,
        { x: 4.5, y: 0.8, z: 0, ease: "power2.inOut" },
        1,
      );
      tl.to(
        cameraTargetRef.current,
        { x: 0, y: 0.5, z: 0, ease: "power2.inOut" },
        1,
      );
      tl.to(
        carGroupRef.current.rotation,
        { y: -Math.PI / 12, ease: "power2.inOut" },
        1,
      );

      // Scene 4 - Engine Reveal (Rear angled view)
      tl.to(
        cameraRef.current.position,
        { x: -3.5, y: 2.5, z: -3, ease: "power2.inOut" },
        2,
      );
      tl.to(
        cameraTargetRef.current,
        { x: 0, y: 0.8, z: -1, ease: "power2.inOut" },
        2,
      );
      tl.to(
        animProps,
        {
          opacity: 0.2,
          ease: "power2.inOut",
          onUpdate: updateMaterialsAndPositions,
        },
        2,
      );
      if (engineGlowRef.current) {
        tl.to(
          engineGlowRef.current.scale,
          { x: 1, y: 1, z: 1, ease: "power2.inOut" },
          2,
        );
      }
      if (engineLightRef.current) {
        tl.to(
          engineLightRef.current,
          { intensity: 5, ease: "power2.inOut" },
          2,
        );
      }

      // Scene 5 - Cockpit View (Zoomed in on halo/cockpit area)
      tl.to(
        cameraRef.current.position,
        { x: 0, y: 1.8, z: 1, ease: "power2.inOut" },
        3,
      );
      tl.to(
        cameraTargetRef.current,
        { x: 0, y: 1, z: -0.5, ease: "power2.inOut" },
        3,
      );
      tl.to(carGroupRef.current.rotation, { y: 0, ease: "power2.inOut" }, 3);
      tl.to(
        animProps,
        {
          opacity: 1,
          ease: "power2.inOut",
          onUpdate: updateMaterialsAndPositions,
        },
        3,
      );
      if (engineGlowRef.current) {
        tl.to(
          engineGlowRef.current.scale,
          { x: 0, y: 0, z: 0, ease: "power2.inOut" },
          3,
        );
      }
      if (engineLightRef.current) {
        tl.to(
          engineLightRef.current,
          { intensity: 0, ease: "power2.inOut" },
          3,
        );
      }

      // Scene 6 - Deconstructed (Zoom out & full rotation to showcase engineering)
      tl.to(
        cameraRef.current.position,
        { x: 6, y: 4, z: 6, ease: "power2.inOut" },
        4,
      );
      tl.to(
        cameraTargetRef.current,
        { x: 0, y: 0.5, z: 0, ease: "power2.inOut" },
        4,
      );
      tl.to(
        carGroupRef.current.rotation,
        { y: Math.PI * 1.5, ease: "power2.inOut" },
        4,
      );
      tl.to(
        animProps,
        {
          explode: 1,
          ease: "power2.inOut",
          onUpdate: updateMaterialsAndPositions,
        },
        4,
      );

      // Scene 7 - Race Mode (Low rear angle mimicking a chase cam)
      tl.to(
        cameraRef.current.position,
        { x: 0, y: 0.5, z: -6, ease: "power2.inOut" },
        5,
      );
      tl.to(
        cameraTargetRef.current,
        { x: 0, y: 0.5, z: 5, ease: "power2.inOut" },
        5,
      );
      tl.to(
        carGroupRef.current.rotation,
        { y: Math.PI * 2, ease: "power2.inOut" },
        5,
      );
      tl.to(
        animProps,
        {
          explode: 0,
          ease: "power2.inOut",
          onUpdate: updateMaterialsAndPositions,
        },
        5,
      );
    },
    { dependencies: [] },
  );

  useFrame((state) => {
    // Ensure the camera is always looking at our dynamic target
    if (cameraRef.current) {
      cameraRef.current.lookAt(cameraTargetRef.current);
    }

    // Idle rotation in Scene 1 (when scroll is at the very top)
    if (carGroupRef.current && window.scrollY < 20) {
      carGroupRef.current.rotation.y += 0.002;
    }

    // Add slight floating effect to the entire scene for a premium feel
    if (sceneRef.current) {
      sceneRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[6, 2, 6]}
        fov={45}
      />

      {/* Lighting setup inspired by Mercedes AMG Petronas (Neon Blue / Dark) */}
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={3} color="#ffffff" />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={1.5}
        color="#ffffff"
      />

      {/* Neon Blue Rim Lights */}
      <spotLight
        position={[-10, 5, -10]}
        intensity={40}
        color="#00D2BE"
        angle={0.8}
        penumbra={1}
        distance={30}
      />
      <spotLight
        position={[10, 5, -10]}
        intensity={30}
        color="#00D2BE"
        angle={0.8}
        penumbra={1}
        distance={30}
      />
      <spotLight
        position={[0, 10, 10]}
        intensity={20}
        color="#00D2BE"
        angle={0.6}
        penumbra={0.8}
        distance={30}
      />
      <pointLight
        position={[0, 2, 0]}
        intensity={2}
        color="#00D2BE"
        distance={10}
      />

      {/* HDRI reflections */}
      <Environment preset="city" environmentIntensity={0.5} />

      <group ref={sceneRef}>
        <group ref={carGroupRef}>
          {/* 3D Car Model */}
          <CarModel scale={1} position={[0, -0.4, 0]} />

          {/* Engine Glow Core */}
          <mesh ref={engineGlowRef} position={[0, 0.4, -1.2]} scale={0}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial
              color="#00D2BE"
              transparent
              opacity={0.6}
              wireframe
            />
            <pointLight
              ref={engineLightRef}
              color="#00D2BE"
              intensity={0}
              distance={5}
            />
          </mesh>
        </group>

        {/* Floor Shadow */}
        <ContactShadows
          position={[0, -0.4, 0]}
          opacity={0.8}
          scale={15}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* Speed particles, giving life to the scene (especially Race Mode) */}
        <Sparkles
          count={200}
          scale={20}
          size={4}
          speed={0.8}
          opacity={0.15}
          color="#00D2BE"
        />
      </group>
    </>
  );
}

export default function F1Scene() {
  return (
    <Canvas
      className="w-full h-full pointer-events-none"
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={["#050505"]} />
      {/* Fog for cinematic depth blending into the dark background */}
      <fog attach="fog" args={["#050505", 5, 20]} />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
