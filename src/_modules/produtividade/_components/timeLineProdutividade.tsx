'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { useBuscarInfoQuery } from "@/_services/graphql/produtividade/infoInfodemanda.graphql"
import TimelineDemanda from "./timeLineDemanda"

interface TimelineDemandaModalProps {
  paleteId: string
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}

export default function TimelineDemandaModal({
  paleteId,
  children,
  open,
  setOpen
}: TimelineDemandaModalProps) {

  const { data, isLoading, isError, refetch } = useBuscarInfoQuery({
    input: paleteId
  }, {
    enabled: open,
  })

  const handleRefresh = () => {
    refetch()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-3/4 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle>Histórico da Demanda</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {isLoading && !data && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Carregando informações da demanda...</p>
              </div>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <div className="text-destructive">⚠️</div>
                <p className="text-destructive font-medium">Erro ao carregar informações da demanda</p>
                <p className="text-muted-foreground text-sm">Tente novamente mais tarde</p>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}

          {data?.infoDemanda && (
            <TimelineDemanda infoDemanda={data.infoDemanda} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
