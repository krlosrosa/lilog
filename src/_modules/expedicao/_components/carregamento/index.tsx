'use client'
import { useCallback, useRef, useState } from "react"
import { useFileStore } from "../../_stores/useMapaImpressao"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card"
import { gerarMapaCarregamento } from "../../services/gerarMapaCarregamento"
import { Button } from "@/_shared/components/ui/button"
import { ImpressaoMapa } from "../../services/types/pickingMap"
import { useBuscarConfiguracoesImpressao } from "@/_services/api/hooks/centro/centro"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { BodyCarregamento } from "./bodyCarregamento"
import { HeaderCarregamento } from "./headerCarregamento"
import ModalConfirmaInputPaleteConferencia from "./modalConfirmaInputPaleteConferencia"
import { useSession } from "next-auth/react"
import { useReactToPrint } from "react-to-print"
import { PaleteInputZodDto } from "@/_services/api/model"
import { useAdicionarPaletesSeparacao } from "@/_services/api/hooks/transporte/transporte"
import { toast } from "react-toastify"
import { ComboboxEmpresa } from "@/_modules/center/components/selecionarEmpresa"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Skeleton } from "@/_shared/components/ui/skeleton"


export function MapaDeCarregamento({
  setTab,
}: {
  setTab: (tab: string) => void
}) {
  const { products, routes, shipments } = useFileStore()
  const { data: session } = useSession()
  const [mapas, setMapas] = useState<ImpressaoMapa[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { centerId, user } = useAuthStore()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforePrint: async () => {
      await handleAddPalete()
    },
    pageStyle: `
    @page {
     size: A4;
     margin-top: 10mm;
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

  const {
    data: config,
    isLoading: isLoadingConfig,
    isError,
  } = useBuscarConfiguracoesImpressao(centerId as string, user?.empresa as string, {
    query: {
      queryKey: ["configuracoes-centro", centerId],
      enabled: !!centerId && !!user,
    },
  })

  const handleGenerateMinuta = useCallback(async () => {
    setIsGenerating(true)
    const result = await gerarMapaCarregamento({
      products,
      routes,
      shipments,
    })
    setMapas(result)
    setIsGenerating(false)
  }, [products, routes, shipments])
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
          <Button onClick={handleGenerateMinuta} disabled={isGenerating}>
            {isGenerating ? "Gerando..." : "Gerar mapas"}
          </Button>
          <ModalConfirmaInputPaleteConferencia
            disabled={isAdding || mapas.length === 0}
            onSubmit={handlePrint}
          >
            <Button disabled={isAdding || mapas.length === 0}>
              {isAdding ? "Adicionando..." : "Imprimir"}
            </Button>
          </ModalConfirmaInputPaleteConferencia>
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
                return <div
                  key={mapa.paleteId}
                  className={`mb-4 p-1 rounded-lg ${index > 0 ? "print-page-break" : ""}`}
                  style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                >
                  <HeaderCarregamento mapa={mapa} />
                  <BodyCarregamento transporteId={transporteId} config={config} itens={mapa.itens} />
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
