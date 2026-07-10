import { NextRequest, NextResponse } from "next/server";
import { BookingError, schedulePlanSessions } from "@/lib/booking";

// Agenda las sesiones restantes sugeridas de un tratamiento multi-sesión
// a partir del primer turno ya confirmado.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { booked } = await schedulePlanSessions(id);
    return NextResponse.json({
      booked: booked.map((b) => ({
        sessionNumber: b.sessionNumber,
        startsAt: b.startsAt.toISOString(),
      })),
    });
  } catch (err) {
    if (err instanceof BookingError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Error agendando plan:", err);
    return NextResponse.json(
      { error: "No pudimos agendar las sesiones." },
      { status: 500 }
    );
  }
}
