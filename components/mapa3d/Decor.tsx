"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { LEVEL_HEIGHT, LOCAL_BOUNDS, PLAN_SCALE, STAIRS, openEdges, planToWorld, wallEdges, type Box, type Pt } from "@/lib/map-3d";
import { SurfaceMaterial } from "./Block";
import { fontBebas, useFontsReady } from "./fonts";
import { makeBrickTexture, makeFanTexture, makeGlowTexture, makeLogoTexture, makePanelTexture, makePortholeTexture, makeSignTexture, useCanvasTexture } from "./textures";

const WALL_D = (LOCAL_BOUNDS.y1 - LOCAL_BOUNDS.y0) * PLAN_SCALE;
const WALL_H = 20;
const WALL_CZ = planToWorld([0, (LOCAL_BOUNDS.y0 + LOCAL_BOUNDS.y1) / 2])[1];

type Bounds = { x0: number; x1: number; y0: number; y1: number };

function WallBox({ b, map }: { b: Bounds; map: THREE.Texture }) {
  const [cx, cz] = planToWorld([(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2]);
  return (
    <mesh position={[cx, WALL_H / 2 - 0.4, cz]} raycast={() => null}>
      <boxGeometry args={[(b.x1 - b.x0) * PLAN_SCALE, WALL_H, (b.y1 - b.y0) * PLAN_SCALE]} />
      <meshStandardMaterial map={map} side={THREE.BackSide} roughness={1} />
    </mesh>
  );
}

/** Paredes de ladrillo del local: solo se ven las caras de adentro, así no tapan al girar el mapa. */
export function BrickWalls() {
  const map = useCanvasTexture(makeBrickTexture);
  return <WallBox b={LOCAL_BOUNDS} map={map} />;
}

function LogoPlane() {
  const fuente = fontBebas();
  const map = useMemo(() => makeLogoTexture(fuente), [fuente]);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh position={[-3, 11, WALL_CZ - WALL_D / 2 + 0.05]} raycast={() => null}>
      <planeGeometry args={[9, 9]} />
      <meshBasicMaterial map={map} transparent toneMapped={false} />
    </mesh>
  );
}

/** Logo naranja en la pared del fondo, como el del local. */
export function WallLogo() {
  const ready = useFontsReady();
  return ready ? <LogoPlane /> : null;
}

export interface WallGlowSpot {
  position: [number, number, number];
  /** Giro sobre Y para que el plano mire hacia adentro del local. */
  rotationY: number;
  level: number;
}

