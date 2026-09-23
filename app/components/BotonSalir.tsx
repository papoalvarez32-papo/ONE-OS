"use client";

import { useTransition } from "react";
import { logout } from "@/app/actions";

export function BotonSalir() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      className="text-sm text-slate-500 hover:text-slate-900 disabled:opacity-50"
    >
      Salir
    </button>
  );
}
