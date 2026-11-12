import { useEffect, useMemo } from "react";
import * as THREE from "three";

// Variación determinista (sin Math.random): la misma textura en cada carga y en cada render
const hash = (a: number, b: number) => ((a * 73856093) ^ (b * 19349663)) >>> 0;
const pick = (a: number, b: number, n: number) => hash(a, b) % n;

function canvasTexture(
  [w, h]: [number, number],
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
  repeat?: [number, number]
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (repeat) t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Ladrillo a la vista, de tonos rojizos como las paredes del local. */
export const makeBrickTexture = () =>
  canvasTexture([256, 256], (g, w, h) => {
    g.fillStyle = "#120a07"; // mortero
    g.fillRect(0, 0, w, h);
    const filas = 16, alto = h / filas, ancho = 64;
    for (let r = 0; r < filas; r++) {
      const desfase = r % 2 ? ancho / 2 : 0;
      for (let c = -1; c <= w / ancho; c++) {
        const x = c * ancho + desfase;
        const t = pick(r, c, 5);
        g.fillStyle = `rgb(${108 + t * 9}, ${56 + t * 4}, ${40 + t * 3})`;
        g.fillRect(x + 1, r * alto + 1, ancho - 2, alto - 2);
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.fillRect(x + 1, r * alto + alto - 3, ancho - 2, 2);
      }
    }
  }, [9, 2.2]);

/** Baldosa oscura de la pista. El lado del canvas son 2 baldosas; una repetición cubre 5 unidades del mundo. */
export const makeTileTexture = () =>
  canvasTexture([256, 256], (g, w, h) => {
    const n = 2, lado = w / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const t = pick(i, j, 4);
        g.fillStyle = `rgb(${34 + t * 4}, ${37 + t * 4}, ${50 + t * 5})`;
        g.fillRect(i * lado, j * lado, lado, lado);
      }
    }
    g.strokeStyle = "#0f1118";
    g.lineWidth = 4;
    for (let k = 0; k <= n; k++) {
      g.beginPath();
      g.moveTo(k * lado, 0);
      g.lineTo(k * lado, h);
      g.moveTo(0, k * lado);
      g.lineTo(w, k * lado);
      g.stroke();
    }
  }, [0.2, 0.2]);

/** Chapa antideslizante de las pasarelas y entrepisos. */
export const makePlateTexture = () =>
  canvasTexture([128, 128], (g, w, h) => {
    g.fillStyle = "#2b2e38";
    g.fillRect(0, 0, w, h);
    const celda = 16;
    g.lineWidth = 3;
    g.lineCap = "round";
    for (let i = 0; i < w / celda; i++) {
      for (let j = 0; j < h / celda; j++) {
        const invertida = (i + j) % 2 === 1;
        const x = i * celda + celda / 2, y = j * celda + celda / 2;
        g.strokeStyle = invertida ? "#454957" : "#3a3e4a";
        g.beginPath();
        if (invertida) {
          g.moveTo(x - 5, y - 5);
          g.lineTo(x + 5, y + 5);
        } else {
          g.moveTo(x + 5, y - 5);
          g.lineTo(x - 5, y + 5);
        }
        g.stroke();
      }
    }
  }, [0.4, 0.4]);

/** Estante de botellas iluminado, para el fondo de las barras. */
export const makeBottlesTexture = () =>
  canvasTexture([256, 128], (g, w, h) => {
    g.fillStyle = "#1d1006";
    g.fillRect(0, 0, w, h);
    const luz = g.createLinearGradient(0, 0, 0, h);
    luz.addColorStop(0, "rgba(245,163,0,0.35)");
    luz.addColorStop(1, "rgba(245,163,0,0.05)");
    g.fillStyle = luz;
    g.fillRect(0, 0, w, h);
    const colores = ["#f5c46b", "#e8e2d0", "#3f8f4f", "#c0392b", "#d98b2b"];
    for (let fila = 0; fila < 3; fila++) {
      const y0 = 8 + fila * 40;
      g.fillStyle = "rgba(255,255,255,0.25)";
      g.fillRect(0, y0 + 30, w, 3);
      for (let i = 0; i < 14; i++) {
        const alto = 18 + pick(fila, i, 3) * 5;
        const x = 6 + i * 18;
        g.fillStyle = colores[pick(i, fila, colores.length)];
        g.fillRect(x, y0 + 30 - alto, 9, alto);
        g.fillRect(x + 3, y0 + 30 - alto - 7, 3, 8);
      }
    }
  }, [0.18, 0.38]);

/** Resplandor ámbar que sube por la pared de ladrillo desde una luz de pared. */
export const makeGlowTexture = () =>
  canvasTexture([128, 256], (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const luz = g.createRadialGradient(w / 2, h * 0.78, 4, w / 2, h * 0.78, h * 0.62);
    luz.addColorStop(0, "rgba(255,190,90,0.95)");
    luz.addColorStop(0.35, "rgba(255,150,50,0.45)");
    luz.addColorStop(1, "rgba(255,120,30,0)");
    g.fillStyle = luz;
    g.fillRect(0, 0, w, h);
  });

/** Logo circular naranja con la B, como el de la pared del local. `fuente` es la familia tipográfica de la marca. */
export const makeLogoTexture = (fuente: string) =>
  canvasTexture([256, 256], (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = "#f5a300";
    g.lineWidth = 14;
    g.beginPath();
    g.arc(w / 2, h / 2, 104, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#f5a300";
    g.font = `150px ${fuente}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("B", w / 2, h / 2 + 8);
  });

/** Crea la textura una vez y la libera al desmontar. `make` tiene que ser una función estable (de módulo). */
export function useCanvasTexture(make: () => THREE.CanvasTexture): THREE.CanvasTexture {
  const texture = useMemo(() => make(), [make]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
