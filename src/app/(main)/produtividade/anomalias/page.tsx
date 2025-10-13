'use client'
import { useState } from 'react';
import { Calendar, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/_shared/components/ui/input';
import { Label } from '@/_shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_shared/components/ui/card';
import { Badge } from '@/_shared/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/_shared/components/ui/alert';
import { useAnomaliasPorCentro } from '@/_services/api/hooks/dashboard/dashboard';
import { useAuthStore } from '@/_shared/stores/auth.store';

interface Anomalia {
  id: number;
  demandaId: number;
  centerId: string;
  funcionarioId: string;
  nomeFuncionario: string;
  cadastroPorId: string;
  nomeCadastradoPor: string;
  inicio: string;
  fim: string;
  caixas: number;
  unidades: number;
  paletes: number;
  enderecosVisitado: number;
  produtividade: number;
  motivoAnomalia: string;
}

export default function AnomaliaList() {
  const { centerId } = useAuthStore();
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [filtroNome, setFiltroNome] = useState('');

  const { 
    data: anomalias, 
    isLoading: loading, 
    isError,
    error 
  } = useAnomaliasPorCentro(
    centerId,
    {
      dataInicio: dataInicial,
      dataFim: dataFinal
    }, 
    {
      query: {
        enabled: Boolean(centerId && dataInicial && dataFinal)
      }
    }
  );

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Carregando anomalias...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar anomalias</AlertTitle>
          <AlertDescription>
            {error?.message || 'Ocorreu um erro ao buscar as anomalias. Tente novamente.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Filtragem segura
  const anomaliasFiltradas = (anomalias || []).filter(a => {
    const nomeFuncionario = a.nomeFuncionario?.toLowerCase() || '';
    const motivoAnomalia = a.motivoAnomalia?.toLowerCase() || '';
    const filtro = filtroNome.toLowerCase();
    
    return nomeFuncionario.includes(filtro) || motivoAnomalia.includes(filtro);
  });

  const formatarData = (data: string) => {
    try {
      if (!data) return 'N/A';
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return data;
    }
  };

  const getProdutividadeBadge = (produtividade: number) => {
    if (produtividade >= 80) return 'default';
    if (produtividade >= 50) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatório de Anomalias</h1>
        <p className="text-muted-foreground">Total de {anomaliasFiltradas.length} {anomaliasFiltradas.length === 1 ? 'anomalia' : 'anomalias'} encontradas</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione o período e filtros desejados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicial">
                <Calendar className="inline w-4 h-4 mr-1" />
                Data Inicial
              </Label>
              <Input
                id="dataInicial"
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFinal">
                <Calendar className="inline w-4 h-4 mr-1" />
                Data Final
              </Label>
              <Input
                id="dataFinal"
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtroNome">
                <Search className="inline w-4 h-4 mr-1" />
                Buscar
              </Label>
              <Input
                id="filtroNome"
                type="text"
                placeholder="Nome ou motivo..."
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                disabled={!anomalias || anomalias.length === 0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Anomalias */}
      {anomaliasFiltradas.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Funcionário</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Início</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fim</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Caixas</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Unidades</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Paletes</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Endereços</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Produtividade</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Motivo</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {anomaliasFiltradas.map((anomalia) => (
                    <tr key={anomalia.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">#{anomalia.id}</td>
                      <td className="p-4 align-middle">
                        <div>
                          <p className="font-medium">{anomalia.nomeFuncionario || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">ID: {anomalia.funcionarioId || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-sm">
                        {formatarData(anomalia.inicio)}
                      </td>
                      <td className="p-4 align-middle text-sm">
                        {formatarData(anomalia.fim || '')}
                      </td>
                      <td className="p-4 align-middle text-center font-medium">
                        {anomalia.caixas || 0}
                      </td>
                      <td className="p-4 align-middle text-center font-medium">
                        {anomalia.unidades || 0}
                      </td>
                      <td className="p-4 align-middle text-center font-medium">
                        {anomalia.paletes || 0}
                      </td>
                      <td className="p-4 align-middle text-center font-medium">
                        {anomalia.enderecosVisitado || 0}
                      </td>
                      <td className="p-4 align-middle text-center">
                        <Badge variant={getProdutividadeBadge(anomalia.produtividade || 0)}>
                          {anomalia.produtividade.toLocaleString('pt-BR') || 0}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <p className="text-sm max-w-xs">{anomalia.motivoAnomalia || 'N/A'}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : dataInicial && dataFinal ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Nenhuma anomalia encontrada</CardTitle>
            <CardDescription>Não há registros para o período selecionado</CardDescription>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Selecione um período</CardTitle>
            <CardDescription>Escolha as datas inicial e final para visualizar as anomalias</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}