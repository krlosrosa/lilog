'use client'
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/_shared/components/ui/dialog";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { getListarFuncionariosPorCentroQueryKey, useCriarNovoFuncionario } from "@/_services/api/hooks/usuario/usuario";
import { criarNovoFuncionarioBody } from "@/_services/api/schema/usuario/usuario.zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { useState } from "react";
import { FormSelectInput, SelectOption } from "@/_shared/components/hookForms/FormSelectInput";

const turnos: SelectOption[] = [
  { value: 'MANHA', label: 'Manhã' },
  { value: 'TARDE', label: 'Tarde' },
  { value: 'NOITE', label: 'Noite' },
]

const empresa: SelectOption[] = [
  { value: 'LDB', label: 'Lactalis' },
  { value: 'ITB', label: 'Itambé' },
  { value: 'DPA', label: 'DPA' },
]


type AddFuncionarioBody = z.infer<typeof criarNovoFuncionarioBody>;

export function AddFuncionario({ children }: { children: React.ReactNode }) {
  const { centerId } = useAuthStore()
  const [open, setOpen] = useState(false)

  const methods = useForm<AddFuncionarioBody>({
    resolver: zodResolver(criarNovoFuncionarioBody),
    defaultValues: {
      centerId: centerId || '',
      role: 'FUNCIONARIO',
    }
  })


  const queryKeysInvalidate = getListarFuncionariosPorCentroQueryKey(centerId)


  const { mutate: addFuncionario, isPending } = useCriarNovoFuncionario(callBackReactQuery({
    successMessage: 'Funcionário adicionado com sucesso!',
    errorMessage: 'Erro ao adicionar funcionário',
    invalidateQueries: queryKeysInvalidate,
    onSuccessCallback: () => {
      setOpen(false)
    }
  }))


  const onSubmit = (data: AddFuncionarioBody) => {
    addFuncionario({
      data: {
        ...data,
        centerId
      },
    })
  }
  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="" asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
            <DialogDescription>
              Adicione um funcionário.
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormInput name="id" label="ID" type="string" />
                <FormInput name="nome" label="Nome" type="string" />
                <FormSelectInput
                  className="w-full"
                  name="turno"
                  label="Turno"
                  options={turnos}
                />
                <FormSelectInput
                  className="w-full"
                  name="empresa"
                  label="Empresa"
                  options={empresa}
                />
              </div>
              <div className="flex flex-col justify-end gap-2 mt-4">

                <Button className="w-full" type="submit" disabled={isPending}>{isPending ? 'Adicionando...' : 'Adicionar Funcionário'}</Button>
                <Button className="w-full" variant="outline" disabled={isPending}>Cancel</Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}