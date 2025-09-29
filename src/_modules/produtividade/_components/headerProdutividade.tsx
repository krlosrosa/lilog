'use client'
import { Badge } from "@/_shared/components/ui/badge";
import { useSearchParams } from "next/navigation";

export default function HeaderProdutividade() {
  const searchParams = useSearchParams();
  const filtros = Object.fromEntries(
    Array.from(searchParams.entries()).filter(([key]) =>
      key.startsWith("filter[")
  )
);
  const dataSelecionada = searchParams.get("data");
  const processo = searchParams.get("processo");
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1>Dashboard de Produtividade</h1>
        <Badge>{processo}</Badge>
      </div>
      <span>
        Visão geral dos processos logísticos
      </span>
      <Badge>{dataSelecionada}</Badge>
      <pre>{JSON.stringify(filtros.status, null, 2)}</pre>
    </div>
  )
}