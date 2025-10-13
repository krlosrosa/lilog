'use client'

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { useDeletarDemanda } from "@/_services/api/hooks/produtividade/produtividade"
import { AlertTriangle } from "lucide-react"
import { toast } from "react-toastify"
import { Input } from "@/_shared/components/ui/input"
import { Label } from "@/_shared/components/ui/label"
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery"

export function DeletarDemanda() {
  const [open, setOpen] = useState(false)
  const [palletId, setPalletId] = useState("")

  const { mutate: deletarDemanda, isPending } = useDeletarDemanda(
    callBackReactQuery({
      successMessage: "Demanda deletada com sucesso.",
      errorMessage: "Não foi possível deletar a demanda. Tente novamente.",
      onSuccessCallback: () => {
        setOpen(false)
      }
    })
  )

  const handleConfirm = () => {
    if (!palletId || palletId.trim().length === 0) {
      toast.warn("ID da demanda não informado.")
      return
    }
    deletarDemanda({ palletId })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">Deletar Demanda</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Deletar Demanda
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Esta ação não pode ser desfeita. Confirme para remover permanentemente a demanda selecionada.
          </p>
          <div className="mt-4 space-y-2">
            <Label htmlFor="palletId" className="text-xs">ID da Demanda</Label>
            <Input
              id="palletId"
              placeholder="Digite o ID da demanda (palletId)"
              value={palletId}
              onChange={(e) => setPalletId(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending || palletId.trim().length === 0} className="flex-1">
            {isPending ? 'Deletando...' : 'Confirmar exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}