// Crie um novo arquivo, por exemplo: /components/FormStateLogger.tsx

'use client';
import { useFormErrors } from '@/_shared/hooks/useFormErrors';  // ✅ importando a função 

export const FormStateLogger = () => {
  const errors = useFormErrors();

  if (!errors) {
    return null; // Não mostra nada se não houver erros
  }

  return (
    <div className="mt-5 rounded-md border border-red-300 bg-red-50 p-2.5 font-mono">
      <h3 className="m-0 mb-2.5 text-red-700 ">
        ❌ Erros de Validação do Formulário
      </h3>
      <pre className="whitespace-pre-wrap">{JSON.stringify(errors, null, 2)}</pre>
    </div>
  );
};