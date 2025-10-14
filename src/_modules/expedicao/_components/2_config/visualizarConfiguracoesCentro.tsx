import { useBuscarConfiguracoesImpressao } from "@/_services/api/hooks/centro/centro"
import { useAuthStore } from "@/_shared/stores/auth.store"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/_shared/components/ui/accordion"
import { Skeleton } from "@/_shared/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/_shared/components/ui/alert"

export default function VisualizarConfiguracoesCentro() {
  const { centerId, user } = useAuthStore()
  const {
    data: config,
    isLoading,
    isError,
  } = useBuscarConfiguracoesImpressao(centerId as string, user?.empresa as string, {
    query: {
      queryKey: ["configuracoes-centro", centerId],
      enabled: !!centerId && !!user,
    },
  })

  if (isLoading) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-4">
        <Skeleton className="h-6 w-3/4" />
      </div>
    )
  }

  if (isError || !config) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as configurações do centro.
        </AlertDescription>
      </Alert>
    )
  }

  const translations: Record<string, string> = {
    tipoImpressao: "Tipo de Impressão",
    tipoQuebra: "Tipo de Quebra",
    quebraPalete: "Quebra de Palete",
    valorQuebra: "Valor da Quebra",
    separarPaleteFull: "Separar Palete Full",
    separarUnidades: "Separar Unidades",
    exibirInfoCabecalho: "Exibir Info no Cabeçalho",
    segregarFifo: "Segregar por FIFO",
    dataMaximaPercentual: "Percentual de Data Máxima",
  }

  const excludedKeys = ["createdAt", "updatedAt", "centerId", "atribuidoPorId"]

  const formatValue = (key: string, value: any) => {
    if (typeof value === "boolean") {
      return value ? "Sim" : "Não"
    }
    if (value === null || value === undefined) {
      return "Não definido"
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Nenhum"
    }
    return String(value)
  }

  const filteredConfig = Object.entries(config).filter(
    ([key]) => !excludedKeys.includes(key)
  )

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Visualizar Configurações Atuais do Centro
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 gap-4 p-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredConfig.map(([key, value]) => (
              <div key={key} className="rounded-lg border bg-accent p-3">
                <div className="text-sm text-accent-foreground/80">
                  {translations[key] || key}
                </div>
                <div className="font-semibold text-accent-foreground">
                  {formatValue(key, value)}
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}