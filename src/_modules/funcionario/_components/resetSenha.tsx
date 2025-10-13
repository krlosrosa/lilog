'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { Form } from "@/_shared/components/hookForms/Form";
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { Button } from "@/_shared/components/ui/button";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { useResetSenha } from "@/_services/api/hooks/usuario/usuario";
import { z } from "zod";

const resetSenhaSchema = z.object({
  novaSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(6, 'A confirmação da senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type ResetSenhaFormData = z.infer<typeof resetSenhaSchema>;

interface ResetSenhaProps {
  children: React.ReactNode;
  userId: string;
  userName: string;
}

export default function ResetSenha({ children, userId, userName }: ResetSenhaProps) {
  const { mutate: resetSenha, isPending } = useResetSenha(callBackReactQuery({
    successMessage: 'Senha resetada com sucesso',
    errorMessage: 'Erro ao resetar senha',
  }))

  const handleSubmit = (data: ResetSenhaFormData) => {
    const senha = JSON.stringify(data.novaSenha)
    resetSenha({
      userId: userId,
      password: data.novaSenha
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resetar Senha</DialogTitle>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Redefinir senha para:
            </p>
            <div className="space-y-1">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground font-mono">ID: {userId}</p>
            </div>
          </div>
        </DialogHeader>
        <Form
          schema={resetSenhaSchema}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <FormInput
            name="novaSenha"
            label="Nova Senha"
            placeholder="Digite a nova senha"
            defaultValue="inicial01"
            required
          />
          <FormInput
            name="confirmarSenha"
            label="Confirmar Senha"
            placeholder="Confirme a nova senha"
            defaultValue="inicial01"
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Resetando...' : 'Resetar Senha'}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}