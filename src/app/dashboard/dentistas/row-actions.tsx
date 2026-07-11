"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDentist, toggleDentist } from "../actions";

export function DentistRowActions({
  id,
  name,
  active,
}: {
  id: string;
  name: string;
  active: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (!res.ok) setError(res.error ?? "Error");
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => toggleDentist(id, !active))}
          className={active ? "text-red-600 hover:underline disabled:opacity-50" : "text-emerald-600 hover:underline disabled:opacity-50"}
        >
          {active ? "Dar de baja" : "Reactivar"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
            run(() => deleteDentist(id));
          }}
          className="text-neutral-500 hover:text-red-600 hover:underline disabled:opacity-50"
        >
          Eliminar
        </button>
      </div>
      {error && <p className="max-w-xs text-right text-xs text-red-600">{error}</p>}
    </div>
  );
}
