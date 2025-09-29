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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Produtividade</h1>
        {processo && <Badge>{processo}</Badge>}
      </div>
      <div className="flex items-center gap-2">

      <p className="text-muted-foreground">
        Visão geral dos processos logísticos
      </p>
      {dataSelecionada && <Badge>{dataSelecionada}</Badge>}
      </div>
      <pre>{JSON.stringify(filtros.status, null, 2)}</pre>
    </div>
  )
}