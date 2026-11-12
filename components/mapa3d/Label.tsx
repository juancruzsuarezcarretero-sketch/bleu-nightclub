"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { fontBebas, fontMono, useFontsReady } from "./fonts";

/** Alto en pantalla (fracción de la altura del canvas, sin el factor de la cámara) por cada píxel de la etiqueta. */
const LABEL_SCALE = 0.00022;

export interface LabelProps {
  position: [number, number, number];
  title: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
}

function LabelSprite({ position, title, subtitle, titleColor = "#F0F0F0", subtitleColor }: LabelProps) {
  const { texture, width, height } = useMemo(() => {
    const bebas = fontBebas();
    const mono = fontMono();
    const titlePx = 56, subPx = 30, padX = 28, padY = 18, gap = 8;
    const medidor = document.createElement("canvas").getContext("2d")!;
    medidor.font = `${titlePx}px ${bebas}`;
    let ancho = medidor.measureText(title).width;
    if (subtitle) {
      medidor.font = `${subPx}px ${mono}`;
      ancho = Math.max(ancho, medidor.measureText(subtitle).width);
    }
    const w = Math.ceil(ancho + padX * 2);
    const h = padY * 2 + titlePx + (subtitle ? gap + subPx : 0);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext("2d")!;
    g.fillStyle = "rgba(0,0,0,0.5)";
    g.strokeStyle = "rgba(255,255,255,0.1)";
    g.lineWidth = 2;
    g.beginPath();
    g.roundRect(1, 1, w - 2, h - 2, 10);
    g.fill();
    g.stroke();
    g.textAlign = "center";
    g.textBaseline = "top";
    g.font = `${titlePx}px ${bebas}`;
    g.fillStyle = titleColor;
    g.fillText(title, w / 2, padY);
    if (subtitle) {
      g.font = `${subPx}px ${mono}`;
      g.fillStyle = subtitleColor ?? titleColor;
      g.fillText(subtitle, w / 2, padY + titlePx + gap);
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return { texture: t, width: w, height: h };
  }, [title, subtitle, titleColor, subtitleColor]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <sprite position={position} scale={[width * LABEL_SCALE, height * LABEL_SCALE, 1]} renderOrder={10} raycast={() => null}>
      <spriteMaterial map={texture} transparent depthTest={false} sizeAttenuation={false} />
    </sprite>
  );
}

/**
 * Etiqueta dibujada en el propio canvas (sprite): no usa DOM, así que no depende de `Html`
 * y mantiene el mismo tamaño en pantalla aunque la cámara se acerque o se aleje.
 * Espera a que las tipografías estén cargadas para dibujar con la de la marca.
 */
export function Label(props: LabelProps) {
  const fontsReady = useFontsReady();
  return fontsReady ? <LabelSprite {...props} /> : null;
}
