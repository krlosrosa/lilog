'use client'
import { useCallback, useEffect, useRef, useState } from "react"
import { useFileStore } from "../../_stores/useMapaImpressao"
import { Header } from "./minutaHeader"
import { Body } from "./minutaBody"
import type { ImpressaoMinutaCarregamento } from "../../services/types/pickingMap"
import { gerarMinutaCarregamento } from "../../services/gerarMinutaCarregamento"
import { Button } from "@/_shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card"
import { Skeleton } from "@/_shared/components/ui/skeleton"
import { ScrollArea } from "@/_shared/components/ui/scroll-area"
import { useReactToPrint } from "react-to-print"
import ModalConfirmaInputPaleteCarregamento from "./modalConfirmaInputPaleteCarregamento"
import { toast } from "react-toastify"
import { useAdicionarPaletesSeparacao } from "@/_services/api/hooks/transporte/transporte"
import { PaleteInputZodDto } from "@/_services/api/model"
import { useSession } from "next-auth/react"
import ProtocoloExpedicao from "../protocolos/protocolo"

export function ImpressaoMinutaCarregamentoPage({
  setTab,
}: {
  setTab: (tab: string) => void
}) {
  const { products, routes, shipments } = useFileStore()
  const { data: session } = useSession()
  const [minutas, setMinutas] = useState<ImpressaoMinutaCarregamento[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const { mutateAsync: addPalete, isPending: isAdding } = useAdicionarPaletesSeparacao({
    mutation: {
      onSuccess: () => {
        toast.success("Paletes adicionados com sucesso!")
        setTab("minuta")
      },
      onError: () => {
        toast.error("Ocorreu um erro ao adicionar os paletes.")
      }
    },
  })

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

  const handleAddPalete = useCallback(async () => {
    const headers = minutas.map(item => {
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
  }, [minutas, addPalete])


  const handleGenerateMinuta = useCallback(async () => {
    setIsGenerating(true)
    try {
      const result = await gerarMinutaCarregamento({
        products,
        routes,
        shipments,
      })
      setMinutas(result)
    } finally {
      setIsGenerating(false)
    }
  }, [products, routes, shipments])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Minuta de Carregamento</CardTitle>
          <CardDescription>
            Visualize a minuta de carregamento gerada a partir dos arquivos.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setTab("configuracoes")}>
            Voltar para Configurações
          </Button>
          <ProtocoloExpedicao tipo="CARREGAMENTO"/>
          <ModalConfirmaInputPaleteCarregamento
            disabled={isGenerating}
            onSubmit={handlePrint}
          >
            <Button
              disabled={minutas.length === 0}
              variant="outline"
            >
              Imprimir
            </Button>
          </ModalConfirmaInputPaleteCarregamento>
          <Button onClick={handleGenerateMinuta} disabled={isGenerating}>
            {isGenerating ? "Gerando..." : "Gerar Minuta"}
          </Button>
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
            ) : minutas.length > 0 ? (
              minutas.map((minuta, index) => (
                <div
                  key={minuta.id}
                  className={`mb-4 rounded-lg border p-2 ${index > 0 ? "print-page-break" : ""}`}
                  style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                >
                  <Header mapa={minuta} />
                  <Body itens={minuta.itens} />
                </div>
              ))
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Nenhuma minuta gerada.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