/** Luces de pared que bañan el ladrillo con luz ámbar, detrás de los sillones. */
export function WallGlows({ spots, opacity }: { spots: WallGlowSpot[]; opacity: (level: number) => number }) {
  const map = useCanvasTexture(makeGlowTexture);
  return (
    <>
      {spots.map((s, i) => {
        const o = opacity(s.level);
        return (
          <mesh key={i} position={s.position} rotation={[0, s.rotationY, 0]} raycast={() => null}>
            <planeGeometry args={[3.4, 6.8]} />
            <meshBasicMaterial map={map} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
}

/** Manchas y haces de luz sobre la pista, como los de la bola de espejos y los cabezales móviles. */
const SPOTS: Pt[] = [[260, 430], [380, 480], [310, 560], [440, 440], [400, 620], [250, 650], [470, 560]];

export function PistaLights({ opacity }: { opacity: number }) {
  return (
    <>
      {SPOTS.map((p, i) => {
        const [x, z] = planToWorld(p);
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
              <ringGeometry args={[0.9, 1.6, 24]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.16 * opacity} depthWrite={false} />
            </mesh>
            {i % 2 === 0 && (
              <mesh position={[0, 9, 0]} raycast={() => null}>
                <cylinderGeometry args={[0.15, 2.2, 18, 20, 1, true]} />
                <meshBasicMaterial color="#cfe0ff" transparent opacity={0.07 * opacity} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}

const POST_GAP = 2.4;

/** Pares de puntos (para `Line segments`) de una baranda horizontal por cada altura indicada. */
const barrasA = (edges: readonly (readonly [[number, number], [number, number]])[], base: number, alturas: number[]) =>
  alturas.flatMap((h) => edges.flatMap(([a, b]) => [new THREE.Vector3(a[0], base + h, a[1]), new THREE.Vector3(b[0], base + h, b[1])]));

/** Baranda de caño negro (postes y dos barandas) en los bordes de un piso que dan al vacío, o en los `segments` que se indiquen. */
export function Railing({ points = [], segments, base, opacity, gaps = [] }: { points?: Pt[]; segments?: [Pt, Pt][]; base: number; opacity: number; gaps?: Box[] }) {
  const edges = useMemo(() => {
    const libre = ([x, y]: Pt) => !gaps.some((g) => x >= g.x && x <= g.x + g.w && y >= g.y && y <= g.y + g.h);
    // Cada borde se corta en tramos y se descartan los que pasan por una escalera (ahí hay que poder subir)
    return (segments ?? openEdges(points)).flatMap(([a, b]) => {
      const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) * PLAN_SCALE / POST_GAP));
      const tramos: (readonly [[number, number], [number, number]])[] = [];
      for (let i = 0; i < n; i++) {
        const p: Pt = [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n];
        const q: Pt = [a[0] + ((b[0] - a[0]) * (i + 1)) / n, a[1] + ((b[1] - a[1]) * (i + 1)) / n];
        if (libre([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])) tramos.push([planToWorld(p), planToWorld(q)] as const);
      }
      return tramos;
    });
  }, [points, segments, gaps]);

  const posts = useMemo(() => {
    const out: [number, number][] = [];
    for (const [a, b] of edges) out.push(a, b);
    return out;
  }, [edges]);

  const pasamanos = useMemo(() => barrasA(edges, base, [1.0]), [edges, base]);
  const barras = useMemo(() => barrasA(edges, base, [0.75, 0.5, 0.25]), [edges, base]);

  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const o = new THREE.Object3D();
    posts.forEach(([x, z], i) => {
      o.position.set(x, base + 0.5, z);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [posts, base]);

  if (posts.length === 0) return null;
  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, posts.length]} raycast={() => null}>
        <boxGeometry args={[0.14, 1, 0.14]} />
        <SurfaceMaterial color="#15161b" metalness={0.7} roughness={0.45} opacity={opacity} />
      </instancedMesh>
      <Line points={barras} segments color="#4b4f58" lineWidth={1} transparent opacity={opacity * 0.9} raycast={() => null} />
      <Line points={pasamanos} segments color="#c9ced6" lineWidth={2.6} transparent opacity={opacity} raycast={() => null} />
    </>
  );
}

/** Tira de neón sobre los bordes abiertos de un piso, del color de ese piso. */
export function NeonEdge({ points, base, color, opacity }: { points: Pt[]; base: number; color: string; opacity: number }) {
  const line = useMemo(
    () =>
      openEdges(points).flatMap(([a, b]) => {
        const [ax, az] = planToWorld(a);
        const [bx, bz] = planToWorld(b);
        return [new THREE.Vector3(ax, base + 0.06, az), new THREE.Vector3(bx, base + 0.06, bz)];
      }),
    [points, base]
  );
  if (line.length === 0) return null;
  return <Line points={line} segments color={color} lineWidth={3} toneMapped={false} transparent opacity={opacity} raycast={() => null} />;
}

const PANEL_H = 1.7;
const PANEL_W = 4.2;
const LED_Y = 3.3;

export interface WallFloor {
  points: Pt[];
  base: number;
  level: number;
}

/** Tramos de pared de cada piso (el 0 es todo el perímetro) con su altura sobre el suelo y el piso al que pertenecen. */
function wallRuns(floors: WallFloor[]) {
  return floors.flatMap(({ points, base, level }) =>
    wallEdges(points).map((w) => {
      const [ax, az] = planToWorld(w.a);
      const [bx, bz] = planToWorld(w.b);
      const largo = Math.hypot(bx - ax, bz - az);
      return { ...w, ax, az, ux: (bx - ax) / largo, uz: (bz - az) / largo, largo, base, level };
    })
  );
}

/** Zócalo de chapa oscura (con ojos de buey) y tira de LED naranja contra las paredes de cada piso, como en el local. */
export function WallTrim({ floors, opacity }: { floors: WallFloor[]; opacity: (level: number) => number }) {
  const liso = useCanvasTexture(makePanelTexture);
  const ojo = useCanvasTexture(makePortholeTexture);
  const runs = useMemo(() => wallRuns(floors), [floors]);
  return (
    <>
      {runs.map((r, k) => {
        const n = Math.max(1, Math.round(r.largo / PANEL_W));
        const paso = r.largo / n;
        const o = opacity(r.level);
        const giro = Math.atan2(r.inward[0], r.inward[1]);
        const [nx, nz] = r.inward;
        return (
          <group key={k}>
            {Array.from({ length: n }, (_, i) => {
              const t = (i + 0.5) * paso;
              return (
                <mesh key={i} position={[r.ax + r.ux * t + nx * 0.03, r.base + PANEL_H / 2, r.az + r.uz * t + nz * 0.03]} rotation={[0, giro, 0]} raycast={() => null}>
                  <planeGeometry args={[paso, PANEL_H]} />
                  <SurfaceMaterial color="#ffffff" map={(i + k) % 3 === 0 ? ojo : liso} metalness={0.5} roughness={0.55} opacity={o} />
                </mesh>
              );
            })}
            <mesh position={[r.ax + r.ux * (r.largo / 2) + nx * 0.04, r.base + LED_Y, r.az + r.uz * (r.largo / 2) + nz * 0.04]} rotation={[0, giro, 0]} raycast={() => null}>
              <planeGeometry args={[r.largo, 0.12]} />
              <meshBasicMaterial color="#ff7a14" toneMapped={false} transparent={o < 1} opacity={o} depthWrite={o >= 1} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/** Ventiladores industriales y carteles de advertencia colgados de las paredes de cada piso. */
export function WallDecals({ floors, opacity }: { floors: WallFloor[]; opacity: (level: number) => number }) {
  const fan = useCanvasTexture(makeFanTexture);
  const sign = useCanvasTexture(makeSignTexture);
  const runs = useMemo(() => wallRuns(floors).filter((r) => r.largo >= 15), [floors]);
  return (
    <>
      {runs.map((r, k) => {
        const o = opacity(r.level);
        const giro = Math.atan2(r.inward[0], r.inward[1]);
        const [nx, nz] = r.inward;
        const en = (f: number, y: number, d: number): [number, number, number] => [r.ax + r.ux * r.largo * f + nx * d, r.base + y, r.az + r.uz * r.largo * f + nz * d];
        return (
          <group key={k}>
            <mesh position={en(0.3, 2.5, 0.12)} rotation={[0, giro, 0]} raycast={() => null}>
              <planeGeometry args={[1.5, 1.5]} />
              <meshBasicMaterial map={fan} transparent opacity={o} depthWrite={false} />
            </mesh>
            <mesh position={en(0.68, 2.2, 0.06)} rotation={[0, giro, 0]} raycast={() => null}>
              <planeGeometry args={[0.9, 0.9]} />
              <meshBasicMaterial map={sign} transparent opacity={o} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/** Pasamanos de las escaleras: un caño a cada lado, que sube con ellas. */
export function StairRails({ opacity }: { opacity: (level: number) => number }) {
  const lineas = useMemo(
    () =>
      STAIRS.flatMap((s) => {
        const alX = s.axis === "x";
        const largo = alX ? s.box.w : s.box.h;
        const [bajo, alto] = s.dir === 1 ? [0, largo] : [largo, 0];
        const y0 = LEVEL_HEIGHT[s.from] + 1.0;
        const y1 = LEVEL_HEIGHT[s.to] + 1.0;
        return [0, 1].map((lado) => {
          const punto = (t: number, y: number) => {
            const [x, z] = planToWorld(alX ? [s.box.x + t, s.box.y + lado * s.box.h] : [s.box.x + lado * s.box.w, s.box.y + t]);
            return new THREE.Vector3(x, y, z);
          };
          return { to: s.to, puntos: [punto(bajo, y0), punto(alto, y1)] };
        });
      }),
    []
  );
  return (
    <>
      {lineas.map((l, i) => (
        <Line key={i} points={l.puntos} color="#c9ced6" lineWidth={2.2} transparent opacity={opacity(l.to)} raycast={() => null} />
      ))}
    </>
  );
}
