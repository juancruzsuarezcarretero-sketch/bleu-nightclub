"use client";

import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { LEVEL_FLOORS, LEVEL_HEIGHT, planToWorld, type Vista } from "@/lib/map-3d";

const FOV_MAPA = 32;
const FOV_PERSONA = 68;
/** Hacia los costados la cabeza gira los 360°; hacia arriba y abajo tiene tope. */
const MAX_PITCH = 0.55;

/**
 * Cámara orbital que se acerca al piso enfocado (o se aleja para mostrar todo el local).
 * Con `vista` se para en ese punto, a la altura de los ojos, mirando hacia `look`.
 */
export function CameraRig({ focus, vista, onUserRotate }: { focus: number | null; vista: Vista | null; onUserRotate: () => void }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, gl, size, invalidate } = useThree();
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

  const mirada = useRef(new THREE.Vector3());
  const estabaEnVista = useRef(false);

  // Giro de cabeza: lo que se arrastró desde la mirada inicial (ángulos en radianes, con tope)
  const giro = useRef({ yaw: 0, pitch: 0 });
  useEffect(() => {
    if (!vista) return;
    giro.current = { yaw: 0, pitch: 0 };
    let x = 0, y = 0, arrastrando = false;
    const down = (e: PointerEvent) => { arrastrando = true; x = e.clientX; y = e.clientY; };
    const move = (e: PointerEvent) => {
      if (!arrastrando) return;
      const g = giro.current;
      g.yaw += (e.clientX - x) * 0.006;
      g.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, g.pitch + (e.clientY - y) * 0.004));
      x = e.clientX;
      y = e.clientY;
      invalidate();
    };
    const up = () => { arrastrando = false; };
    const el = gl.domElement;
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [vista, gl, invalidate]);

  useFrame((state, dt) => {
    const c = controls.current;
    if (!c) return;
    const k = reduce ? 1 : 1 - Math.exp(-dt * 5);
    const cam = state.camera as THREE.PerspectiveCamera;

    if (vista) {
      // Parado en el sector: la cámara va a los ojos, apunta a la pista y se agranda el campo de visión
      if (!estabaEnVista.current) mirada.current.copy(c.target);
      estabaEnVista.current = true;
      c.enabled = false;
      const eye = new THREE.Vector3(...vista.eye);
      const look = new THREE.Vector3(...vista.look);
      cam.position.lerp(eye, k);
      mirada.current.lerp(look, k);
      // La cabeza gira alrededor de la vertical y hacia arriba/abajo, sobre la mirada base
      const dir = mirada.current.clone().sub(cam.position).normalize();
      dir.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -giro.current.yaw);
      const derecha = new THREE.Vector3().crossVectors(dir, THREE.Object3D.DEFAULT_UP).normalize();
      dir.applyAxisAngle(derecha, -giro.current.pitch);
      cam.lookAt(cam.position.clone().add(dir));
      cam.fov += (FOV_PERSONA - cam.fov) * k;
      cam.updateProjectionMatrix();
      if (cam.position.distanceTo(eye) > 0.05 || mirada.current.distanceTo(look) > 0.05 || Math.abs(cam.fov - FOV_PERSONA) > 0.2) invalidate();
      return;
    }

    if (estabaEnVista.current) {
      // Al volver al mapa se arranca desde lo que se estaba mirando, para que no pegue un salto
      estabaEnVista.current = false;
      c.enabled = true;
      c.target.copy(mirada.current);
    }
    if (Math.abs(cam.fov - FOV_MAPA) > 0.2) {
      cam.fov += (FOV_MAPA - cam.fov) * k;
      cam.updateProjectionMatrix();
      invalidate();
    }
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
