"use client"
import { useListarFuncionariosPorCentro } from "@/_services/api/hooks/usuario/usuario";
import { DeletarFuncionario } from "./deletarFuncionario";
import { Button } from "@/_shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatName } from "@/_shared/utils/formatName";
import { useAuthStore } from "@/_shared/stores/auth.store";

const formatTurno = (turno: string) => {
  const turnoMap = {
    MANHA: "Manhã",
    TARDE: "Tarde", 
    NOITE: "Noite"
  };
  return turnoMap[turno as keyof typeof turnoMap] || turno;
};

const formatRole = (role: string) => {
  const roleMap = {
    USER: "Usuário",
    FUNCIONARIO: "Funcionário",
    ADMIN: "Administrador"
  };
  return roleMap[role as keyof typeof roleMap] || role;
};

export function ListagemFuncionarios() {
  const { centerId } = useAuthStore();

  const { data: funcionarios, isLoading, error } = useListarFuncionariosPorCentro(centerId || '')

  if (isLoading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-red-600">Erro ao carregar funcionários</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Lista de Funcionários</h1>
      
      {funcionarios && funcionarios.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {funcionario.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatName(funcionario.name)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formatTurno(funcionario.turno)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      funcionario.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      funcionario.role === 'FUNCIONARIO' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {formatRole(funcionario.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <DeletarFuncionario funcionarioId={funcionario.id}>
                      <Button size="icon" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DeletarFuncionario>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Nenhum funcionário encontrado.</p>
        </div>
      )}
    </div>
  );
}