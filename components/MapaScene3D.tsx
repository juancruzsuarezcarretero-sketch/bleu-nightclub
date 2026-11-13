"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MAP_SECTORS, type MapSectorId } from "@/lib/map-sectors";
import { MAP_LEVELS } from "@/lib/map-levels";
import {
  BARANDA_CABINA,
  CABINAS,
  CABINA_PLATFORM,
  DIVIDERS,
  LEVEL_FLOORS,
  LEVEL_HEIGHT,
  LOCAL_BOUNDS,
  PLAN_SCALE,
  PROPS,
  PUERTA_CABINA,
  SECTOR_SHAPES,
  SOFAS,
  STAIRS,
  planToWorld,
  sofaParts,
  tableFor,
  type Pt,
  type Vista,
} from "@/lib/map-3d";
import { Block, SurfaceMaterial, worldCenter } from "@/components/mapa3d/Block";
import { Label } from "@/components/mapa3d/Label";
import { CameraRig } from "@/components/mapa3d/CameraRig";
import { BrickWalls, NeonEdge, PistaLights, Railing, StairRails, WallDecals, WallGlows, WallLogo, WallTrim, type WallFloor, type WallGlowSpot } from "@/components/mapa3d/Decor";
import { makeBottlesTexture, makePlateTexture, makeConcreteTexture, useCanvasTexture } from "@/components/mapa3d/textures";

const FLOOR_THICKNESS = 0.3;
const DIM_OPACITY = 0.14;
const STEPS = 8;
/** Cuánto más altos se ven los sectores antes de girar el mapa (1 = el doble). */
const RELIEF = 1.4;
const WOOD = "#7a4a22"; // tapa de madera barnizada de las barras
const BAR_BODY = "#0f1013";
const BAR_TOP = 0.1;
const AMBER = "#f5a300";
// La cabina es del cuarto piso: lleva su color (violeta)
const CABINA_COLOR = MAP_LEVELS[3].accent;
// Sillones y mesas negros, como los de los palcos y boxes del local
const SOFA_SEAT = "#26262d";
const SOFA_BACK = "#17171c";
const TABLE = "#0e0e12";

const IDS = Object.keys(SECTOR_SHAPES) as MapSectorId[];

/** Una luz de pared por sillón, sobre la pared contra la que apoya. */
const GLOWS: WallGlowSpot[] = IDS.flatMap((id) =>
  (SOFAS[id] ?? []).flatMap((s): WallGlowSpot[] => {
    const level = SECTOR_SHAPES[id].level;
    const cx = (s.points[0][0] + s.points[2][0]) / 2;
    const cy = (s.points[0][1] + s.points[2][1]) / 2;
    const y = LEVEL_HEIGHT[level] + 3.2;
    if (s.back === "w") {
      const [x, z] = planToWorld([LOCAL_BOUNDS.x0, cy]);
      return [{ position: [x + 0.08, y, z], rotationY: Math.PI / 2, level }];
    }
    if (s.back === "e") {
      const [x, z] = planToWorld([LOCAL_BOUNDS.x1, cy]);
      return [{ position: [x - 0.08, y, z], rotationY: -Math.PI / 2, level }];
    }
    if (s.back === "n") {
      const [x, z] = planToWorld([cx, LOCAL_BOUNDS.y0]);
      return [{ position: [x, y, z + 0.08], rotationY: 0, level }];
    }
    return [];
  })
);
/** Zona de cada escalera con un margen: ahí las barandas se interrumpen para poder subir. */
const STAIR_GAPS = STAIRS.map(({ box }) => ({ x: box.x - 4, y: box.y - 4, w: box.w + 8, h: box.h + 8 }));
const GROUND: Pt[] = [
  [LOCAL_BOUNDS.x0, LOCAL_BOUNDS.y0],
  [LOCAL_BOUNDS.x1, LOCAL_BOUNDS.y0],
  [LOCAL_BOUNDS.x1, LOCAL_BOUNDS.y1],
  [LOCAL_BOUNDS.x0, LOCAL_BOUNDS.y1],
];

/** Pisos con paredes: el 0 es todo el perímetro del local; los otros, sus bordes pegados a la pared. */
const WALL_FLOORS: WallFloor[] = [
  { points: GROUND, base: 0, level: 0 },
  ...[1, 2, 3].map((level) => ({ points: LEVEL_FLOORS[level], base: LEVEL_HEIGHT[level], level })),
];

