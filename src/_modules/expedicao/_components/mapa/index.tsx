'use client'
import { useCallback, useEffect, useRef, useState } from "react"
import { useFileStore } from "../../_stores/useMapaImpressao"  
import { ImpressaoMapa } from "../../services/types/pickingMap"
import { gerarMapaSeparacao } from "../../services/gerarMapaSeparacao"
import {
  useAdicionarPaletesSeparacao,
} from "@/_services/api/hooks/transporte/transporte"
import { PaleteInputZodDto } from "@/_services/api/model"
import { Button } from "@/_shared/components/ui/button"
import { useAuthStore } from "@/_shared/stores/auth.store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card"
import { Skeleton } from "@/_shared/components/ui/skeleton"
import { ScrollArea } from "@/_shared/components/ui/scroll-area"
import { useBuscarConfiguracoesImpressao } from "@/_services/api/hooks/centro/centro"
import { toast } from "react-toastify"
import ModalConfirmaInputPaleteMapa from "./modalConfirmaInputPaleteMapa"
import { useConfigGroupsImpressao } from "../../_stores/useConfigGroupsImpressao"
import { useReactToPrint } from "react-to-print"
import { HeaderPicking } from "./picking/headerPicking"
import { BodyPalete } from "./palete/bodyPalete"
import { BodyUnidade } from "./unidade/bodyUnidade"
import { BodyFifo } from "./fifo/bodyFifo"
import { BodyPicking } from "./picking/bodyPicking"
import { useSession } from "next-auth/react"

export default function Mapa({ setTab }: { setTab: (tab: string) => void }) {
  const { centerId } = useAuthStore()
  const { data: session } = useSession()
  const { segregarClientes, agruparClientes, agruparTransportes, agruparRemessas } = useConfigGroupsImpressao()
  const { products, routes, shipments } = useFileStore()
  const [mapas, setMapas] = useState<ImpressaoMapa[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforePrint: async () => {
      await handleAddPalete()
    },
    pageStyle: `
    @page {
     size: A4;
     margin-top: 0mm;
     margin-bottom: 20mm;
     margin-left: 5mm;
     margin-right: 5mm;

     /* Força o conteúdo das áreas de cabeçalho a ser vazio, removendo o padrão do navegador */
     @top-center { content: ""; }
     @top-left { 
       font-size: 8pt;
       font-family: Arial, sans-serif;
       color: #71717a; /* zinc-500 */
     }
     @top-right { content: ""; }

     @bottom-right {
       content: "Página " counter(page) " de " counter(pages);
       font-size: 8pt;
       font-family: Arial, sans-serif;
       color: #71717a; /* zinc-500 */
     }
     @bottom-left {
       content: "Impresso em: ${new Date().toLocaleString('pt-BR')} - impressão por ${session?.user?.name} ";
       font-size: 8pt;
       font-family: Arial, sans-serif;
       color: #71717a; /* zinc-500 */
     }
   }

   @media print {
     body {
       -webkit-print-color-adjust: exact;
       color-adjust: exact;
     }
     .no-print {
       display: none !important;
     }
     .print-page-break {
       page-break-before: always !important;
     }
   }
 `
  })

  const { mutateAsync: addPalete, isPending: isAdding } = useAdicionarPaletesSeparacao({
    mutation: {
      onSuccess: () => {
        toast.success("Paletes adicionados com sucesso!")
      },
      onError: () => {
        toast.error("Ocorreu um erro ao adicionar os paletes.")
      }
    },
  })
  const {
    data: config,
    isLoading: isLoadingConfig,
    isError,
    } = useBuscarConfiguracoesImpressao(centerId as string, {
    query: {
      queryKey: ["configuracoes-centro", centerId],
      enabled: !!centerId,
    },
  })

  const generateMap = useCallback(async () => {
    if (!config) {
      return
    }
    setIsGenerating(true)
    try {
      const result = await gerarMapaSeparacao(
        {
          products,
          routes,
          shipments,
        },
        config,
        segregarClientes || [],
        agruparClientes || [],
        agruparTransportes || [],
        agruparRemessas || [],
      )
      setMapas(result)
    } finally {
      setIsGenerating(false)
    }
  }, [config, products, routes, shipments])

  const handleAddPalete = useCallback(async () => {
    const headers = mapas.map(item => {
      const { itens, ...rest } = item
      return rest
    })
    const mapHeader: PaleteInputZodDto = headers.map(item => {
      return {
        transporteId: item.transportId,
        id: item.paleteId,
        empresa: item.empresa,
        quantidadeCaixas: item.caixas,
        quantidadeUnidades: item.unidades,
        quantidadePaletes: item.paletes,
        enderecoVisitado: item.linhasVisitadas,
        segmento: item.segmento,
        tipoProcesso: item.processo,
      }
    })
    await addPalete({
      data: mapHeader,
    })
  }, [mapas, addPalete])

  if (isLoadingConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapas de Separação</CardTitle>
          <CardDescription>
            Aguarde, carregando configurações...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return <div>Erro ao buscar configurações</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Mapas de Separação</CardTitle>
          <CardDescription>
            Visualize e gerencie os mapas gerados.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setTab("configuracoes")}>
            Voltar para Configurações
          </Button>
          <Button onClick={generateMap} disabled={isGenerating}>
            {isGenerating ? "Gerando..." : "Gerar mapas"}
          </Button>
          <ModalConfirmaInputPaleteMapa
            disabled={isAdding || mapas.length === 0}
            onSubmit={handlePrint}
          >
            <Button disabled={isAdding || mapas.length === 0}>
              {isAdding ? "Adicionando..." : "Imprimir"}
            </Button>
          </ModalConfirmaInputPaleteMapa>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] w-full">
          <div ref={printRef}>
            {isGenerating ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : mapas.length > 0 ? (
              mapas.map((mapa, index) => {
                const tipo = config?.tipoImpressao as 'CLIENTE' | 'TRANSPORTE'
                const transporteId = `${mapa.transportId}${tipo === 'CLIENTE' ? `[${mapa.codClientes[0]}]` : ''}`
                const exibirCliente = config?.exibirInfoCabecalho as 'PRIMEIRO' | 'TODOS' | 'NENHUM'
                return <div
                  key={mapa.paleteId}
                  className={`mb-4 p-1 rounded-lg ${index > 0 ? "page-break-before-always" : ""
                    }`}
                >
                  <HeaderPicking mapa={mapa} tipo={tipo} exibirCliente={exibirCliente} />
                  {mapa.tipo === 'picking' && <BodyPicking transporteId={transporteId} config={config} itens={mapa.itens} />}
                  {mapa.tipo === 'palete' && <BodyPalete config={config} itens={mapa.itens} />}
                  {mapa.tipo === 'unidade' && <BodyUnidade config={config} itens={mapa.itens} />}
                  {mapa.tipo === 'fifo' && <BodyFifo config={config} itens={mapa.itens} />}
                </div>
              })
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Nenhum mapa gerado.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}