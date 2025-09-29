'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon, Plus } from "lucide-react";
import { AddPalete } from "./addPalete";
import { usePaletes } from "@/_modules/produtividade/hooks/usePalete";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/_shared/components/ui/tabs";
import { AddFuncionarioDemandas } from "./addFuncionario";
import { ListarFuncionariosPorCentroZodDtoOutput } from "@/_services/api/model";
import { useIniciarDemandaProdutividade } from "@/_services/api/hooks/produtividade/produtividade";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { useAuthStore } from "@/_shared/stores/auth.store";
type Funcionario = ListarFuncionariosPorCentroZodDtoOutput[number]

export function StartProdutividade() {
  const { centerId } = useAuthStore();
  const { paletes, add, remove, clear } = usePaletes();
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);
  const [observacao, setObservacao] = useState('');
  const [tab, setTab] = useState<'paletes' | 'funcionario'>('paletes');
  const { mutate: iniciarDemandaProdutividade, isPending } = useIniciarDemandaProdutividade(
    callBackReactQuery({
      successMessage: "Demanda iniciada com sucesso.",
      errorMessage: "Não foi possível iniciar a demanda. Tente novamente.",
    })
  )

  const handleIniciarDemandaProdutividade = () => {
    iniciarDemandaProdutividade({
      centerId: centerId,
      data: {
        centerId,
        inicio: new Date().toISOString(),
        processo: 'picking',
        funcionarioId: funcionarioSelecionado?.id ?? '',
        paletesIds: paletes.map(palete => palete),
        turno: funcionarioSelecionado?.turno ?? '',
        obs: observacao,
      }
    })
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            disabled={isPending}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            aria-label="Criar nova demanda"
          >          
          <Plus className="h-16 w-16" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-6xl min-h-10/12 items-start">
        <DialogHeader className="p-0">
          <div className="flex items-center justify-between">

            <div>
              <DialogTitle>Iniciar Produtividade</DialogTitle>
              <p>
                Selecione o processo que você deseja iniciar.
              </p>
            </div>
            <div className="mr-8">
              {tab === 'funcionario' ? (
                <Button variant="outline" onClick={() => setTab('paletes')}>
                  <ArrowLeftIcon />
                  Voltar
                </Button>
              ) : (
                <Button variant="outline" disabled={paletes.length === 0} onClick={() => setTab('funcionario')}>
                  <ArrowRightIcon />
                  Próximo
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        <Tabs value={tab} defaultValue="paletes">
          <TabsList hidden>
            <TabsTrigger value="paletes">Paletes</TabsTrigger>
            <TabsTrigger value="funcionario">Funcionário</TabsTrigger>
          </TabsList>
          <TabsContent value="paletes">
            <AddPalete paletes={paletes} add={add} remove={remove} setTab={setTab} />
          </TabsContent>
          <TabsContent value="funcionario">
            <AddFuncionarioDemandas 
            funcionarioSelecionado={funcionarioSelecionado} 
            setFuncionarioSelecionado={setFuncionarioSelecionado} 
            iniciarDemandaProdutividade={handleIniciarDemandaProdutividade}
            observacao={observacao}
            isPending={isPending}
            setObservacao={setObservacao}
             />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}