# Guia de Implementação Backend - Dashboard de Produtividade

## 📋 Visão Geral

Este guia mostra como implementar os endpoints necessários para o Dashboard de Produtividade.

## 🔌 Endpoint Principal

### `GET /api/dashboard/produtividade`

**Query Parameters:**
```typescript
{
  dataInicio: string;        // YYYY-MM-DD (obrigatório)
  dataFim: string;           // YYYY-MM-DD (obrigatório)
  centerId?: string;         // Opcional
  cluster?: string;          // Opcional
  client?: string;           // Opcional
  processo?: string;         // "Picking" | "Packing" | "Receiving"
  turno?: string;           // "Manha" | "Tarde" | "Noite"
  incluirPeriodoAnterior?: boolean; // default: true
}
```

**Exemplo de Requisição:**
```
GET /api/dashboard/produtividade?dataInicio=2024-01-01&dataFim=2024-01-31&cluster=distribuicao
```

---

## 📊 Estrutura da Resposta

```typescript
{
  kpis: {
    atual: { ... },
    anterior: { ... },
    variacao: { ... }
  },
  tendenciaDiaria: [ ... ],
  eficienciaPorCentro: [ ... ],
  distribuicao: {
    porProcesso: [ ... ],
    porTurno: [ ... ],
    porCliente: [ ... ]
  },
  registros: [ ... ],
  metadata: { ... }
}
```

---

## 🗄️ Queries SQL (Prisma/PostgreSQL)

### 1. KPIs do Período Atual

```sql
-- Query principal para KPIs
SELECT 
  SUM(totalUnidades) as totalUnidades,
  SUM(totalCaixas) as totalCaixas,
  SUM(totalPaletes) as totalPaletes,
  SUM(totalDemandas) as totalDemandas,
  SUM(totalTempoTrabalhado) as totalTempoTrabalhado,
  ROUND(
    CASE 
      WHEN SUM(totalTempoTrabalhado) > 0 
      THEN (SUM(totalUnidades)::NUMERIC / (SUM(totalTempoTrabalhado)::NUMERIC / 60))
      ELSE 0 
    END, 
    2
  ) as eficienciaMedia
FROM "DashboardProdutividadeCenter" dp
LEFT JOIN "Center" c ON dp."centerId" = c."centerId"
WHERE 
  dp."dataRegistro" >= '2024-01-01'
  AND dp."dataRegistro" <= '2024-01-31'
  -- Filtros opcionais
  AND (NULL IS NULL OR dp."centerId" = NULL)
  AND (NULL IS NULL OR c."cluster" = NULL)
  AND (NULL IS NULL OR dp."processo" = NULL)
  AND (NULL IS NULL OR dp."turno" = NULL);
```

### 2. KPIs do Período Anterior (para comparação)

```sql
-- Calcula o período anterior com base no range de datas
WITH periodo_config AS (
  SELECT 
    '2024-01-01'::DATE as data_inicio,
    '2024-01-31'::DATE as data_fim,
    ('2024-01-31'::DATE - '2024-01-01'::DATE) + 1 as dias_periodo
),
periodo_anterior AS (
  SELECT
    (data_inicio - dias_periodo)::DATE as anterior_inicio,
    (data_inicio - 1)::DATE as anterior_fim
  FROM periodo_config
)
SELECT 
  SUM(totalUnidades) as totalUnidades,
  SUM(totalCaixas) as totalCaixas,
  SUM(totalPaletes) as totalPaletes,
  SUM(totalDemandas) as totalDemandas,
  SUM(totalTempoTrabalhado) as totalTempoTrabalhado,
  ROUND(
    CASE 
      WHEN SUM(totalTempoTrabalhado) > 0 
      THEN (SUM(totalUnidades)::NUMERIC / (SUM(totalTempoTrabalhado)::NUMERIC / 60))
      ELSE 0 
    END, 
    2
  ) as eficienciaMedia
FROM "DashboardProdutividadeCenter" dp
LEFT JOIN "Center" c ON dp."centerId" = c."centerId"
CROSS JOIN periodo_anterior
WHERE 
  dp."dataRegistro" >= periodo_anterior.anterior_inicio
  AND dp."dataRegistro" <= periodo_anterior.anterior_fim
  -- Mesmos filtros do período atual
```

### 3. Tendência Diária

```sql
SELECT 
  DATE(dp."dataRegistro") as data,
  SUM(dp.totalUnidades) as totalUnidades,
  SUM(dp.totalCaixas) as totalCaixas,
  SUM(dp.totalPaletes) as totalPaletes,
  SUM(dp.totalDemandas) as totalDemandas
FROM "DashboardProdutividadeCenter" dp
LEFT JOIN "Center" c ON dp."centerId" = c."centerId"
WHERE 
  dp."dataRegistro" >= '2024-01-01'
  AND dp."dataRegistro" <= '2024-01-31'
  -- Filtros opcionais
GROUP BY DATE(dp."dataRegistro")
ORDER BY DATE(dp."dataRegistro") ASC;
```

