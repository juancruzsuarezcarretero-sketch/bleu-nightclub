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
        const t = pick(r, c, 7);
        const hollin = pick(c, r, 9) === 0 ? 28 : 0; // algún ladrillo ennegrecido, como en las paredes del local
        g.fillStyle = `rgb(${96 + t * 8 - hollin}, ${48 + t * 4 - hollin / 2}, ${34 + t * 3 - hollin / 2})`;
        g.fillRect(x + 1, r * alto + 1, ancho - 2, alto - 2);
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.fillRect(x + 1, r * alto + alto - 3, ancho - 2, 2);
      }
    }
  }, [9, 2.2]);

/** Hormigón negro liso de la pista, con manchas y granos sutiles. Una repetición cubre unas 8 unidades del mundo. */
export const makeConcreteTexture = () =>
  canvasTexture([256, 256], (g, w, h) => {
    g.fillStyle = "#17181c";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 7; i++) {
      const x = pick(i, 3, w), y = pick(i, 5, h), r = 40 + pick(i, 9, 50);
      const mancha = g.createRadialGradient(x, y, 0, x, y, r);
      mancha.addColorStop(0, i % 2 ? "rgba(0,0,0,0.35)" : "rgba(70,72,80,0.16)");
      mancha.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = mancha;
      g.fillRect(0, 0, w, h);
    }
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = i % 3 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.25)";
      g.fillRect(pick(i, 7, w), pick(i, 13, h), 1 + (i % 2), 1);
    }
  }, [0.12, 0.12]);

/** Chapa antideslizante (de rombos alternados) de las pasarelas y entrepisos: gris acero claro. */
export const makePlateTexture = () =>
  canvasTexture([128, 128], (g, w, h) => {
    g.fillStyle = "#5a5d65";
    g.fillRect(0, 0, w, h);
    const celda = 32;
    for (let i = 0; i < w / celda; i++) {
      for (let j = 0; j < h / celda; j++) {
        const x = i * celda + celda / 2, y = j * celda + celda / 2;
        const ang = (i + j) % 2 ? Math.PI / 4 : -Math.PI / 4;
        g.fillStyle = "rgba(0,0,0,0.4)";
        g.beginPath();
        g.ellipse(x + 1.5, y + 1.5, 11, 3.4, ang, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#9a9ea8";
        g.beginPath();
        g.ellipse(x, y, 11, 3.4, ang, 0, Math.PI * 2);
        g.fill();
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

/** Panel de chapa oscura del zócalo de las paredes, de proporción 2,5:1; con o sin ojo de buey (rejilla redonda). */
function panelTexture(ojoDeBuey: boolean) {
  return canvasTexture([256, 102], (g, w, h) => {
    g.fillStyle = "#3a3c43";
    g.fillRect(0, 0, w, h);
    const rombos = 16;
    g.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < w / rombos; i++) {
      for (let j = 0; j < h / rombos; j++) {
        g.beginPath();
        g.ellipse(i * rombos + 8, j * rombos + 8, 5, 1.6, (i + j) % 2 ? Math.PI / 4 : -Math.PI / 4, 0, Math.PI * 2);
        g.fill();
      }
    }
    g.strokeStyle = "#14151a";
    g.lineWidth = 5;
    g.strokeRect(0, 0, w, h);
    g.fillStyle = "#6f7480";
    for (const [x, y] of [[10, 10], [w - 10, 10], [10, h - 10], [w - 10, h - 10]]) g.fillRect(x - 2, y - 2, 4, 4);
    if (!ojoDeBuey) return;
    const cx = w / 2, cy = h / 2, r = 32;
    g.fillStyle = "#1a1210";
    g.beginPath();
    g.arc(cx, cy, r + 5, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#7a5a40";
    g.lineWidth = 4;
    g.beginPath();
    g.arc(cx, cy, r + 3, 0, Math.PI * 2);
    g.stroke();
    g.save();
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = "#0a0a0c";
    g.fillRect(cx - r, cy - r, r * 2, r * 2);
    g.strokeStyle = "#555a64";
    g.lineWidth = 1.5;
    for (let k = -r; k <= r; k += 7) {
      g.beginPath();
      g.moveTo(cx + k, cy - r);
      g.lineTo(cx + k, cy + r);
      g.moveTo(cx - r, cy + k);
      g.lineTo(cx + r, cy + k);
      g.stroke();
    }
    g.restore();
  });
}

export const makePanelTexture = () => panelTexture(false);
export const makePortholeTexture = () => panelTexture(true);

/** Ventilador industrial de pared: aro, rejilla radial y buje. */
export const makeFanTexture = () =>
  canvasTexture([128, 128], (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const c = w / 2;
    g.fillStyle = "rgba(20,20,24,0.55)";
    g.beginPath();
    g.arc(c, c, 58, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#8a8f99";
    g.lineWidth = 6;
    g.beginPath();
    g.arc(c, c, 58, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = 2;
    for (let k = 0; k < 12; k++) {
      const a = (k * Math.PI) / 6;
      g.beginPath();
      g.moveTo(c + Math.cos(a) * 12, c + Math.sin(a) * 12);
      g.lineTo(c + Math.cos(a) * 56, c + Math.sin(a) * 56);
      g.stroke();
    }
    g.beginPath();
    g.arc(c, c, 34, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#b9bdc6";
    g.beginPath();
    g.arc(c, c, 11, 0, Math.PI * 2);
    g.fill();
  });

/** Cartel de advertencia: rombo amarillo con una X negra. */
export const makeSignTexture = () =>
  canvasTexture([128, 128], (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const c = w / 2;
    g.fillStyle = "#f2c200";
    g.beginPath();
    g.moveTo(c, 6);
    g.lineTo(w - 6, c);
    g.lineTo(c, h - 6);
    g.lineTo(6, c);
    g.closePath();
    g.fill();
    g.strokeStyle = "#16161a";
    g.lineWidth = 10;
    g.beginPath();
    g.moveTo(c - 26, c - 26);
    g.lineTo(c + 26, c + 26);
    g.moveTo(c + 26, c - 26);
    g.lineTo(c - 26, c + 26);
    g.stroke();
  });

/** Crea la textura una vez y la libera al desmontar. `make` tiene que ser una función estable (de módulo). */
export function useCanvasTexture(make: () => THREE.CanvasTexture): THREE.CanvasTexture {
  const texture = useMemo(() => make(), [make]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
