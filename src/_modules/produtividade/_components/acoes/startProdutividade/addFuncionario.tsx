'use client'
import { Button } from "@/_shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Input } from "@/_shared/components/ui/input";
import { useListarFuncionariosPorCentro } from "@/_services/api/hooks/usuario/usuario";

import { Search, Users, Trash2, User, Plus } from "lucide-react";
import { formatName } from "@/_shared/utils/formatName";
import { useState, useMemo } from "react";
import { ListarFuncionariosPorCentroZodDtoOutput } from "@/_services/api/model";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { Textarea } from "@/_shared/components/ui/textarea";

type Funcionario = ListarFuncionariosPorCentroZodDtoOutput[number]

type AddFuncionarioDemandasProps = {
  funcionarioSelecionado: Funcionario | null;
  setFuncionarioSelecionado: (funcionario: Funcionario | null) => void;
  iniciarDemandaProdutividade: () => void;
  observacao: string;
  setObservacao: (observacao: string) => void;
  isPending: boolean;
}

export function AddFuncionarioDemandas({ funcionarioSelecionado, setFuncionarioSelecionado, iniciarDemandaProdutividade, observacao, setObservacao, isPending }: AddFuncionarioDemandasProps) {
  const { centerId } = useAuthStore()
  const { data: funcionariosDisponiveis, isLoading, error } = useListarFuncionariosPorCentro(centerId as string)

  const [filtroNome, setFiltroNome] = useState<string>('');

  const funcionariosFiltrados = useMemo(() => {
    return funcionariosDisponiveis && funcionariosDisponiveis.filter(funcionario =>
      funcionario.name.toLowerCase().includes(filtroNome.toLowerCase()) ||
      funcionario.id.includes(filtroNome)
    );
  }, [filtroNome, funcionariosDisponiveis]);

  const handleSelecionarFuncionario = (funcionario: Funcionario) => {
    setFuncionarioSelecionado(funcionario);
  };

  const handleRemoverSelecao = () => {
    setFuncionarioSelecionado(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && funcionariosFiltrados && funcionariosFiltrados.length > 0) {
      e.preventDefault();
      const primeiroFuncionario = funcionariosFiltrados[0];
      handleSelecionarFuncionario(primeiroFuncionario);
    }
  };

  // Renderização de estados de carregamento e erro
  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <Card className="h-fit">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Carregando funcionários...</div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          <Card className="h-fit">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Carregando...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <Card className="h-fit">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-red-600">Erro ao carregar funcionários</div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          <Card className="h-fit">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-red-600">Erro no carregamento</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coluna 1: Funcionário Selecionado */}
        <div className="w-full flex flex-col gap-4 justify-between">
          <Card className="h-fit border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="p-1 bg-primary/10 rounded">
                  <User className="h-3 w-3 text-primary" />
                </div>
                Funcionário Selecionado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!funcionarioSelecionado ? (
                <div className="text-center text-muted-foreground space-y-3">
                  <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Nenhum funcionário selecionado</p>
                    <p className="text-sm">Selecione um funcionário da lista ao lado</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 border border-border rounded-lg bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {funcionarioSelecionado.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-medium text-sm text-foreground">{formatName(funcionarioSelecionado.name)}</p>
                          <p className="text-xs text-muted-foreground">ID: {funcionarioSelecionado.id}</p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoverSelecao}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                </div>
              )}
            </CardContent>
          </Card>
          <Textarea
            placeholder="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full"
          />
          <Button disabled={!funcionarioSelecionado || isPending} onClick={() => {
            iniciarDemandaProdutividade()
          }} className="w-full">
            <Plus className="h-4 w-4" />
            {isPending ? 'Inserindo...' : 'Inserir Demanda'}
          </Button>
        </div>

        {/* Coluna 2: Lista de Funcionários Disponíveis */}
        <div className="w-full">
          <Card className="h-fit border-border/50 shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="p-1 bg-secondary rounded">
                    <Users className="h-3 w-3 text-secondary-foreground" />
                  </div>
                  Funcionários disponíveis
                </CardTitle>
                {/* <AddFuncionario>
                  <Button size="icon" variant="outline" className="gap-1 px-2 py-1 h-7 text-xs">
                    <Plus className="h-3 w-3" />
                  </Button>
                </AddFuncionario>*/}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou ID... (Enter/Tab para selecionar primeiro)"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-10"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 pr-2">
                {funcionariosFiltrados && funcionariosFiltrados.map((funcionario, index) => {
                  const estaSelecionado = funcionarioSelecionado?.id === funcionario.id;

                  return (
                    <div
                      key={funcionario.id + index}
                      className={`group flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all duration-200 ${estaSelecionado
                          ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
                          : 'bg-card hover:bg-muted/50 border-border hover:shadow-sm'
                        }`}
                      onClick={() => !estaSelecionado && handleSelecionarFuncionario(funcionario)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${estaSelecionado ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                          }`}>
                          <span className="text-sm font-medium">
                            {funcionario.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <p className={`font-medium text-xs ${estaSelecionado ? 'text-primary' : 'text-foreground'}`}>
                            {formatName(funcionario.name)}
                          </p>
                          <p className="text-xs text-muted-foreground">ID: {funcionario.id}</p>
                        </div>
                      </div>

                      {estaSelecionado ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-primary font-medium">Selecionado</span>
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelecionarFuncionario(funcionario);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Selecionar
                        </Button>
                      )}
                    </div>
                  );
                })}

                {funcionariosFiltrados && funcionariosFiltrados.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground space-y-3">
                    <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Nenhum funcionário encontrado</p>
                      <p className="text-sm">Tente ajustar sua busca</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}