### 4. Eficiência por Centro

```sql
SELECT 
  dp."centerId",
  c.description as centerDescription,
  SUM(dp.totalUnidades) as totalUnidades,
  SUM(dp.totalCaixas) as totalCaixas,
  SUM(dp.totalPaletes) as totalPaletes,
  SUM(dp.totalTempoTrabalhado) as totalTempoTrabalhado,
  ROUND(
    CASE 
      WHEN SUM(dp.totalTempoTrabalhado) > 0 
      THEN (SUM(dp.totalUnidades)::NUMERIC / (SUM(dp.totalTempoTrabalhado)::NUMERIC / 60))
      ELSE 0 
    END, 
    2
  ) as eficiencia,
  ROW_NUMBER() OVER (ORDER BY 
    CASE 
      WHEN SUM(dp.totalTempoTrabalhado) > 0 
      THEN (SUM(dp.totalUnidades)::NUMERIC / (SUM(dp.totalTempoTrabalhado)::NUMERIC / 60))
      ELSE 0 
    END DESC
  ) as ranking
FROM "DashboardProdutividadeCenter" dp
LEFT JOIN "Center" c ON dp."centerId" = c."centerId"
WHERE 
  dp."dataRegistro" >= '2024-01-01'
  AND dp."dataRegistro" <= '2024-01-31'
  -- Filtros opcionais
GROUP BY dp."centerId", c.description
ORDER BY eficiencia DESC;
```

### 5. Distribuição por Processo

```sql
WITH total AS (
  SELECT SUM(totalUnidades) as total_geral
  FROM "DashboardProdutividadeCenter"
  WHERE "dataRegistro" >= '2024-01-01'
    AND "dataRegistro" <= '2024-01-31'
)
SELECT 
  processo as nome,
  SUM(totalUnidades) as totalUnidades,
  SUM(totalCaixas) as totalCaixas,
  ROUND((SUM(totalUnidades)::NUMERIC / total.total_geral) * 100, 2) as percentual
FROM "DashboardProdutividadeCenter" dp
CROSS JOIN total
WHERE 
  dp."dataRegistro" >= '2024-01-01'
  AND dp."dataRegistro" <= '2024-01-31'
  -- Filtros opcionais
GROUP BY processo, total.total_geral
ORDER BY totalUnidades DESC;
```

### 6. Distribuição por Turno

```sql
WITH total AS (
  SELECT SUM(totalUnidades) as total_geral
  FROM "DashboardProdutividadeCenter"
  WHERE "dataRegistro" >= '2024-01-01'
    AND "dataRegistro" <= '2024-01-31'
)
SELECT 
  CASE 
    WHEN turno = 'Manha' THEN 'Manhã'
    WHEN turno = 'Tarde' THEN 'Tarde'
    WHEN turno = 'Noite' THEN 'Noite'
  END as nome,
  SUM(totalUnidades) as totalUnidades,
  SUM(totalCaixas) as totalCaixas,
  ROUND((SUM(totalUnidades)::NUMERIC / total.total_geral) * 100, 2) as percentual
FROM "DashboardProdutividadeCenter" dp
CROSS JOIN total
WHERE 
  dp."dataRegistro" >= '2024-01-01'
  AND dp."dataRegistro" <= '2024-01-31'
  -- Filtros opcionais
GROUP BY turno, total.total_geral
ORDER BY totalUnidades DESC;
```

### 7. Registros Detalhados (para tabela)

```sql
SELECT 
  dp.id,
  dp."dataRegistro",
  dp."centerId",
  -- Se você não tem campo client na tabela, pode fazer JOIN com outra tabela ou retornar NULL
  NULL as client,  
  dp."totalCaixas",
  dp."totalUnidades",
  dp."totalPaletes",
  dp."totalEnderecos",
  dp."totalPausasQuantidade",
  dp."totalPausasTempo",
  dp."totalTempoTrabalhado",
  dp."totalDemandas",
  dp.processo,
  dp.turno,
  dp."criadoEm",
  dp."atualizadoEm"
FROM "DashboardProdutividadeCenter" dp
LEFT JOIN "Center" c ON dp."centerId" = c."centerId"
WHERE 
  dp."dataRegistro" >= '2024-01-01'
  AND dp."dataRegistro" <= '2024-01-31'
  -- Filtros opcionais
ORDER BY dp."dataRegistro" DESC, dp."centerId"
LIMIT 100; -- Implementar paginação
```

---

## 💻 Implementação com Prisma (TypeScript)

### Service Layer

