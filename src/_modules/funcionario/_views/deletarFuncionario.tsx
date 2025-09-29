'use client'
import { Button } from "@/_shared/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/_shared/components/ui/dialog"
import { useDeletarUsuario } from "@/_services/api/hooks/usuario/usuario"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery"

type Props = {
  children: React.ReactNode
  funcionarioId: string
}

export function DeletarFuncionario({ children, funcionarioId }: Props) {
  const { centerId } = useAuthStore()

  const { mutate: deletarFuncionario } = useDeletarUsuario(
    callBackReactQuery({
      successMessage: 'Pausa Geral adicionada com sucesso',
      errorMessage: 'Erro ao adicionar Pausa Geral',
    })
  )

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deletarFuncionario({
      userId: funcionarioId,
      centerId: centerId || ''
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Deletar Funcionário
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm leading-relaxed">
              Tem certeza de que deseja deletar este funcionário? Esta ação não pode ser desfeita e todos os dados relacionados serão permanentemente removidos.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Atenção!</p>
                <p className="mt-1">Esta operação é irreversível e pode afetar:</p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
                  <li>Histórico de produtividade</li>
                  <li>Registros de atividades</li>
                  <li>Dados de performance</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              variant="destructive"
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar Funcionário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}