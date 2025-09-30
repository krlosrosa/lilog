// ============================================
// TIPOS E INTERFACES PARA O DASHBOARD
// ============================================

export enum TipoProcesso {
  Picking = "Picking",
  Packing = "Packing",
  Receiving = "Receiving",
}

export enum Turno {
  Manha = "Manha",
  Tarde = "Tarde",
  Noite = "Noite",
}

// ============================================
// ESTRUTURAS DE DADOS DO BACKEND
// ============================================

/**
 * Representa um centro de distribuição
 */
export interface CenterDTO {
  centerId: string;
  description: string;
  cluster: string;
  state?: string;
}

/**
 * Representa um registro individual de produtividade
 * Baseado no modelo DashboardProdutividadeCenter do Prisma
 */
export interface DashboardProdutividadeRecord {
  id: number;
  dataRegistro: string; // ISO 8601 format: "2024-01-15T00:00:00Z"
  centerId: string;
  client?: string; // Opcional se você não tiver na tabela
  totalCaixas: number;
  totalUnidades: number;
  totalPaletes: number;
  totalEnderecos: number;
  totalPausasQuantidade: number;
  totalPausasTempo: number; // em minutos
  totalTempoTrabalhado: number; // em minutos
  totalDemandas: number;
  processo: TipoProcesso;
  turno: Turno;
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * Parâmetros de filtro para a API
 */
export interface DashboardFilters {
  dataInicio: string; // ISO 8601: "2024-01-01"
  dataFim: string;    // ISO 8601: "2024-01-31"
  centerId?: string;
  cluster?: string;
  client?: string;
  processo?: TipoProcesso;
  turno?: Turno;
}

/**
 * KPIs agregados do período
 */
export interface KPIData {
  totalUnidades: number;
  totalCaixas: number;
  totalPaletes: number;
  totalDemandas: number;
  totalTempoTrabalhado: number; // em minutos
  eficienciaMedia: number; // unidades por hora
}

/**
 * KPIs com comparação de período anterior
 */
export interface KPIComparativo {
  atual: KPIData;
  anterior: KPIData;
  variacao: {
    totalUnidades: number; // percentual
    totalCaixas: number;
    totalPaletes: number;
    totalDemandas: number;
    totalTempoTrabalhado: number;
    eficienciaMedia: number;
  };
}

/**
 * Dados agregados por dia para gráfico de tendência
 */
export interface TendenciaDiaria {
  data: string; // "2024-01-15"
  totalUnidades: number;
  totalCaixas: number;
  totalPaletes: number;
  totalDemandas: number;
}

/**
 * Dados de eficiência por centro
 */
export interface EficienciaCentro {
  centerId: string;
  centerDescription: string;
  totalUnidades: number;
  totalCaixas: number;
  totalPaletes: number;
  totalTempoTrabalhado: number; // em minutos
  eficiencia: number; // unidades por hora
  ranking: number;
}

/**
 * Distribuição por dimensão (processo, turno, cliente)
 */
export interface Distribuicao {
  nome: string; // nome do processo, turno ou cliente
  totalUnidades: number;
  totalCaixas: number;
  percentual: number; // 0-100
}

/**
 * Resposta completa da API do dashboard
 */
export interface DashboardResponse {
  kpis: KPIComparativo;
  tendenciaDiaria: TendenciaDiaria[];
  eficienciaPorCentro: EficienciaCentro[];
  distribuicao: {
    porProcesso: Distribuicao[];
    porTurno: Distribuicao[];
    porCliente: Distribuicao[];
  };
  registros: DashboardProdutividadeRecord[]; // Para a tabela detalhada
  metadata: {
    totalRegistros: number;
    dataProcessamento: string;
    filtrosAplicados: DashboardFilters;
  };
}

// ============================================
// EXEMPLOS DE USO
// ============================================

/**
 * Exemplo de requisição GET para o backend
 * 
 * Endpoint: GET /api/dashboard/produtividade
 * 
 * Query Parameters:
 * - dataInicio: string (obrigatório) - formato: YYYY-MM-DD
 * - dataFim: string (obrigatório) - formato: YYYY-MM-DD
 * - centerId?: string (opcional)
 * - cluster?: string (opcional)
 * - client?: string (opcional)
 * - processo?: string (opcional) - valores: "Picking" | "Packing" | "Receiving"
 * - turno?: string (opcional) - valores: "Manha" | "Tarde" | "Noite"
 * - incluirPeriodoAnterior?: boolean (opcional, default: true) - para cálculo de variação
 */

/**
 * Exemplo de resposta do backend
 */
export const exemploRespostaAPI: DashboardResponse = {
  kpis: {
    atual: {
      totalUnidades: 125000,
      totalCaixas: 8500,
      totalPaletes: 450,
      totalDemandas: 380,
      totalTempoTrabalhado: 15600, // 260 horas
      eficienciaMedia: 480.77 // 125000 / 260
    },
    anterior: {
      totalUnidades: 118000,
      totalCaixas: 8200,
      totalPaletes: 420,
      totalDemandas: 360,
      totalTempoTrabalhado: 15000,
      eficienciaMedia: 472.0
    },
    variacao: {
      totalUnidades: 5.93, // ((125000 - 118000) / 118000) * 100
      totalCaixas: 3.66,
      totalPaletes: 7.14,
      totalDemandas: 5.56,
      totalTempoTrabalhado: 4.0,
      eficienciaMedia: 1.86
    }
  },
  tendenciaDiaria: [
    {
      data: "2024-01-01",
      totalUnidades: 4200,
      totalCaixas: 280,
      totalPaletes: 15,
      totalDemandas: 12
    },
    {
      data: "2024-01-02",
      totalUnidades: 4350,
      totalCaixas: 295,
      totalPaletes: 16,
      totalDemandas: 13
    }
    // ... mais dias
  ],
  eficienciaPorCentro: [
    {
      centerId: "CD01",
      centerDescription: "CD São Paulo",
      totalUnidades: 45000,
      totalCaixas: 3000,
      totalPaletes: 150,
      totalTempoTrabalhado: 5400, // 90 horas
      eficiencia: 500.0, // 45000 / 90
      ranking: 1
    },
    {
      centerId: "CD02",
      centerDescription: "CD Rio de Janeiro",
      totalUnidades: 38000,
      totalCaixas: 2600,
      totalPaletes: 130,
      totalTempoTrabalhado: 5100,
      eficiencia: 447.06,
      ranking: 2
    }
    // ... mais centros
  ],
  distribuicao: {
    porProcesso: [
      {
        nome: "Picking",
        totalUnidades: 62500,
        totalCaixas: 4250,
        percentual: 50.0
      },
      {
        nome: "Packing",
        totalUnidades: 37500,
        totalCaixas: 2550,
        percentual: 30.0
      },
      {
        nome: "Receiving",
        totalUnidades: 25000,
        totalCaixas: 1700,
        percentual: 20.0
      }
    ],
    porTurno: [
      {
        nome: "Manhã",
        totalUnidades: 50000,
        totalCaixas: 3400,
        percentual: 40.0
      },
      {
        nome: "Tarde",
        totalUnidades: 43750,
        totalCaixas: 2975,
        percentual: 35.0
      },
      {
        nome: "Noite",
        totalUnidades: 31250,
        totalCaixas: 2125,
        percentual: 25.0
      }
    ],
    porCliente: [
      {
        nome: "Cliente A",
        totalUnidades: 45000,
        totalCaixas: 3060,
        percentual: 36.0
      },
      {
        nome: "Cliente B",
        totalUnidades: 35000,
        totalCaixas: 2380,
        percentual: 28.0
      },
      {
        nome: "Cliente C",
        totalUnidades: 28000,
        totalCaixas: 1904,
        percentual: 22.4
      },
      {
        nome: "Cliente D",
        totalUnidades: 17000,
        totalCaixas: 1156,
        percentual: 13.6
      }
    ]
  },
  registros: [
    {
      id: 1,
      dataRegistro: "2024-01-15T00:00:00Z",
      centerId: "CD01",
      client: "Cliente A",
      totalCaixas: 450,
      totalUnidades: 1850,
      totalPaletes: 25,
      totalEnderecos: 78,
      totalPausasQuantidade: 3,
      totalPausasTempo: 45,
      totalTempoTrabalhado: 480,
      totalDemandas: 15,
      processo: TipoProcesso.Picking,
      turno: Turno.Manha,
      criadoEm: "2024-01-15T08:00:00Z",
      atualizadoEm: "2024-01-15T08:00:00Z"
    }
    // ... mais registros para a tabela
  ],
  metadata: {
    totalRegistros: 450,
    dataProcessamento: "2024-01-31T10:30:00Z",
    filtrosAplicados: {
      dataInicio: "2024-01-01",
      dataFim: "2024-01-31",
      centerId: undefined,
      cluster: undefined,
      client: undefined,
      processo: undefined,
      turno: undefined
    }
  }
};
