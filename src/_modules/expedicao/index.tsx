'use client';

import { useState } from "react";
import { ErrorFiles } from "./services/types/errorsFile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs";
import UploadsPage from "./_components/0_upload/uploadFiles";
import { ImpressaoMinutaCarregamentoPage } from "./_components/minuta";
import Mapa from "./_components/mapa";
import TransportesAdicionados from "./_components/adicionarTransporte/transportesAdicionados";
import Configuracoes from "./_components/configuracoes";
import { Header } from "@/_shared/components/ui/header";
import ErrorsValidacao from "./_components/errorsValidacao";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useSession } from "next-auth/react";
import { MapaDeCarregamento } from "./_components/carregamento";

export default function ImpressaoMapa() {
  const [tab, setTab] = useState('upload');
  const { user } = useAuthStore();
  const { data: session } = useSession();
  const [errors, setErrors] = useState<ErrorFiles | null>(null);

  return (
    <div className="p-4">
    <Header title="Impressão de Mapa" subtitle="Impressão de Mapa" />
    <Tabs className='mt-4' value={tab} onValueChange={setTab}>
      <TabsList hidden>
        <TabsTrigger value='upload'>Upload</TabsTrigger>
        <TabsTrigger value='minuta'>Minuta</TabsTrigger>
        <TabsTrigger value='mapa'>Separação</TabsTrigger>
        <TabsTrigger value='carregamento'>Carregamento</TabsTrigger>
        <TabsTrigger value='transporte'>Transporte</TabsTrigger>
        <TabsTrigger value='validacaoDados'>Validar Entradas</TabsTrigger>
        <TabsTrigger value='configuracoes'>Configurações</TabsTrigger>
      </TabsList>
      <TabsContent value='upload'>
        <UploadsPage  setTab={setTab} setErrors={setErrors}/>
      </TabsContent>
      <TabsContent value='minuta'>
        <ImpressaoMinutaCarregamentoPage setTab={setTab} />
      </TabsContent>
      <TabsContent value='mapa'>
        <Mapa setTab={setTab} />
      </TabsContent>
      <TabsContent value='carregamento'>
        <MapaDeCarregamento setTab={setTab} />
      </TabsContent>
      <TabsContent value='transporte'>
        <TransportesAdicionados setTab={setTab} />
      </TabsContent>
      <TabsContent value='validacaoDados'>
        <ErrorsValidacao setTab={setTab} errors={errors} />
      </TabsContent>
      <TabsContent value='configuracoes'>
        <Configuracoes setTab={setTab}/>
      </TabsContent>
    </Tabs>
    </div>
  );
}
