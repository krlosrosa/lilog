'use client'
import { Button } from "@/_shared/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/_shared/components/ui/dropdown-menu";
import { Input } from "@/_shared/components/ui/input";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Filtros as FiltrosType } from "../_views/produtividadePage";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function Filtros({ filtros, setFiltros }: { filtros: FiltrosType, setFiltros: (filtros: FiltrosType) => void }) {

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [search, setSearch] = useState("");
  // callback com debounce só pra URL
  const updateUrl = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("pesquisa", value);
    } else {
      params.delete("pesquisa");
    }

    replace(`/produtividade?${params.toString()}`);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);       // ✅ reflete no input na hora
    updateUrl(value);       // ✅ atualiza URL com debounce
  };

  return (
    <div className="my-2 flex gap-2">
      <Input value={search} onChange={handleSearch} placeholder="Pesquisar" className="w-full border border-gray-300 rounded-md p-2" />
      <FiltroStatus filtros={filtros} setFiltros={setFiltros} />
      <FiltroEmpresa filtros={filtros} setFiltros={setFiltros} />
      <FiltroSegmento filtros={filtros} setFiltros={setFiltros} />
    </div>
  )
}

function FiltroEmpresa({ filtros, setFiltros }: { filtros: FiltrosType, setFiltros: (filtros: FiltrosType) => void }) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default">
            {filtros.empresa || "Empresa"}
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, empresa: "" })}>Todos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, empresa: "Lactalis" })}>Lactalis</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, empresa: "Itambe" })}>Itambé</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, empresa: "DPA" })}>DPA</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function FiltroSegmento({ filtros, setFiltros }: { filtros: FiltrosType, setFiltros: (filtros: FiltrosType) => void }) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default">
            {filtros.segmento || "Segmento"}
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, segmento: "" })}>Todos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, segmento: "SECA" })}>Seco</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, segmento: "REFR" })}>Refrigerado</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, segmento: "QUEIJO" })}>Queijo</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function FiltroStatus({ filtros, setFiltros }: { filtros: FiltrosType, setFiltros: (filtros: FiltrosType) => void }) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default">
            {filtros.status || "Status"}
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, status: "" })}>Todos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, status: "EM_PROGRESSO" })}>Em Andamento</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, status: "PAUSA" })}>Em Pausa</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFiltros({ ...filtros, status: "FINALIZADA" })}>Finalizado</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}