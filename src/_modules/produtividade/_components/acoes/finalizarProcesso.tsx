'use client'
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { useProdutividadeControllerFinalizarPicking } from "@/_services/api/hooks/produtividade/produtividade"
import { produtividadeControllerFinalizarPickingBody } from "@/_services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { FormTextAreaInput } from "@/_shared/components/hookForms/FormTextAreaInput";
import { Form } from "@/_shared/components/hookForms/Form";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { useState } from "react";


const mergeFinalizarProdutividadeBody = produtividadeControllerFinalizarPickingBody.extend({
  palletId: z.string(),
})

type FinalizarProdutividadeBody = z.infer<typeof mergeFinalizarProdutividadeBody>;

export function FinalizarProdutividade() {

  const [open, setOpen] = useState(false)

  const { mutate: finalizarProdutividade, isPending } = useProdutividadeControllerFinalizarPicking(callBackReactQuery({
    successMessage: 'Produtividade finalizada com sucesso!',
    errorMessage: 'Erro ao finalizar produtividade',
    invalidateQueries: ["GetOverView"],
    onSuccessCallback: () => {
      setOpen(false)
    }
  }))

  const onSubmit = (data: FinalizarProdutividadeBody) => {
    finalizarProdutividade({
      data: { observacao: data.observacao },
      palletId: data.palletId
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Finalizar Produtividade</Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          schema={mergeFinalizarProdutividadeBody}
          onSubmit={onSubmit}
          
        >
          <DialogHeader>
            <DialogTitle>Finalizar Produtividade</DialogTitle>
            <DialogDescription>
              Finalize a produtividade da pallet selecionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormInput name="palletId" label="Pallet ID" type="string" />
            <FormTextAreaInput name="observacao" label="Observação" />
          </div>
          <DialogFooter className="gap-2 mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Finalizando...' : 'Finalizar'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 