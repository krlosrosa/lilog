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
import { useBuscarTodosOsCentros } from "@/_services/api/hooks/centro/centro"

type AssociarFuncionarioACentroBody = z.infer<typeof atribuirCentroAFuncionarioBody>

interface AssociarFuncionarioACentroProps {
  children: React.ReactNode;
  funcionario: {
    id: string;
    name: string;
  };
}

export default function AssociarFuncionarioACentro({ 
  children, 
  funcionario 
}: AssociarFuncionarioACentroProps) {
  const { mutate: associarFuncionarioACentro, isPending } = useAtribuirCentroAFuncionario(
    callBackReactQuery({
      successMessage: 'Funcionário associado ao centro com sucesso',
      errorMessage: 'Erro ao associar funcionário ao centro',
    })
  )

  const { data: centros = [], isLoading: isLoadingCentros } = useBuscarTodosOsCentros()

  const onSubmit = (data: AssociarFuncionarioACentroBody) => {
    associarFuncionarioACentro({
      data: data,
    })
  }

  // Formatar centros para o select
  const centrosOptions = centros.map(centro => ({
    value: centro.centerId,
    label: `${centro.description} (${centro.centerId})`
  }))

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Associar Funcionário ao Centro
          </DialogTitle>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Vincule este funcionário a um centro de distribuição:
            </p>
            <div className="rounded-lg border p-3 space-y-1">
              <p className="text-sm font-medium">{funcionario.name}</p>
              <p className="text-xs text-muted-foreground font-mono">ID: {funcionario.id}</p>
            </div>
          </div>
        </DialogHeader>
        <Form 
          formOptions={{ 
            defaultValues: { 
              userId: funcionario.id,
              role: 'USER' 
            } 
          }} 
          schema={atribuirCentroAFuncionarioBody} 
          onSubmit={onSubmit}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <FormSelectInput
              className="w-full"
                name="centerId"
                label="Centro de Distribuição"
                placeholder={isLoadingCentros ? "Carregando centros..." : "Selecione o centro"}
                options={centrosOptions}
                disabled={isLoadingCentros}
              />
              <FormInput 
                name="userId" 
                label="ID do Funcionário" 
                placeholder="ID do funcionário"
                disabled
                className="bg-muted"
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