function Stairs({ opacity }: { opacity: (level: number) => number }) {
  const plate = useCanvasTexture(makePlateTexture);
  return (
    <>
      {STAIRS.map((s, k) => {
        const from = LEVEL_HEIGHT[s.from];
        const rise = LEVEL_HEIGHT[s.to] - from;
        const alX = s.axis === "x";
        const run = (alX ? s.box.w : s.box.h) / STEPS;
        const o = opacity(s.to);
        return Array.from({ length: STEPS }, (_, i) => {
          const h = (rise * (i + 1)) / STEPS;
          // Distancia del escalón al borde bajo, medida sobre el eje de la escalera
          const t = (s.dir === 1 ? i + 0.5 : STEPS - i - 0.5) * run;
          const [x, z] = planToWorld(alX ? [s.box.x + t, s.box.y + s.box.h / 2] : [s.box.x + s.box.w / 2, s.box.y + t]);
          // Franja amarilla en el canto de cada escalón, del lado por donde se sube
          const canto = (s.dir === 1 ? -1 : 1) * (run / 2 - 0.9);
          const [nx, nz] = planToWorld(alX ? [s.box.x + t + canto, s.box.y + s.box.h / 2] : [s.box.x + s.box.w / 2, s.box.y + t + canto]);
          return (
            <group key={`${k}-${i}`}>
              <mesh position={[x, from + h / 2, z]} raycast={() => null}>
                <boxGeometry args={alX ? [run * PLAN_SCALE, h, s.box.h * PLAN_SCALE] : [s.box.w * PLAN_SCALE, h, run * PLAN_SCALE]} />
                <SurfaceMaterial color="#ffffff" map={plate} metalness={0.6} roughness={0.5} opacity={o} />
              </mesh>
              <mesh position={[nx, from + h + 0.015, nz]} raycast={() => null}>
                <boxGeometry args={alX ? [0.18, 0.03, s.box.h * PLAN_SCALE] : [s.box.w * PLAN_SCALE, 0.03, 0.18]} />
                <SurfaceMaterial color="#f2c200" emissive="#f2c200" emissiveIntensity={0.25} roughness={0.6} opacity={o} />
              </mesh>
            </group>
          );
        });
      })}
    </>
  );
}

/** Columnas que sostienen cada entrepiso (y la plataforma de la cabina). */
function Columns({ opacity }: { opacity: (level: number) => number }) {
  const soportes = [
    ...[1, 2, 3].map((level) => ({ points: LEVEL_FLOORS[level], elevation: level, level })),
    CABINA_PLATFORM,
  ];
  return (
    <>
      {soportes.flatMap(({ points, elevation, level }, k) =>
        points.map((p, i) => {
          const [x, z] = planToWorld(p);
          const top = LEVEL_HEIGHT[elevation] - FLOOR_THICKNESS;
          const o = opacity(level);
          return (
            <mesh key={`${k}-${i}`} position={[x, top / 2, z]} raycast={() => null}>
              <cylinderGeometry args={[0.18, 0.18, top, 8]} />
              <SurfaceMaterial color="#1b1c22" metalness={0.6} roughness={0.5} opacity={o} />
            </mesh>
          );
        })
      )}
    </>
  );
}

export interface MapaScene3DProps {
  precios: Record<MapSectorId, string>;
  selectedId: MapSectorId | null;
  focus: number | null;
  /** Desde dónde se mira: la cámara se para ahí, a la altura de los ojos. null = mapa completo. */
  vista: Vista | null;
  /** Clic en un sector: pasa el punto del mundo donde se hizo. */
  onSelect: (id: MapSectorId, x: number, z: number) => void;
  /** Clic en el suelo de un piso: pasa el piso y el punto del mundo donde se hizo. */
  onViewFloor: (level: number, x: number, z: number) => void;
}

