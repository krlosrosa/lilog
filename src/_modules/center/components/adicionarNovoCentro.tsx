import { Form } from "@/_shared/components/hookForms/Form";
import { useCriarNovoCentro } from "@/_services/api/hooks/centro/centro";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { criarNovoCentroBody } from "@/_services/api/schema/centro/centro.zod";
import { z } from "zod";
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { FormSelectInput } from "@/_shared/components/hookForms/FormSelectInput";
import { Plus } from "lucide-react";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { useState } from "react";

type AdicionarNovoCentroBody = z.infer<typeof criarNovoCentroBody>;

const clusterOptions = [
  { value: "DISTRIBUICAO", label: "Distribuição" },
  { value: "CROSS", label: "Cross" },
  { value: "CDFABRICA", label: "CD Fábrica" },
];

const stateOptions = [
  { value: "ATIVO", label: "Ativo" },
  { value: "INATIVO", label: "Inativo" },
];

export default function AdicionarNovoCentro() {
  const [open, setOpen] = useState(false)
  const { mutate: criarNovoCentro, isPending } = useCriarNovoCentro(
    callBackReactQuery({
      successMessage: 'Centro adicionado com sucesso!',
      errorMessage: 'Erro ao adicionar centro',
    })
  );
  
  function handleAddNovoCentro(data: AdicionarNovoCentroBody) {
    criarNovoCentro({
      data: data,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Centro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Novo Centro</DialogTitle>
        </DialogHeader>
        
        <Form schema={criarNovoCentroBody} onSubmit={handleAddNovoCentro}>
          <div className="space-y-4 py-4">
            <FormInput 
              name="centerId" 
              label="ID do Centro" 
              placeholder="Digite o ID do centro"
            />
            
            <FormInput 
              name="description" 
              label="Descrição" 
              placeholder="Digite a descrição do centro"
            />
            
            <FormSelectInput
              className="w-full"
              name="state"
              label="Estado"
              placeholder="Selecione o estado"
              options={stateOptions}
            />
            
            <FormSelectInput
              className="w-full"
              name="cluster"
              label="Cluster"
              placeholder="Selecione o cluster"
              options={clusterOptions}
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button onClick={()=> setOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adicionando..." : "Adicionar Centro"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}