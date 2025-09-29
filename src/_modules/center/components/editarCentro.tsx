import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery"
import { useEditarCentro } from "@/_services/api/hooks/centro/centro"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { editarCentroBody } from "@/_services/api/schema/centro/centro.zod"
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput"
import { FormSelectInput } from "@/_shared/components/hookForms/FormSelectInput"
import { Form } from "@/_shared/components/hookForms/Form"
import { Edit } from "lucide-react"

type EditarCentroBody = z.infer<typeof editarCentroBody>

type Centro = {
  centerId: string
  description: string
  state: string
  cluster: 'DISTRIBUICAO' | 'CROSS' | 'CDFABRICA'
}

const clusterOptions = [
  { value: "DISTRIBUICAO", label: "Distribuição" },
  { value: "CROSS", label: "Cross" },
  { value: "CDFABRICA", label: "CD Fábrica" },
]

const stateOptions = [
  { value: "ATIVO", label: "Ativo" },
  { value: "INATIVO", label: "Inativo" },
]

type EditarCentroProps = {
  centro: Centro
  children: React.ReactNode
}

export default function EditarCentro({ centro, children }: EditarCentroProps) {
  const { mutate: editarCentro, isPending } = useEditarCentro(
    callBackReactQuery({
      successMessage: 'Centro editado com sucesso!',
      errorMessage: 'Erro ao editar centro',
    })
  )

  function handleEditCenter(data: EditarCentroBody) {
    editarCentro({
      centerId: centro.centerId,
      data: data,
    })
  }

  const defaultValues: EditarCentroBody = {
    centerId: centro.centerId,
    description: centro.description,
    state: centro.state,
    cluster: centro.cluster,
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Centro</DialogTitle>
        </DialogHeader>
        
        <Form schema={editarCentroBody} onSubmit={handleEditCenter} formOptions={{ defaultValues }}>
          <div className="space-y-4 py-4">
            <FormInput 
              name="centerId" 
              label="ID do Centro" 
              placeholder="Digite o ID do centro"
              disabled
            />
            
            <FormInput 
              name="description" 
              label="Descrição" 
              placeholder="Digite a descrição do centro"
            />
            
            <FormSelectInput
              name="state"
              label="Estado"
              placeholder="Selecione o estado"
              options={stateOptions}
            />
            
            <FormSelectInput
              name="cluster"
              label="Cluster"
              placeholder="Selecione o cluster"
              options={clusterOptions}
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}