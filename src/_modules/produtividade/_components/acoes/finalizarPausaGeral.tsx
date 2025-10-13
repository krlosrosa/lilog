'use client'
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useProdutividadeControllerFinalizarPausaGeral } from "@/_services/api/hooks/produtividade/produtividade"
import { produtividadeControllerFinalizarPausaGeralBody } from "@/_services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { Form } from "@/_shared/components/hookForms/Form";
import { useDefinicaoStore } from "@/_modules/produtividade/stores/definicao.store";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useState } from "react";
import { FormSelectInput, SelectOption } from "@/_shared/components/hookForms/FormSelectInput";

type FinalizarPausaGeralBody = z.infer<typeof produtividadeControllerFinalizarPausaGeralBody>;

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


export function FinalizarPausaGeral({ processo }: { processo: string | null }) {
  const { centerId } = useAuthStore()

  const { mutate: finalizarPausaGeral, isPending } = useProdutividadeControllerFinalizarPausaGeral(callBackReactQuery({
    successMessage: 'Pausa Geral Finalizada com sucesso',
    errorMessage: 'Erro ao finalizar Pausa Geral',
  }))
  const onSubmit = (data: FinalizarPausaGeralBody) => {
    finalizarPausaGeral({ data: data });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">Finalizar Pausa Geral</Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          schema={produtividadeControllerFinalizarPausaGeralBody}
          onSubmit={onSubmit}
          formOptions={{
            defaultValues: {
                centerId: centerId || '',
                processo: processo || '',
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Finalizar Pausa Geral</DialogTitle>
            <DialogDescription>
              Finalize a pausa geral.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
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
          </div>
          <DialogFooter className="mt-4">
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
  )
}