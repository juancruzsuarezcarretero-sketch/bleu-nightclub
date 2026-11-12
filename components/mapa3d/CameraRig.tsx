"use client";

import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { LEVEL_FLOORS, LEVEL_HEIGHT, planToWorld } from "@/lib/map-3d";

/** Cámara orbital que se acerca al piso enfocado (o se aleja para mostrar todo el local). */
export function CameraRig({ focus, onUserRotate }: { focus: number | null; onUserRotate: () => void }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, size, invalidate } = useThree();
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const aspect = size.width / size.height;

  const goal = useMemo(() => {
    const plan = focus === null ? LEVEL_FLOORS.flat() : LEVEL_FLOORS[focus];
    const pts = plan.map(planToWorld);
    const xs = pts.map((p) => p[0]);
    const zs = pts.map((p) => p[1]);
    // Se apunta al centro del piso (o de todo el local) y la cámara se aleja lo justo para que entre en alto y en ancho
    const target = new THREE.Vector3((Math.min(...xs) + Math.max(...xs)) / 2, focus === null ? 5 : LEVEL_HEIGHT[focus], (Math.min(...zs) + Math.max(...zs)) / 2);
    const ancho = Math.max(...xs) - Math.min(...xs);
    const alto = Math.max(...zs) - Math.min(...zs);
    return { target, distance: Math.max(alto, ancho / aspect) * 1.7 };
  }, [focus, aspect]);

  useEffect(() => {
    const el = controls.current?.domElement as HTMLElement | undefined;
    // El gesto vertical sigue scrolleando la página; solo el horizontal gira el mapa
    if (el) el.style.touchAction = "pan-y";
    invalidate();
  }, [invalidate]);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    const k = reduce ? 1 : 1 - Math.exp(-dt * 5);
    c.target.lerp(goal.target, k);
    const offset = camera.position.clone().sub(c.target);
    const len = offset.length();
    const next = len + (goal.distance - len) * k;
    offset.setLength(next);
    camera.position.copy(c.target).add(offset);
    c.update();
    if (Math.abs(next - goal.distance) > 0.05 || c.target.distanceTo(goal.target) > 0.05) invalidate();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={[0, 5, 0]}
      enableZoom={false}
      enablePan={false}
      onStart={onUserRotate}
      enableDamping
      dampingFactor={0.1}
      minPolarAngle={0.45}
      maxPolarAngle={1.2}
    />
  );
}
