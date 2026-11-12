"use client";

import { useEffect, useMemo } from "react";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { planToWorld, type Pt } from "@/lib/map-3d";

/** Centro (en el mundo) de una lista de puntos del plano. */
export function worldCenter(points: Pt[]): [number, number] {
  const w = points.map(planToWorld);
  const xs = w.map((p) => p[0]);
  const zs = w.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
}

export interface SurfaceProps {
  color: string;
  map?: THREE.Texture;
  emissive?: string;
  emissiveMap?: THREE.Texture;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  /** Menor a 1 = piso atenuado: se dibuja como fantasma, sin luces, para que las luces de color no lo vuelvan a encender. */
  opacity?: number;
}

export function SurfaceMaterial({
  color, map, emissive, emissiveMap, emissiveIntensity = 0, metalness = 0.2, roughness = 0.7, opacity = 1,
}: SurfaceProps) {
  if (opacity < 1) return <meshBasicMaterial color={color} map={map} transparent opacity={opacity} depthWrite={false} />;
  return (
    <meshStandardMaterial
      color={color}
      map={map}
      emissive={emissive ?? "#000000"}
      emissiveMap={emissiveMap}
      emissiveIntensity={emissiveIntensity}
      metalness={metalness}
      roughness={roughness}
    />
  );
}

export interface BlockProps {
  points: Pt[];
  base: number;
  depth: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  map?: THREE.Texture;
  emissiveMap?: THREE.Texture;
  opacity?: number;
  edge?: string;
  metalness?: number;
  roughness?: number;
  onClick?: () => void;
  onOver?: () => void;
  onOut?: () => void;
}

/** Volumen extruido a partir de un polígono del plano, apoyado en `base` y de alto `depth`. */
export function Block({
  points, base, depth, color, emissive, emissiveIntensity = 0, map, emissiveMap, opacity = 1, edge,
  metalness = 0.2, roughness = 0.7, onClick, onOver, onOut,
}: BlockProps) {
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
      <SurfaceMaterial
        color={color}
        map={map}
        emissive={emissive}
        emissiveMap={emissiveMap}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        opacity={opacity}
      />
      {edge && <Edges color={edge} threshold={20} />}
    </mesh>
  );
}
