'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { getListarFuncionariosPorCentroQueryKey, useDeletarUsuario } from "@/_services/api/hooks/usuario/usuario"
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { AlertTriangle } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

interface RemoverFuncionarioCentroProps {
  children: React.ReactNode;
  userId: string;
  userName: string;
}

export default function RemoverFuncionarioCentro({ 
  children, 
  userId, 
  userName 
}: RemoverFuncionarioCentroProps) {


  const queryClient = useQueryClient()
  const queryKeys = getListarFuncionariosPorCentroQueryKey()

  const { mutate: removerFuncionarioCentro, isPending } = useDeletarUsuario(callBackReactQuery({
    successMessage: 'Funcionário removido com sucesso',
    errorMessage: 'Erro ao remover funcionário',
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys })
    },
    invalidateQueries: queryKeys,
  }))

  const { centerId } = useAuthStore()

  const handleRemoverFuncionarioCentro = () => {
    removerFuncionarioCentro({
      userId: userId,
      centerId: centerId || '',
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Remover Funcionário
          </DialogTitle>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja remover este funcionário do centro?
            </p>
          <pre>{JSON.stringify('carlos', null, 2)}</pre>
            <div className="rounded-lg border p-3 space-y-2">
              <div>
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground font-mono">ID: {userId}</p>
              </div>
            </div>
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Esta ação não pode ser desfeita
              </p>
              <p className="text-xs text-destructive/80 mt-1">
                O funcionário será removido permanentemente do centro.
              </p>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleRemoverFuncionarioCentro}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? 'Removendo...' : 'Confirmar Remoção'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}