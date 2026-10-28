import { describe, expect, it } from "vitest";
import { DEFAULT_CONTENT, parseContent, usuarioInstagram } from "./content";
import { reservationFromPaquete, textoPrecio } from "./reservation-selection";

describe("parseContent: la web nunca queda rota", () => {
  it("sin filas o con basura devuelve los valores por defecto", () => {
    expect(parseContent([])).toEqual(DEFAULT_CONTENT);
    expect(parseContent(null)).toEqual(DEFAULT_CONTENT);
    expect(parseContent({ error: "x" })).toEqual(DEFAULT_CONTENT);
    expect(parseContent([{ key: "contacto", value: 5 }])).toEqual(DEFAULT_CONTENT);
  });

  it("toma el contacto publicado cuando es válido", () => {
    const contacto = { ...DEFAULT_CONTENT.contacto, whatsapp: "5491112345678", instagram: "https://www.instagram.com/nuevo.club" };
    expect(parseContent([{ key: "contacto", value: contacto }]).contacto).toEqual(contacto);
  });

  it("rechaza links peligrosos o de otro dominio en el contacto", () => {
    for (const instagram of ["javascript:alert(1)", "http://instagram.com/x", "https://evil.com/instagram.com"]) {
      const roto = { ...DEFAULT_CONTENT.contacto, instagram };
      expect(parseContent([{ key: "contacto", value: roto }]).contacto).toEqual(DEFAULT_CONTENT.contacto);
    }
    const sinNumero = { ...DEFAULT_CONTENT.contacto, whatsapp: "no es un numero" };
    expect(parseContent([{ key: "contacto", value: sinNumero }]).contacto).toEqual(DEFAULT_CONTENT.contacto);
  });

  it("eventos: descarta los inválidos, conserva los válidos y respeta una lista vacía", () => {
    const bueno = DEFAULT_CONTENT.eventos[0];
    const imagenAjena = { ...bueno, id: 2, image: "https://evil.com/foto.jpg" };
    const sinNombre = { ...bueno, id: 3, name: "" };
    expect(parseContent([{ key: "eventos", value: [bueno, imagenAjena, sinNombre] }]).eventos).toEqual([bueno]);
    expect(parseContent([{ key: "eventos", value: [] }]).eventos).toEqual([]);
    expect(parseContent([{ key: "eventos", value: "roto" }]).eventos).toEqual(DEFAULT_CONTENT.eventos);
  });

  it("paquetes: precio inválido descarta solo ese paquete", () => {
    const [a, b] = DEFAULT_CONTENT.paquetes;
    const resultado = parseContent([{ key: "paquetes", value: [a, { ...b, precio: -5 }, { ...b, id: "x", precio: 1.5 }] }]).paquetes;
    expect(resultado).toEqual([a]);
  });
});

describe("paquetes por defecto = lo que la web mostraba antes", () => {
  // Valores del PACKAGE_RESERVATIONS anterior, escritos a mano para comparar.
  const antes = {
    "vip-gold": { displayLabel: "VIP Gold - $35.000 por persona", sector: "VIP Gold", priceLabel: "$35.000 por persona", theme: "gold", perPerson: true, pricePerPerson: 35000 },
    "vip-standing": { displayLabel: "VIP Standing - $50.000 por persona", sector: "VIP Standing", priceLabel: "$50.000 por persona", theme: "gold", perPerson: true, pricePerPerson: 50000 },
    ultra: { displayLabel: "Ultra VIP - $100.000 por persona", sector: "Ultra VIP", priceLabel: "$100.000 por persona", theme: "purple", perPerson: true, pricePerPerson: 100000 },
    "mesa-vip": { displayLabel: "Mesa VIP - $700.000 mesa completa", sector: "Mesas VIP", priceLabel: "$700.000", theme: "gold", perPerson: false, fixedPrice: 700000 },
    "mesa-ultra": { displayLabel: "Mesa Ultra VIP - $1.200.000 mesa completa", sector: "Mesas Ultra VIP", priceLabel: "$1.200.000", theme: "purple", perPerson: false, fixedPrice: 1200000 },
  };

  it("la reserva de cada paquete es idéntica a la anterior", () => {
    for (const p of DEFAULT_CONTENT.paquetes) {
      expect(reservationFromPaquete(p)).toStrictEqual(antes[p.id as keyof typeof antes]);
    }
    expect(DEFAULT_CONTENT.paquetes).toHaveLength(5);
  });

  it("el texto del precio en las tarjetas era este", () => {
    expect(DEFAULT_CONTENT.paquetes.map(textoPrecio)).toEqual([
      "$35.000 por persona", "$50.000 por persona", "$100.000 por persona", "$700.000 mesa completa", "$1.200.000 mesa completa",
    ]);
  });

  it("si cambia el precio, cambian la tarjeta y la reserva juntas", () => {
    const nuevo = { ...DEFAULT_CONTENT.paquetes[0], precio: 40000 };
    expect(textoPrecio(nuevo)).toBe("$40.000 por persona");
    expect(reservationFromPaquete(nuevo).pricePerPerson).toBe(40000);
  });
});

describe("usuarioInstagram", () => {
  it("saca el usuario del link", () => {
    expect(usuarioInstagram("https://instagram.com/bleu.club")).toBe("@bleu.club");
    expect(usuarioInstagram("https://www.instagram.com/bleu.club/")).toBe("@bleu.club");
  });
});
