'use client'
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/_shared/components/ui/dialog";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useCriarNovoFuncionario } from "@/_services/api/hooks/usuario/usuario";
import { criarNovoFuncionarioBody } from "@/_services/api/schema/usuario/usuario.zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { useState } from "react";

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

  const { mutate: addFuncionario } = useCriarNovoFuncionario(callBackReactQuery({
    successMessage: 'Funcionário adicionado com sucesso!',
    errorMessage: 'Erro ao adicionar funcionário',    
    onSuccessCallback: () => {
      setOpen(false)
    }
  }))


  const onSubmit = (data: AddFuncionarioBody) => {
    addFuncionario({
      data: data,
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
                <FormInput name="turno" label="Turno" type="string" />
              </div>
              <Button type="submit">Save changes</Button>
            </form>
          </FormProvider>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}