import { ClayBackdrop } from "@/components/clay/ClayBackdrop";
import { ClayBrandHeader } from "@/components/clay/ClayBrandHeader";
import BookingWizard from "./wizard";

export const metadata = { title: "Reservar turno" };

// El shell (canvas + blobs + marca) vive acá, en el server component, para
// que el wizard cliente se ocupe sólo de los pasos. Mismo criterio que la
// landing: el canvas clay se declara por página, no en el <body>.
export default function ReservarPage() {
  return (
    <main className="relative min-h-screen bg-clay-canvas text-clay-foreground">
      <ClayBackdrop />
      <div className="mx-auto max-w-lg px-4 pb-24 pt-5 sm:px-6 sm:pt-8">
        <ClayBrandHeader className="mb-6" />
        <BookingWizard />
      </div>
    </main>
  );
}
