'use client'
import { useAuthStore } from "@/_shared/stores/auth.store"
import { useCriarFuncionarioAdm } from "@/_services/api/hooks/usuario/usuario"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/_shared/components/ui/dialog";
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { FormSelectInput } from "@/_shared/components/hookForms/FormSelectInput";
import z from "zod";

// Schema local com validação de turno
const addFuncionarioAdmSchema = z.object({
  centerId: z.string(),
  id: z.string(),
  nome: z.string(),
  primeiroNome: z.string(),
  ultimoNome: z.string(),
  credencial: z.string(),
  turno: z.enum(['MANHA', 'TARDE', 'NOITE'])
});
import { Button } from "@/_shared/components/ui/button";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { Form } from "@/_shared/components/hookForms/Form";
import { FormStateLogger } from "@/_shared/components/hookForms/formState.errors";
import { UserPlus } from "lucide-react";

type AddFuncionarioAdmBody = z.infer<typeof addFuncionarioAdmSchema>;

export function AddFuncionarioAdm() {
  const {mutate: addFuncionarioAdm, isPending} = useCriarFuncionarioAdm( callBackReactQuery({
    successMessage: 'Funcionário Adm adicionado com sucesso!',
    errorMessage: 'Erro ao adicionar funcionário Adm',
  }))
  const { centerId } = useAuthStore()

  const onSubmit = (data: AddFuncionarioAdmBody) => {
    addFuncionarioAdm({
      data: data,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        >
          <UserPlus className="h-6 w-6" />
          <span className="sr-only">Adicionar usuário</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Funcionário Adm
          </DialogTitle>
        </DialogHeader>
        <Form formOptions={{
          defaultValues: {
            centerId: centerId || '',
            credencial: 'inicial01',
          }
        }} schema={addFuncionarioAdmSchema} onSubmit={onSubmit}>
          <div className="grid gap-4">
            <FormInput name="id" label="ID" type="string" />
            <FormInput name="nome" label="Nome Completo" type="string" placeholder="Digite o nome completo" />
            <FormInput name="primeiroNome" label="Primeiro Nome" type="string" />
            <FormInput name="ultimoNome" label="Último Nome" type="string" />
            <FormInput name="credencial" label="Credencial" type="string" />
            <FormSelectInput 
              name="turno" 
              label="Turno" 
              placeholder="Selecione o turno"
              options={[
                { value: 'MANHA', label: 'Manhã' },
                { value: 'TARDE', label: 'Tarde' },
                { value: 'NOITE', label: 'Noite' }
              ]}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Adicionando...' : 'Adicionar Funcionário'}
            </Button>
          </div>
          <FormStateLogger />
        </Form>
      </DialogContent>
    </Dialog>
  )
}