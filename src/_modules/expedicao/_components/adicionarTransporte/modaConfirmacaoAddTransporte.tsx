import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { Input } from "@/_shared/components/ui/input"
import { Label } from "@/_shared/components/ui/label"
import { useState } from "react"

type ModalConfirmacaoAddTransporteProps = {
  children: React.ReactNode
  onSubmit: (dataExpedicao: string) => void
}

export default function ModaConfirmacaoAddTransporte({ children, onSubmit }: ModalConfirmacaoAddTransporteProps) {
  const [open, setOpen] = useState(false)
  const [dataExpedicao, setDataExpedicao] = useState(() => {
    const hoje = new Date()
    return hoje.toISOString().split('T')[0] // Formato YYYY-MM-DD
  })

  const handleSubmit = () => {
    const dataExpedicaoISO = new Date(dataExpedicao).toISOString()
    onSubmit(dataExpedicaoISO)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Transportes</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Os transportes selecionados ainda não existem no banco de dados e serão adicionados automaticamente.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="dataExpedicao">Data de Expedição</Label>
            <Input
              id="dataExpedicao"
              type="date"
              value={dataExpedicao}
              onChange={(e) => setDataExpedicao(e.target.value)}
              className="w-full"
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Deseja continuar com a adição dos transportes?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="default" onClick={handleSubmit}>Confirmar Adição</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}