'use client'

import {
  useAdicionarTransporte,
  useListarTransportesComDemandaIniciada,
  useListarTransportesNaoCadastrados,
} from "@/_services/api/hooks/transporte/transporte"
import { useEffect, useRef, useState } from "react"
import { listarTransportes } from "../../services/listarTransportes"
import { ajustarInputDados } from "../../services/ajustarInputDados"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { Button } from "@/_shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card"
import { ScrollArea } from "@/_shared/components/ui/scroll-area"
import { toast } from "react-toastify"
import { Skeleton } from "@/_shared/components/ui/skeleton"
import ModaConfirmacaoAddTransporte from "./modaConfirmacaoAddTransporte"
import { Badge } from "@/_shared/components/ui/badge"
import { useFileStore } from "../../_stores/useMapaImpressao"

export default function TransportesAdicionados({
  setTab,
}: {
  setTab: (tab: string) => void
}) {
  const { centerId } = useAuthStore()
  const { shipments } = useFileStore()
  const [transportes, setTransportes] = useState<string[]>([])
  const [transportesIniciados, setTransportesIniciados] = useState<string[]>([])
  const effectRan = useRef(false)

  const { mutate: adicionarTransporte, isPending: isAdding } =
    useAdicionarTransporte({
      mutation: {
        onSuccess: () => {
          toast.success("Transportes adicionados com sucesso!")
          setTab("configuracoes")
        },
      },
    })

  const { mutateAsync: transportesComDemandaIniciada, isPending: isLoadingTransportesComDemandaIniciada } = useListarTransportesComDemandaIniciada({
    mutation: {
      // Deixamos a decisão de navegação para a lógica combinada abaixo
      onError() {
        toast.error("Ocorreu um erro ao buscar os transportes com demanda iniciada.")
      },
    },
  })


  const { mutateAsync: fetchTransports, isPending: isFetching } =
    useListarTransportesNaoCadastrados({
      mutation: {
        // Deixamos a decisão de navegação para a lógica combinada abaixo
        onError() {
          toast.error("Ocorreu um erro ao buscar os transportes pendentes.")
        },
      },
    })



  async function handleAddTransporte(dataExpedicao: string) {
    const transportesInput = await ajustarInputDados({
      shipments: shipments as File,
      transportes: transportes,
    })
    adicionarTransporte({
      centerId: centerId || "",
      data: transportesInput,
      params: {
        dataExpedicao: dataExpedicao,
      },
    })
  }

  useEffect(() => {
    if (effectRan.current === true) {
      return
    }

    async function getTransportes() {
      if (shipments) {
        const transportesIds = await listarTransportes(shipments)
        if (transportesIds.length === 0) {
          toast.info("Nenhum transporte encontrado no arquivo de remessas.")
          setTab("configuracoes")
          return
        }

        // Buscar em paralelo: iniciados e não cadastrados
        const [iniciadosResp, naoCadastradosResp] = await Promise.all([
          transportesComDemandaIniciada({ data: transportesIds }) as unknown,
          fetchTransports({ data: transportesIds }) as unknown,
        ])

        const iniciadosArr = Array.isArray(iniciadosResp) ? (iniciadosResp as string[]) : []
        const naoCadastradosArr = Array.isArray(naoCadastradosResp) ? (naoCadastradosResp as string[]) : []

        setTransportesIniciados(iniciadosArr)
        setTransportes(naoCadastradosArr)

        // Só avançar se AMBOS forem vazios
        if (iniciadosArr.length === 0 && naoCadastradosArr.length === 0) {
          toast.info("Nenhum transporte pendente ou iniciado encontrado. Avançando para configurações.")
          setTab("configuracoes")
        }
      } else {
        toast.warn("Arquivo de remessas não encontrado.")
        setTab("upload")
      }
    }
    getTransportes()

    return () => {
      effectRan.current = true
    }
  }, [shipments, fetchTransports, setTab])

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transportes Pendentes</CardTitle>
          <CardDescription>
            Aguarde, estamos verificando os transportes na sua planilha...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Card: Transportes com demanda iniciada */}
      {(isLoadingTransportesComDemandaIniciada || transportesIniciados.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Transportes em separação</CardTitle>
            <div className="flex flex-row items-center justify-between">

              <CardDescription>
                Estes transportes já possuem demanda iniciada e estão em processo de separação.
              </CardDescription>
              <Button variant="outline" onClick={() => setTab("upload")}>
                Voltar para Uploads
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingTransportesComDemandaIniciada ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <ScrollArea className="h-56 w-full">
                <div className="space-y-2 p-4">
                  {transportesIniciados.map((transporte: string) => (
                    <div
                      key={transporte}
                      className="flex items-center justify-between rounded-md border p-3 bg-muted/30"
                    >
                      <p className="text-sm font-medium">{transporte}</p>
                      <Badge variant="secondary">Em separação</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Card: Transportes pendentes para cadastro */}
      <Card>
        <CardHeader>
          <CardTitle>Transportes pendentes</CardTitle>
          <div className="flex flex-row items-center justify-between">
            <CardDescription>
              Os seguintes transportes foram encontrados na sua planilha e ainda não foram cadastrados.
            </CardDescription>
            <Button variant="outline" onClick={() => setTab("upload")}>
              Voltar para Uploads
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full">
            <div className="space-y-2 p-4">
              {transportes.map((transporte: string) => (
                <div
                  key={transporte}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <p className="text-sm font-medium">{transporte}</p>
                </div>
              ))}
              {transportes.length === 0 && (
                <div className="text-sm text-muted-foreground p-3 border rounded-md">
                  Nenhum transporte pendente encontrado.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-2">
          <ModaConfirmacaoAddTransporte onSubmit={handleAddTransporte}>
            <Button disabled={isAdding || transportes.length === 0 || transportesIniciados.length > 0}>
              {isAdding ? "Adicionando..." : "Adicionar Transporte"}
            </Button>
          </ModaConfirmacaoAddTransporte>
          {transportesIniciados.length > 0 && (
            <p className="text-xs text-muted-foreground">Finalize a separação dos transportes em andamento para adicionar novos.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}