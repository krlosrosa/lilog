// Seu componente AddPausa refatorado

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { useProdutividadeControllerAddPausaIndividual } from "@/_services/api/hooks/produtividade/produtividade";
import { produtividadeControllerAddPausaIndividualBody } from "@/_services/api/schema/produtividade/produtividade.zod";
import { useState } from "react";
import z from "zod";
import { Form } from "@/_shared/components/hookForms/Form";
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { FormSelectInput, SelectOption } from "@/_shared/components/hookForms/FormSelectInput";
import { FormTextAreaInput } from "@/_shared/components/hookForms/FormTextAreaInput";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";

type AddPausaIndividualBody = z.infer<typeof produtividadeControllerAddPausaIndividualBody>;

const motivosPausasIndividual: SelectOption[] = [
  { value: 'FALTA_PRODUTO', label: 'Falta de Produto' },
  { value: 'PAUSA_TERMICA', label: 'Pausa Térmica' },
  { value: 'HORARIO_REFEICAO', label: 'Horário de Refeição' },
  { value: 'TREINAMENTO_FEEDBACK', label: 'Treinamento / Feedback' },
]

export function AddPausaIndividual() {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: addPausa, isPending } = useProdutividadeControllerAddPausaIndividual(
    callBackReactQuery({
      successMessage: 'Pausa adicionada com sucesso',
      errorMessage: 'Erro ao adicionar pausa',
    })
  );

  const handleAddPausa = (data: AddPausaIndividualBody) => {
    addPausa({ data });
  };

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">Pausa Individual</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Pausa</DialogTitle>
            <DialogDescription>
              Adicione uma pausa ao pallet selecionado.
            </DialogDescription>
          </DialogHeader>
          <Form
            schema={produtividadeControllerAddPausaIndividualBody}
            onSubmit={handleAddPausa}
          >
            <div className="grid gap-4 py-4">
              <FormInput name="paleteId" label="Palete ID" type="string" disabled={isPending} />
              <FormSelectInput className="w-full" name="motivo" label="Motivo" options={motivosPausasIndividual} disabled={isPending} />
              <FormTextAreaInput name="descricao" label="Descrição" disabled={isPending} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}