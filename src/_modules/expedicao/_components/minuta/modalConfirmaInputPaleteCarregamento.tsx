'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/_shared/components/ui/alert"
import { Terminal } from "lucide-react"
import { useState } from "react"

type ModalConfirmaInputPaleteCarregamentoProps = {
  disabled: boolean
  onSubmit: () => void
  children: React.ReactNode
}

export default function ModalConfirmaInputPaleteCarregamento({  
  disabled,
  onSubmit,
  children,
}: ModalConfirmaInputPaleteCarregamentoProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onSubmit()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Geração de Paletes</DialogTitle>
          <DialogDescription>
            Você está prestes a registrar os paletes gerados no sistema. Por
            favor, revise a informação abaixo antes de continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Se algum dos transportes já tiver sido impresso anteriormente,
              todos os dados existentes no banco serão **excluídos** e
              substituídos por esta nova geração.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirmar e Substituir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}