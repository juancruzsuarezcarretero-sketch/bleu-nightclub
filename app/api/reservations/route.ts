import { NextRequest, NextResponse } from "next/server";
import { reservationApiSchema } from "@/lib/validations";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const result = reservationApiSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Datos inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      nombre,
      whatsapp,
      fecha,
      personas,
      mensaje,
      motivo,
      sector,
      seleccion,
      precio,
    } = result.data;

    const { error } = await supabase.from("reservations").insert({
      nombre,
      whatsapp,
      fecha,
      personas,
      mensaje: mensaje ?? null,
      motivo,
      sector,
      seleccion,
      precio,
    });

    if (error) {
      console.error("[Reservations]", error);
      return NextResponse.json(
        { error: "No se pudo guardar la reserva" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reserva guardada correctamente",
    });
  } catch (error) {
    console.error("[Reservations]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
