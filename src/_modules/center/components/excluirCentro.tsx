import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useDeletarCentro } from "@/_services/api/hooks/centro/centro"
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery"
import { useState } from "react"

type Centro = {
  centerId: string
  description: string
  state: string
  cluster: 'DISTRIBUICAO' | 'CROSS' | 'CDFABRICA'
}

type ExcluirCentroProps = {
  centro: Centro
  children: React.ReactNode
}

export default function ExcluirCentro({ centro, children }: ExcluirCentroProps) {
  
  const [open, setOpen] = useState(false)

  const { mutate: excluirCentro, isPending } = useDeletarCentro(
    callBackReactQuery({
      successMessage: 'Centro excluído com sucesso!',
      errorMessage: 'Erro ao excluir centro',
    })
  )

  function handleExcluirCentro() {
    excluirCentro({
      centerId: centro.centerId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Excluir Centro
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir este centro? Esta ação não pode ser desfeita.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800">
                  {centro.centerId}
                </p>
                <p className="text-xs text-red-600">
                  {centro.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                    {centro.state}
                  </span>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                    {centro.cluster}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" disabled={isPending} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleExcluirCentro}
            disabled={isPending}
          >
            {isPending ? "Excluindo..." : "Excluir Centro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}