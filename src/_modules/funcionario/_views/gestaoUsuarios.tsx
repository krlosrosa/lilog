import { Header } from "@/_shared/components/ui/header";
import { AddFuncionarioAdm } from "../_components/addFuncionarioAdm";
import ListagemFuncionariosAdm from "../_components/listagemFuncionariosAdm";
import AddFuncionarioAdmEmMassa from "../_components/addFuncionarioAdmEmMassa";

export default function GestaoUsuarios() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="space-y-2 mb-6">
          <Header 
            title="Gestão de Usuários" 
            subtitle="Gerencie todos os usuários do seu centro de distribuição" 
          />
          <AddFuncionarioAdmEmMassa/>
        </div>

        {/* Users List Section */}
        <ListagemFuncionariosAdm />

        {/* Floating Action Button */}
        <AddFuncionarioAdm />
      </div>
    </div>
  )
}