```typescript
import { PrismaClient } from '@prisma/client';
import { subDays, differenceInDays } from 'date-fns';

const prisma = new PrismaClient();

export class DashboardService {
  
  async getDashboardData(filters: DashboardFilters): Promise<DashboardResponse> {
    const { dataInicio, dataFim, centerId, cluster, processo, turno, client } = filters;
    
    // 1. Calcular período anterior
    const daysDiff = differenceInDays(new Date(dataFim), new Date(dataInicio));
    const anteriorInicio = subDays(new Date(dataInicio), daysDiff + 1);
    const anteriorFim = subDays(new Date(dataInicio), 1);

    // 2. Construir filtro base
    const baseFilter = {
      dataRegistro: {
        gte: new Date(dataInicio),
        lte: new Date(dataFim)
      },
      ...(centerId && { centerId }),
      ...(processo && { processo }),
      ...(turno && { turno }),
    };

    // Se tiver cluster, fazer join
    const centerFilter = cluster ? {
      center: {
        cluster: cluster
      }
    } : {};

    const whereClause = { ...baseFilter, ...centerFilter };

    // 3. Buscar KPIs período atual
    const kpisAtual = await this.getKPIs(whereClause);

    // 4. Buscar KPIs período anterior
    const kpisAnterior = await this.getKPIs({
      ...whereClause,
      dataRegistro: {
        gte: anteriorInicio,
        lte: anteriorFim
      }
    });

    // 5. Calcular variações
    const variacao = this.calcularVariacao(kpisAtual, kpisAnterior);

    // 6. Tendência diária
    const tendenciaDiaria = await this.getTendenciaDiaria(whereClause);

    // 7. Eficiência por centro
    const eficienciaPorCentro = await this.getEficienciaPorCentro(whereClause);

    // 8. Distribuições
    const distribuicao = {
      porProcesso: await this.getDistribuicaoPorProcesso(whereClause),
      porTurno: await this.getDistribuicaoPorTurno(whereClause),
      porCliente: await this.getDistribuicaoPorCliente(whereClause),
    };

    // 9. Registros detalhados
    const registros = await prisma.dashboardProdutividadeCenter.findMany({
      where: whereClause,
      orderBy: [
        { dataRegistro: 'desc' },
        { centerId: 'asc' }
      ],
      take: 100 // Limite inicial, implementar paginação
    });

    return {
      kpis: {
        atual: kpisAtual,
        anterior: kpisAnterior,
        variacao
      },
      tendenciaDiaria,
      eficienciaPorCentro,
      distribuicao,
      registros,
      metadata: {
        totalRegistros: registros.length,
        dataProcessamento: new Date().toISOString(),
        filtrosAplicados: filters
      }
    };
  }

  private async getKPIs(where: any): Promise<KPIData> {
    const result = await prisma.dashboardProdutividadeCenter.aggregate({
      where,
      _sum: {
        totalUnidades: true,
        totalCaixas: true,
        totalPaletes: true,
        totalDemandas: true,
        totalTempoTrabalhado: true
      }
    });

    const totalUnidades = result._sum.totalUnidades || 0;
    const totalTempoTrabalhado = result._sum.totalTempoTrabalhado || 0;
    const eficienciaMedia = totalTempoTrabalhado > 0 
      ? totalUnidades / (totalTempoTrabalhado / 60) 
      : 0;

    return {
      totalUnidades,
      totalCaixas: result._sum.totalCaixas || 0,
      totalPaletes: result._sum.totalPaletes || 0,
      totalDemandas: result._sum.totalDemandas || 0,
      totalTempoTrabalhado,
      eficienciaMedia: Number(eficienciaMedia.toFixed(2))
    };
  }

  private async getTendenciaDiaria(where: any): Promise<TendenciaDiaria[]> {
    const result = await prisma.$queryRaw`
      SELECT 
        DATE("dataRegistro") as data,
        SUM("totalUnidades")::INTEGER as "totalUnidades",
        SUM("totalCaixas")::INTEGER as "totalCaixas",
        SUM("totalPaletes")::INTEGER as "totalPaletes",
        SUM("totalDemandas")::INTEGER as "totalDemandas"
      FROM "DashboardProdutividadeCenter"
      WHERE "dataRegistro" >= ${where.dataRegistro.gte}
        AND "dataRegistro" <= ${where.dataRegistro.lte}
      GROUP BY DATE("dataRegistro")
      ORDER BY DATE("dataRegistro") ASC
    `;

    return result as TendenciaDiaria[];
  }

  private async getEficienciaPorCentro(where: any): Promise<EficienciaCentro[]> {
    const result = await prisma.dashboardProdutividadeCenter.groupBy({
      by: ['centerId'],
      where,
      _sum: {
        totalUnidades: true,
        totalCaixas: true,
        totalPaletes: true,
        totalTempoTrabalhado: true
      }
    });

    // Buscar informações dos centros
    const centerIds = result.map(r => r.centerId);
    const centers = await prisma.center.findMany({
      where: { centerId: { in: centerIds } }
    });

    const centerMap = new Map(centers.map(c => [c.centerId, c]));

    const eficiencias = result.map(r => {
      const totalUnidades = r._sum.totalUnidades || 0;
      const totalTempoTrabalhado = r._sum.totalTempoTrabalhado || 0;
      const eficiencia = totalTempoTrabalhado > 0 
        ? totalUnidades / (totalTempoTrabalhado / 60) 
        : 0;

      return {
        centerId: r.centerId,
        centerDescription: centerMap.get(r.centerId)?.description || r.centerId,
        totalUnidades,
        totalCaixas: r._sum.totalCaixas || 0,
        totalPaletes: r._sum.totalPaletes || 0,
        totalTempoTrabalhado,
        eficiencia: Number(eficiencia.toFixed(2)),
        ranking: 0 // Será calculado após ordenação
      };
    });

    // Ordenar por eficiência e definir ranking
    eficiencias.sort((a, b) => b.eficiencia - a.eficiencia);
    eficiencias.forEach((e, index) => {
      e.ranking = index + 1;
    });

    return eficiencias;
  }

  private calcularVariacao(atual: KPIData, anterior: KPIData) {
    const calcVariacao = (atual: number, anterior: number) => {
      if (anterior === 0) return 0;
      return Number((((atual - anterior) / anterior) * 100).toFixed(2));
    };

    return {
      totalUnidades: calcVariacao(atual.totalUnidades, anterior.totalUnidades),
      totalCaixas: calcVariacao(atual.totalCaixas, anterior.totalCaixas),
      totalPaletes: calcVariacao(atual.totalPaletes, anterior.totalPaletes),
      totalDemandas: calcVariacao(atual.totalDemandas, anterior.totalDemandas),
      totalTempoTrabalhado: calcVariacao(atual.totalTempoTrabalhado, anterior.totalTempoTrabalhado),
      eficienciaMedia: calcVariacao(atual.eficienciaMedia, anterior.eficienciaMedia)
    };
  }

  // Implementar métodos para distribuição...
}
```

