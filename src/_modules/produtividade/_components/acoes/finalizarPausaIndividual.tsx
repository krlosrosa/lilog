'use client'
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useProdutividadeControllerFinalizarPausaIndividual } from "@/_services/api/hooks/produtividade/produtividade"
import { produtividadeControllerFinalizarPausaIndividualParams } from "@/_services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { Form } from "@/_shared/components/hookForms/Form";

type FinalizarPausaIndividualBody = z.infer<typeof produtividadeControllerFinalizarPausaIndividualParams>;

export function FinalizarPausaIndividual() {
  const methods = useForm<FinalizarPausaIndividualBody>({
    resolver: zodResolver(produtividadeControllerFinalizarPausaIndividualParams),
  });
  const { mutate: finalizarPausa, isPending } = useProdutividadeControllerFinalizarPausaIndividual(callBackReactQuery({
    successMessage: 'Pausa Finalizada com sucesso',
    errorMessage: 'Erro ao finalizar Pausa',
  }))

  const onSubmit = (data: FinalizarPausaIndividualBody) => {
    finalizarPausa(data);
  }
  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger className="w-full " asChild>
          <Button className="w-full" variant="outline">Finalizar Pausa</Button>
        </DialogTrigger>
        <DialogContent>
          <Form
            schema={produtividadeControllerFinalizarPausaIndividualParams}
            onSubmit={onSubmit}
          >
              <DialogHeader>
                <DialogTitle>Finalizar Pausa</DialogTitle>
                <DialogDescription>
                  Finalize a pausa do pallet selecionado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <FormInput name="palletId" label="Pallet ID" type="string" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Finalizando...' : 'Finalizar'}
                </Button>
              </DialogFooter>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}