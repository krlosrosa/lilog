import { AddFuncionario } from "./_views/addFuncionario";
import { AddFuncionarioEmMassa } from "./_views/addFuncionarioEmMassa";
import { ListagemFuncionarios } from "./_views/listarFuncionario";
import { Button } from "@/_shared/components/ui/button";
import { Users, UserPlus } from "lucide-react";

export default function Funcionarios() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Gestão de Funcionários
                </h1>
                <p className="text-slate-600 text-sm">
                  Gerencie todos os funcionários do seu centro
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <AddFuncionario>
                <Button 
                  size="default" 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Funcionário
                </Button>
              </AddFuncionario>
              
              <AddFuncionarioEmMassa />
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ListagemFuncionarios />
        </div>
      </div>
    </div>
  );
}