### Controller/Route Handler

```typescript
// app/api/dashboard/produtividade/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboard.service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters: DashboardFilters = {
    dataInicio: searchParams.get('dataInicio') || '',
    dataFim: searchParams.get('dataFim') || '',
    centerId: searchParams.get('centerId') || undefined,
    cluster: searchParams.get('cluster') || undefined,
    client: searchParams.get('client') || undefined,
    processo: searchParams.get('processo') as TipoProcesso || undefined,
    turno: searchParams.get('turno') as Turno || undefined,
  };

  if (!filters.dataInicio || !filters.dataFim) {
    return NextResponse.json(
      { error: 'dataInicio e dataFim são obrigatórios' },
      { status: 400 }
    );
  }

  try {
    const dashboardService = new DashboardService();
    const data = await dashboardService.getDashboardData(filters);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 Checklist de Implementação

- [ ] Criar endpoint `GET /api/dashboard/produtividade`
- [ ] Implementar validação de parâmetros obrigatórios
- [ ] Implementar cálculo de KPIs do período atual
- [ ] Implementar cálculo de KPIs do período anterior
- [ ] Implementar cálculo de variações percentuais
- [ ] Implementar query de tendência diária
- [ ] Implementar query de eficiência por centro com ranking
- [ ] Implementar distribuição por processo
- [ ] Implementar distribuição por turno
- [ ] Implementar distribuição por cliente (se aplicável)
- [ ] Implementar busca de registros detalhados
- [ ] Adicionar paginação aos registros detalhados
- [ ] Implementar cache (Redis) para otimização
- [ ] Adicionar testes unitários
- [ ] Documentar API com Swagger/OpenAPI

---

## 🚀 Otimizações Recomendadas

1. **Cache**: Implementar cache Redis para queries pesadas (5-15 minutos)
2. **Índices**: Criar índices compostos:
   ```sql
   CREATE INDEX idx_dashboard_data_centro 
   ON "DashboardProdutividadeCenter" ("dataRegistro", "centerId", "processo", "turno");
   ```
3. **Materialized Views**: Para dashboards com muitos dados históricos
4. **Paginação**: Implementar cursor-based pagination para registros
5. **Compressão**: Habilitar compressão gzip nas respostas

---

## 📝 Notas Importantes

- Todos os tempos são retornados em **minutos**
- Eficiência é calculada como **unidades/hora**
- Datas devem estar no formato **ISO 8601**
- A comparação com período anterior usa o mesmo range de dias
- Percentuais de distribuição somam 100%
