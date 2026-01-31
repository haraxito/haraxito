"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Truck, Building2 } from "lucide-react";

export default function FilterChips({ currentFilter }: { currentFilter: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "tous") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    router.push(`/technicien?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        onClick={() => handleFilter("tous")}
        className={`flex shrink-0 items-center justify-center gap-x-2 rounded-full h-9 px-4 transition shadow-sm ${
          currentFilter === "tous"
            ? "bg-emerald-600 text-white border border-emerald-600"
            : "bg-white border border-gray-200 hover:border-gray-300 text-slate-700"
        }`}
      >
        <p className="text-sm font-medium">Tous</p>
      </button>
      <button
        onClick={() => handleFilter("domicile")}
        className={`flex shrink-0 items-center justify-center gap-x-2 rounded-full h-9 px-4 transition shadow-sm ${
          currentFilter === "domicile"
            ? "bg-emerald-600 text-white border border-emerald-600"
            : "bg-white border border-gray-200 hover:border-gray-300 text-slate-700"
        }`}
      >
        <Truck className={`w-4 h-4 ${currentFilter === "domicile" ? "text-white" : "text-emerald-600"}`} />
        <p className="text-sm font-medium">Domicile</p>
      </button>
      <button
        onClick={() => handleFilter("atelier")}
        className={`flex shrink-0 items-center justify-center gap-x-2 rounded-full h-9 px-4 transition shadow-sm ${
          currentFilter === "atelier"
            ? "bg-emerald-600 text-white border border-emerald-600"
            : "bg-white border border-gray-200 hover:border-gray-300 text-slate-700"
        }`}
      >
        <Building2 className={`w-4 h-4 ${currentFilter === "atelier" ? "text-white" : "text-blue-600"}`} />
        <p className="text-sm font-medium">Atelier</p>
      </button>
    </div>
  );
}
