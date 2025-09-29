'use client'
import { z } from "zod"
import { useProdutividadeControllerAddPausaGeral } from "@/_services/api/hooks/produtividade/produtividade"
import { produtividadeControllerAddPausaGeralBody } from "@/_services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { FormSelectInput, SelectOption } from "@/_shared/components/hookForms/FormSelectInput";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { Form } from "@/_shared/components/hookForms/Form";
import { useFormContext } from "react-hook-form";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useState } from "react";

type AddPausaGeralBody = z.infer<typeof produtividadeControllerAddPausaGeralBody>;

const motivosBase: SelectOption[] = [
  { value: 'PAUSA_TERMICA', label: 'Pausa Térmica' },
  { value: 'HORARIO_REFEICAO', label: 'Horário de Refeição' },
  { value: 'TREINAMENTO_FEEDBACK', label: 'Treinamento / Feedback' },
]

const segmentos: SelectOption[] = [
  { value: 'SECA', label: 'Seco' },
  { value: 'REFR', label: 'Refrigerado' },
  { value: 'QUEIJO', label: 'Queijo' },
]

const turnos: SelectOption[] = [
  { value: 'MANHA', label: 'Manhã' },
  { value: 'TARDE', label: 'Tarde' },
  { value: 'NOITE', label: 'Noite' },
]



export function AddPausaGeral({ processo }: { processo: string | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const { centerId } = useAuthStore()
  const { mutate: addPausaGeral, isPending } = useProdutividadeControllerAddPausaGeral(callBackReactQuery({
    successMessage: 'Pausa Geral adicionada com sucesso',
    errorMessage: 'Erro ao adicionar Pausa Geral',
  }))
  const onSubmit = (data: AddPausaGeralBody) => {
    addPausaGeral({ data: data });
  }

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full" asChild>
          <Button className="w-full" variant="outline">Pausa Geral</Button>
        </DialogTrigger>
        <DialogContent>
          <Form
            schema={produtividadeControllerAddPausaGeralBody}
            onSubmit={onSubmit}
            formOptions={{
              defaultValues: {
                centerId: centerId || '',
                processo: processo || '',
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Adicionar Pausa Geral</DialogTitle>
              <DialogDescription>
                Adicione uma pausa geral.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 w-full">
              <FormSelectInput
                className="w-full"
                name="segmento"
                label="Segmento"
                options={segmentos}
              />
              <FormSelectInput
                className="w-full"
                name="turno"
                label="Turno"
                options={turnos}
              />
              <FormSelectInput
                className="w-full"
                name="motivo"
                label="Motivo"
                options={motivosBase}
              />
            </div>

            <div className="flex flex-col justify-end w-full gap-2 mt-16">
              <Button className="w-full" type="submit" disabled={isPending}>{isPending ? 'Salvando...' : 'Salvar'}</Button>
              <Button className="w-full" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}