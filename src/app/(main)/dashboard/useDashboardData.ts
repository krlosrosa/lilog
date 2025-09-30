import { useQuery } from '@tanstack/react-query';
import { DashboardResponse, DashboardFilters } from './types';

/**
 * Hook customizado para buscar dados do dashboard
 * Usa React Query para cache e gerenciamento de estado
 */
export const useDashboardData = (filters: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard-produtividade', filters],
    queryFn: async (): Promise<DashboardResponse> => {
      const params = new URLSearchParams();
      
      params.append('dataInicio', filters.dataInicio);
      params.append('dataFim', filters.dataFim);
      
      if (filters.centerId) params.append('centerId', filters.centerId);
      if (filters.cluster) params.append('cluster', filters.cluster);
      if (filters.client) params.append('client', filters.client);
      if (filters.processo) params.append('processo', filters.processo);
      if (filters.turno) params.append('turno', filters.turno);

      const response = await fetch(`/api/dashboard/produtividade?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do dashboard');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
    enabled: Boolean(filters.dataInicio && filters.dataFim), // Só executa se tiver as datas
  });
};

/**
 * Exemplo de uso no componente:
 * 
 * const { data, isLoading, error } = useDashboardData({
 *   dataInicio: '2024-01-01',
 *   dataFim: '2024-01-31',
 *   cluster: 'distribuicao',
 *   processo: TipoProcesso.Picking
 * });
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage />;
 * if (!data) return null;
 * 
 * // Usar data.kpis, data.tendenciaDiaria, etc.
 */
