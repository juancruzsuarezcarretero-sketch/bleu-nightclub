"use client";

import { useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MAP_SECTORS, type MapSectorId } from "@/lib/map-sectors";
import { MAP_LEVELS } from "@/lib/map-levels";
import {
  LEVEL_FLOORS,
  LEVEL_HEIGHT,
  PROPS,
  SECTOR_SHAPES,
  STAIRS,
  levelCenter,
  planToWorld,
  type Pt,
} from "@/lib/map-3d";

const FLOOR_THICKNESS = 0.3;
const DIM_OPACITY = 0.14;
const STEPS = 8;
const STEEL = "#8a8f98";
const WOOD = "#3a2412";
const AMBER = "#f5a300";

const IDS = Object.keys(SECTOR_SHAPES) as MapSectorId[];

/** Centro (en el mundo) de una lista de puntos del plano. */
function worldCenter(points: Pt[]): [number, number] {
  const w = points.map(planToWorld);
  const xs = w.map((p) => p[0]);
  const zs = w.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
}

interface BlockProps {
  points: Pt[];
  base: number;
  depth: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  edge?: string;
  metalness?: number;
  roughness?: number;
  onClick?: () => void;
  onOver?: () => void;
  onOut?: () => void;
}

/** Volumen extruido a partir de un polígono del plano, apoyado en `base` y de alto `depth`. */
function Block({ points, base, depth, color, emissive, emissiveIntensity = 0, opacity = 1, edge, metalness = 0.2, roughness = 0.7, onClick, onOver, onOut }: BlockProps) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(points.map((p) => planToWorld(p)).map(([x, z]) => new THREE.Vector2(x, -z)));
    return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  }, [points, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const interactive = Boolean(onClick);
  return (
    <mesh
      geometry={geometry}
      position={[0, base, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={interactive ? (e) => { e.stopPropagation(); onClick?.(); } : undefined}
      onPointerOver={interactive ? (e) => { e.stopPropagation(); onOver?.(); } : undefined}
      onPointerOut={interactive ? () => onOut?.() : undefined}
      raycast={interactive ? undefined : () => null}
    >
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity >= 1}
      />
      {edge && <Edges color={edge} threshold={20} />}
    </mesh>
  );
}

function Label({ position, children }: { position: [number, number, number]; children: React.ReactNode }) {
  return (
    <Html position={position} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap rounded border border-white/15 bg-black/75 px-2 py-1 text-center font-bebas tracking-wider text-[#F0F0F0] backdrop-blur-sm">
        {children}
      </div>
    </Html>
  );
}

function Stairs({ opacity }: { opacity: (level: number) => number }) {
  return (
    <>
      {STAIRS.map((s, k) => {
        const from = LEVEL_HEIGHT[s.from];
        const rise = LEVEL_HEIGHT[s.to] - from;
        const run = s.box.h / STEPS;
        const [cx] = worldCenter([[s.box.x, s.box.y], [s.box.x + s.box.w, s.box.y]]);
        const o = opacity(s.to);
        return Array.from({ length: STEPS }, (_, i) => {
          const h = (rise * (i + 1)) / STEPS;
          const yPlan = s.dir === -1 ? s.box.y + s.box.h - (i + 0.5) * run : s.box.y + (i + 0.5) * run;
          const [, z] = planToWorld([0, yPlan]);
          return (
            <mesh key={`${k}-${i}`} position={[cx, from + h / 2, z]} raycast={() => null}>
              <boxGeometry args={[s.box.w * 0.1, h, run * 0.1]} />
              <meshStandardMaterial color="#2a2c33" metalness={0.5} roughness={0.5} transparent={o < 1} opacity={o} depthWrite={o >= 1} />
            </mesh>
          );
        });
      })}
    </>
  );
}

/** Columnas que sostienen cada entrepiso. */
function Columns({ opacity }: { opacity: (level: number) => number }) {
  return (
    <>
      {[1, 2, 3].flatMap((level) =>
        LEVEL_FLOORS[level].map((p, i) => {
          const [x, z] = planToWorld(p);
          const top = LEVEL_HEIGHT[level] - FLOOR_THICKNESS;
          const o = opacity(level);
          return (
            <mesh key={`${level}-${i}`} position={[x, top / 2, z]} raycast={() => null}>
              <cylinderGeometry args={[0.18, 0.18, top, 8]} />
              <meshStandardMaterial color="#1b1c22" metalness={0.6} roughness={0.5} transparent={o < 1} opacity={o} depthWrite={o >= 1} />
            </mesh>
          );
        })
      )}
    </>
  );
}

/** Baranda de caño sobre el borde de un entrepiso. */
function Rail({ points, y, opacity }: { points: Pt[]; y: number; opacity: number }) {
  const line = useMemo(() => [...points, points[0]].map((p) => { const [x, z] = planToWorld(p); return [x, y, z] as [number, number, number]; }), [points, y]);
  return <Line points={line} color={STEEL} lineWidth={1} transparent opacity={opacity} raycast={() => null} />;
}

/** Manchas de luz sobre la pista, como las de la bola de espejos. */
const SPOTS: Pt[] = [[260, 430], [380, 480], [310, 560], [440, 440], [400, 620], [250, 650], [470, 560]];

function CameraRig({ focus }: { focus: number | null }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, size, invalidate } = useThree();
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const aspect = size.width / size.height;

  const goal = useMemo(() => {
    let target = new THREE.Vector3(0, 5, 0);
    if (focus !== null) {
      const [x, z] = planToWorld(levelCenter(focus));
      target = new THREE.Vector3(x, LEVEL_HEIGHT[focus], z);
    }
    // La cámara se aleja lo justo para que entre el piso (o todo el local) en alto y en ancho
    const pts = (focus === null ? LEVEL_FLOORS.flat() : LEVEL_FLOORS[focus]).map(planToWorld);
    const xs = pts.map((p) => p[0]);
    const zs = pts.map((p) => p[1]);
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
      enableDamping
      dampingFactor={0.1}
      minPolarAngle={0.45}
      maxPolarAngle={1.2}
    />
  );
}

export interface MapaScene3DProps {
  precios: Record<MapSectorId, string>;
  selectedId: MapSectorId | null;
  focus: number | null;
  onSelect: (id: MapSectorId) => void;
  onFocusLevel: (level: number) => void;
}

function Scene({ precios, selectedId, focus, onSelect, onFocusLevel }: MapaScene3DProps) {
  const [hoveredId, setHoveredId] = useState<MapSectorId | null>(null);
  const opacity = (level: number) => (focus === null || focus === level ? 1 : DIM_OPACITY);

  useEffect(() => () => { document.body.style.cursor = ""; }, []);
  const over = (id: MapSectorId | null) => {
    setHoveredId(id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    setHoveredId(null);
    document.body.style.cursor = "";
  };

  return (
    <>
      <hemisphereLight args={["#aab4ff", "#2a1a10", 1.6]} />
      <directionalLight position={[30, 60, 40]} intensity={2.4} />
      <directionalLight position={[-40, 30, -30]} intensity={0.5} color="#6688ff" />

      {/* Suelo general bajo todo el local */}
      <mesh position={[0, -0.25, 0]} raycast={() => null}>
        <boxGeometry args={[78, 0.3, 94]} />
        <meshStandardMaterial color="#10101a" metalness={0.4} roughness={0.8} />
      </mesh>

      {/* Pista principal (piso 1) */}
      <Block
        points={LEVEL_FLOORS[0]}
        base={-0.05}
        depth={0.1}
        color="#2b2d3d"
        metalness={0.5}
        roughness={0.35}
        opacity={opacity(0)}
        edge="#ffffff"
        onClick={() => onFocusLevel(0)}
        onOver={() => over(null)}
        onOut={out}
      />
      {SPOTS.map((p, i) => {
        const [x, z] = planToWorld(p);
        return (
          <mesh key={i} position={[x, 0.07, z]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
            <ringGeometry args={[0.9, 1.6, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.16 * opacity(0)} depthWrite={false} />
          </mesh>
        );
      })}
      {focus === 0 && (() => {
        const [x, z] = worldCenter(LEVEL_FLOORS[0]);
        return <Label position={[x, 1.2, z]}><span className="text-lg">PISTA PRINCIPAL</span></Label>;
      })()}

      {/* Entrepisos */}
      {[1, 2, 3].map((level) => (
        <group key={level}>
          <Block
            points={LEVEL_FLOORS[level]}
            base={LEVEL_HEIGHT[level] - FLOOR_THICKNESS}
            depth={FLOOR_THICKNESS}
            color="#23252f"
            metalness={0.5}
            roughness={0.5}
            opacity={opacity(level)}
            edge={MAP_LEVELS[level].accent}
            onClick={() => onFocusLevel(level)}
            onOver={() => over(null)}
            onOut={out}
          />
          <Rail points={LEVEL_FLOORS[level]} y={LEVEL_HEIGHT[level] + 0.9} opacity={opacity(level) * 0.8} />
        </group>
      ))}
      <Columns opacity={opacity} />
      <Stairs opacity={opacity} />

      {/* Barras y cabina */}
      {Object.entries(PROPS).map(([key, prop]) => (
        <Block
          key={key}
          points={prop.points}
          base={LEVEL_HEIGHT[prop.level]}
          depth={prop.height}
          color={WOOD}
          emissive={AMBER}
          emissiveIntensity={key === "cabina" ? 0.18 : 0.1}
          opacity={opacity(prop.level)}
          edge={AMBER}
        />
      ))}

      {/* Sectores reservables */}
      {IDS.map((id) => {
        const cfg = MAP_SECTORS[id];
        const shape = SECTOR_SHAPES[id];
        const selected = selectedId === id;
        const hovered = hoveredId === id;
        const base = LEVEL_HEIGHT[shape.level];
        const [cx, cz] = worldCenter(shape.points);
        const showLabel = selected || hovered || focus === shape.level;
        return (
          <group key={id}>
            <Block
              points={shape.points}
              base={base}
              depth={shape.height + (selected ? 0.25 : 0)}
              color={cfg.accent}
              emissive={cfg.accent}
              emissiveIntensity={selected ? 0.9 : hovered ? 0.55 : 0.16}
              opacity={opacity(shape.level)}
              edge={selected ? "#ffffff" : cfg.accent}
              roughness={0.45}
              onClick={() => onSelect(id)}
              onOver={() => over(id)}
              onOut={out}
            />
            {showLabel && (
              <Label position={[cx, base + shape.height + 0.9, cz]}>
                <div className="text-sm leading-none">{cfg.name}</div>
                <div className="mt-0.5 font-mono text-[9px] tracking-normal" style={{ color: cfg.accent }}>{precios[id]}</div>
              </Label>
            )}
          </group>
        );
      })}

      <CameraRig focus={focus} />
    </>
  );
}

export default function MapaScene3D(props: MapaScene3DProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 70, 95], fov: 32, near: 1, far: 400 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
