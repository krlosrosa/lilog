import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { useAtribuirCentroAFuncionario } from "@/_services/api/hooks/usuario/usuario"
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery"
import { atribuirCentroAFuncionarioBody } from "@/_services/api/schema/usuario/usuario.zod"
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput"
import { FormSelectInput } from "@/_shared/components/hookForms/FormSelectInput"
import { Form } from "@/_shared/components/hookForms/Form"
import { Users, Building2 } from "lucide-react"

type AssociarFuncionarioACentroBody = z.infer<typeof atribuirCentroAFuncionarioBody>

export default function AssociarFuncionarioACentro() {
  const { mutate: associarFuncionarioACentro, isPending } = useAtribuirCentroAFuncionario(
    callBackReactQuery({
      successMessage: 'Funcionário associado ao centro com sucesso',
      errorMessage: 'Erro ao associar funcionário ao centro',
    })
  )

  const onSubmit = (data: AssociarFuncionarioACentroBody) => {
    associarFuncionarioACentro({
      data: data,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Users className="mr-2 h-4 w-4" />
          Associar Funcionário ao Centro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Associar Funcionário ao Centro
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Vincule um funcionário existente a um centro de distribuição
          </p>
        </DialogHeader>
        <Form 
          formOptions={{ 
            defaultValues: { 
              role: 'USER' 
            } 
          }} 
          schema={atribuirCentroAFuncionarioBody} 
          onSubmit={onSubmit}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <FormInput 
                name="centerId" 
                label="ID do Centro" 
                placeholder="Digite o ID do centro"
                required
              />
              <FormInput 
                name="userId" 
                label="ID do Funcionário" 
                placeholder="Digite o ID do funcionário"
                required
              />
              <FormSelectInput
                name="role"
                label="Função no Centro"
                placeholder="Selecione a função"
                options={[
                  { value: 'USER', label: 'Usuário' },
                  { value: 'FUNCIONARIO', label: 'Funcionário' },
                  { value: 'ADMIN', label: 'Administrador' },
                  { value: 'MASTER', label: 'Master' }
                ]}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Associando...' : 'Associar Funcionário'}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}