function Scene({ precios, selectedId, focus, vista, onSelect, onViewFloor }: MapaScene3DProps) {
  const viewFrom = vista !== null;
  const [hoveredId, setHoveredId] = useState<MapSectorId | null>(null);
  // Relieve: los sectores arrancan abultados y se aplanan suavemente apenas el usuario gira la cámara
  const [relief, setRelief] = useState(1);
  const [rotated, setRotated] = useState(false);
  const aplanar = rotated || viewFrom;
  useEffect(() => {
    if (!aplanar) return;
    let raf = 0;
    const tick = () => {
      setRelief((r) => {
        const next = r - 0.06;
        if (next > 0) raf = requestAnimationFrame(tick);
        return Math.max(next, 0);
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [aplanar]);
  const bump = (h: number) => h * (1 + RELIEF * relief);
  // Parado en un sector se ve todo el local sin atenuar ningún piso
  const dim = viewFrom ? null : focus;
  const opacity = (level: number) => (dim === null || dim === level ? 1 : DIM_OPACITY);
  const concrete = useCanvasTexture(makeConcreteTexture);
  const plate = useCanvasTexture(makePlateTexture);
  const bottles = useCanvasTexture(makeBottlesTexture);

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
      <hemisphereLight args={["#aab4ff", "#2a1a10", 1.5]} />
      <directionalLight position={[30, 60, 40]} intensity={2.2} />
      <directionalLight position={[-40, 30, -30]} intensity={0.5} color="#6688ff" />
      {/* Luces de color como en el local: azul en la cabina, rojo en backstage, violeta arriba y ámbar en la barra */}
      <pointLight position={[-2, 12, 27]} color="#2d6bff" intensity={1400} distance={45} decay={2} />
      <pointLight position={[-1, 15, 37]} color="#ff2a3d" intensity={1100} distance={40} decay={2} />
      <pointLight position={[28, 17, 2]} color="#9b3dff" intensity={1400} distance={50} decay={2} />
      <pointLight position={[-15, 8, -36]} color="#ffb347" intensity={1000} distance={35} decay={2} />

      {/* Suelo general bajo todo el local y paredes de ladrillo */}
      <Block points={GROUND} base={-0.4} depth={0.35} color="#8a8a95" map={concrete} metalness={0.4} roughness={0.7} />
      <BrickWalls />
      <WallLogo />

      {/* Pista principal (piso 1) */}
      <Block
        points={LEVEL_FLOORS[0]}
        base={-0.05}
        depth={0.1}
        color="#ffffff"
        map={concrete}
        metalness={0.6}
        roughness={0.3}
        opacity={opacity(0)}
        edge="#ffffff"
        onClick={(p) => onViewFloor(0, p.x, p.z)}
        onOver={() => over(null)}
        onOut={out}
      />
      <PistaLights opacity={opacity(0)} />
      {!viewFrom && focus === 0 && (() => {
        const [x, z] = worldCenter(LEVEL_FLOORS[0]);
        return <Label position={[x, 1.2, z]} title="PISTA PRINCIPAL" />;
      })()}

      {/* Entrepisos, con baranda y neón en los bordes abiertos */}
      {[1, 2, 3].map((level) => (
        <group key={level}>
          <Block
            points={LEVEL_FLOORS[level]}
            base={LEVEL_HEIGHT[level] - FLOOR_THICKNESS}
            depth={FLOOR_THICKNESS}
            color="#ffffff"
            map={plate}
            metalness={0.6}
            roughness={0.5}
            opacity={opacity(level)}
            edge={MAP_LEVELS[level].accent}
            onClick={(p) => onViewFloor(level, p.x, p.z)}
            onOver={() => over(null)}
            onOut={out}
          />
          <Railing points={LEVEL_FLOORS[level]} base={LEVEL_HEIGHT[level]} opacity={opacity(level)} gaps={level === 2 ? [...STAIR_GAPS, PUERTA_CABINA] : STAIR_GAPS} />
          <NeonEdge points={LEVEL_FLOORS[level]} base={LEVEL_HEIGHT[level]} color={MAP_LEVELS[level].accent} opacity={opacity(level)} />
        </group>
      ))}
      <Block
        points={CABINA_PLATFORM.points}
        base={LEVEL_HEIGHT[CABINA_PLATFORM.elevation] - FLOOR_THICKNESS}
        depth={FLOOR_THICKNESS}
        color="#ffffff"
        map={plate}
        metalness={0.6}
        roughness={0.5}
        opacity={opacity(CABINA_PLATFORM.level)}
        edge={CABINA_COLOR}
      />
      <NeonEdge points={CABINA_PLATFORM.points} base={LEVEL_HEIGHT[CABINA_PLATFORM.elevation]} color={CABINA_COLOR} opacity={opacity(CABINA_PLATFORM.level)} />
      <Railing segments={BARANDA_CABINA} base={LEVEL_HEIGHT[CABINA_PLATFORM.elevation]} opacity={opacity(CABINA_PLATFORM.level)} />
      <Columns opacity={opacity} />
      <Stairs opacity={opacity} />
      <StairRails opacity={opacity} />
      <WallTrim floors={WALL_FLOORS} opacity={opacity} />
      <WallDecals floors={WALL_FLOORS} opacity={opacity} />

      {/* Barras y cabina */}
      {Object.entries(PROPS).map(([key, prop]) => {
        const [cx, cz] = worldCenter(prop.points);
        const base = LEVEL_HEIGHT[prop.elevation];
        const o = opacity(prop.level);
        return (
          <group key={key}>
            {key === "cabina" ? (
              // Doble cabina: dos mesas con las puntas del medio redondeadas, sobre la plataforma
              CABINAS.map((pts, i) => (
                <Block key={i} points={pts} base={base} depth={prop.height} color={WOOD} emissive={CABINA_COLOR} emissiveIntensity={0.35} opacity={o} edge={CABINA_COLOR} />
              ))
            ) : (
              <>
                <Block points={prop.points} base={base} depth={prop.height - BAR_TOP} color={BAR_BODY} metalness={0.5} roughness={0.5} opacity={o} edge={AMBER} />
                <Block points={prop.points} base={base + prop.height - BAR_TOP} depth={BAR_TOP} color={WOOD} emissive={AMBER} emissiveIntensity={0.12} roughness={0.35} opacity={o} />
              </>
            )}
            {prop.shelf && (
              <Block
                points={prop.shelf}
                base={base}
                depth={2.6}
                color="#ffffff"
                map={bottles}
                emissive="#ffffff"
                emissiveMap={bottles}
                emissiveIntensity={0.85}
                opacity={o}
                roughness={0.6}
              />
            )}
            {/* La cabina no se reserva pero es la referencia del local: su etiqueta se ve siempre */}
            {(key === "cabina" || (!viewFrom && focus === prop.level)) && (
              <Label position={[cx, base + prop.height + 0.8, cz]} title={prop.label.toUpperCase()} titleColor={AMBER} />
            )}
          </group>
        );
      })}

      {/* Divisores entre box y box, y luces de pared detrás de los sillones */}
      {DIVIDERS.map((d, i) => (
        <Block key={i} points={d.points} base={LEVEL_HEIGHT[d.level]} depth={1.3} color={TABLE} roughness={0.5} metalness={0.7} opacity={opacity(d.level)} />
      ))}
      <WallGlows spots={GLOWS} opacity={opacity} />

      {/* Sectores reservables */}
      {IDS.map((id) => {
        const cfg = MAP_SECTORS[id];
        const shape = SECTOR_SHAPES[id];
        const selected = selectedId === id;
        const hovered = hoveredId === id;
        const base = LEVEL_HEIGHT[shape.level];
        const lift = selected ? 0.25 : 0;
        const alto = bump(shape.height);
        const [cx, cz] = worldCenter(shape.points);
        const showLabel = !viewFrom && (selected || hovered || focus === shape.level);
        return (
          <group key={id}>
            <Block
              points={shape.points}
              base={base}
              depth={alto + lift}
              color={cfg.accent}
              emissive={cfg.accent}
              emissiveIntensity={selected ? 0.9 : hovered ? 0.55 : 0.16}
              opacity={opacity(shape.level)}
              edge={selected ? "#ffffff" : cfg.accent}
              roughness={0.45}
              onClick={(p) => onSelect(id, p.x, p.z)}
              onOver={() => over(id)}
              onOut={out}
            />
            {SOFAS[id]?.map((sofa, i) => {
              const { seat, backrest } = sofaParts(sofa);
              const top = base + alto + lift;
              const mesa = tableFor(sofa);
              const [mx, mz] = worldCenter(mesa);
              const anchoMesa = (mesa[2][0] - mesa[0][0]) * PLAN_SCALE;
              const largoMesa = (mesa[2][1] - mesa[0][1]) * PLAN_SCALE;
              const o = opacity(shape.level);
              return (
                <group key={i}>
                  <Block points={seat} base={top} depth={0.55} color={SOFA_SEAT} roughness={0.8} metalness={0.1} opacity={o} />
                  <Block points={backrest} base={top} depth={1.25} color={SOFA_BACK} roughness={0.8} metalness={0.1} opacity={o} />
                  <Block points={mesa} base={top} depth={0.9} color={TABLE} roughness={0.4} metalness={0.7} opacity={o} />
                  {/* Cristalería sobre la mesa, a lo largo de su lado más largo */}
                  {[-0.3, 0, 0.3].map((t, k) => (
                    <mesh
                      key={k}
                      position={[mx + (anchoMesa >= largoMesa ? t * anchoMesa : 0), top + 1.1, mz + (anchoMesa >= largoMesa ? 0 : t * largoMesa)]}
                      raycast={() => null}
                    >
                      <cylinderGeometry args={[0.17, 0.14, 0.4, 10]} />
                      <SurfaceMaterial color="#e8c47a" emissive="#f5a300" emissiveIntensity={0.35} roughness={0.3} opacity={o} />
                    </mesh>
                  ))}
                </group>
              );
            })}
            {showLabel && (
              <Label position={[cx, base + alto + 1.6, cz]} title={cfg.name.toUpperCase()} subtitle={precios[id]} subtitleColor={cfg.accent} />
            )}
          </group>
        );
      })}

      <CameraRig focus={focus} vista={vista} onUserRotate={() => setRotated(true)} />
    </>
  );
}

export default function MapaScene3D(props: MapaScene3DProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 70, 95], fov: 32, near: 0.3, far: 400 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
