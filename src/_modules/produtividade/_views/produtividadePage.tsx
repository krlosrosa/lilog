'use client'
import { useAuthStore } from "@/_shared/stores/auth.store";
import HeaderProdutividade from "../_components/headerProdutividade";
import { OverView } from "../_components/overView";
import { useGetOverViewQuery } from "@/_services/graphql/produtividade/getOverView.graphql";
import { useSearchParams } from "next/navigation";
import { ListaProdutividade } from "../_components/listaProdutividade";
import { ErrorState, LoadingState } from "@/_shared/components/feedbacks";
import DefinirProcesso from "../_components/definirProcesso";
import { useEffect, useState } from "react";
import { Filtros } from "../_components/filtros";
import { useRouter } from "next/navigation";
import { StartProdutividade } from "../_components/acoes/startProdutividade";
import { FinalizarProdutividade } from "../_components/acoes/finalizarProcesso";
import { FinalizarPausaIndividual } from "../_components/acoes/finalizarPausaIndividual";
import { FinalizarPausaGeral } from "../_components/acoes/finalizarPausaGeral";
import { AddPausaIndividual } from "../_components/acoes/addPausaIndividual";
import { AddPausaGeral } from "../_components/acoes/addPausaGeral";
import { Can } from "@/_shared/utils/casl";

export type Filtros = {
  data: string;
  processo: string;
  segmento: string;
  empresa: string;
  status: string;
}

export default function ProdutividadePage() {
  const router = useRouter();
  const { centerId, ability } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({
    data: '',
    processo: '',
    segmento: '',
    empresa: '',
    status: '',
  });
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const dataSelecionada = searchParams.get("data");
  const processo = searchParams.get("processo");
  const segmento = searchParams.get("segmento");
  const empresa = searchParams.get("empresa");
  const status = searchParams.get("status");
  const pesquisa = searchParams.get("pesquisa");

  const { data: dataOverview, isLoading, error } = useGetOverViewQuery(
    {
      inputOverview: {
        centerId,
        data: dataSelecionada || "",
        processo: processo || "",
        segmento: segmento || "",
      },
      inputProdutividade: {
        centerId,
        pesquisa: pesquisa || "",
        data: dataSelecionada || "",
        processo: processo || "",
        segmento: segmento || "",
        empresa: empresa || "",
        status: status || "",
      }
    },
    {
      enabled: !!dataSelecionada && !!processo,
    }
  );

   useEffect(() => {
    if(centerId === ''){
      router.push('/selecionar-centro');
      return;
    }
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value)); // Garante que o valor seja uma string
      } else {
        // Se o valor for "falsy" (como "", null, ou undefined), remove o parâmetro.
        params.delete(key);
      }
    });
    router.replace(`/produtividade?${params.toString()}`);
  }, [filtros]);

 useEffect(() => {
  if(centerId === ''){
    router.push('/selecionar-centro');
    return;
  }
    setOpen(false);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Can I="read" a="PRODUTIVIDADE">    
          <HeaderProdutividade />
          <StartProdutividade />
          <FinalizarPausaIndividual />
          <AddPausaGeral processo={processo} />
          <FinalizarPausaGeral processo={processo} />
          <AddPausaIndividual />
          <FinalizarProdutividade />
        </Can>
      </div>
      <DefinirProcesso filtros={filtros} setFiltros={setFiltros} open={open} setOpen={setOpen} />
        <Filtros filtros={filtros} setFiltros={setFiltros} />
      {isLoading ? <LoadingState /> : error ? <ErrorState /> : <div>
        <OverView overview={dataOverview?.overViewProdutividade} />
        <ListaProdutividade produtividade={dataOverview?.produtividade} />
      </div>}
    </div>
  )
}