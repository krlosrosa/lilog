# 📊 Dashboard de Produtividade - Documentação Backend

## 🎯 Resumo Executivo

Este documento contém todas as especificações necessárias para implementar o backend do Dashboard de Produtividade.

## 📁 Arquivos Importantes

1. **`types.ts`** - Tipos TypeScript e estruturas de dados
2. **`BACKEND_GUIDE.md`** - Guia completo de implementação com queries SQL
3. **`useDashboardData.ts`** - Hook React Query para consumir a API
4. **`page.tsx`** - Componente do dashboard (referência visual)

## 🔌 API Necessária

### Endpoint Principal

```
GET /api/dashboard/produtividade
```

### Parâmetros Obrigatórios
- `dataInicio` (string): Data inicial no formato YYYY-MM-DD
- `dataFim` (string): Data final no formato YYYY-MM-DD

### Parâmetros Opcionais
- `centerId` (string): ID do centro
- `cluster` (string): Nome do cluster
- `client` (string): Nome do cliente
- `processo` (string): "Picking" | "Packing" | "Receiving"
- `turno` (string): "Manha" | "Tarde" | "Noite"

### Exemplo de Requisição
```
GET /api/dashboard/produtividade?dataInicio=2024-01-01&dataFim=2024-01-31&cluster=distribuicao
```

## 📦 Estrutura da Resposta

A API deve retornar um JSON com a seguinte estrutura:

```typescript
{
  // 1. KPIs com comparação de período
  "kpis": {
    "atual": {
      "totalUnidades": 125000,
      "totalCaixas": 8500,
      "totalPaletes": 450,
      "totalDemandas": 380,
      "totalTempoTrabalhado": 15600,  // em minutos
      "eficienciaMedia": 480.77       // unidades/hora
    },
    "anterior": { /* mesmo formato */ },
    "variacao": {
      "totalUnidades": 5.93,  // percentual
      /* ... */
    }
  },
  
  // 2. Tendência diária (gráfico de área)
  "tendenciaDiaria": [
    {
      "data": "2024-01-01",
      "totalUnidades": 4200,
      "totalCaixas": 280,
      "totalPaletes": 15,
      "totalDemandas": 12
    }
    // ... mais dias
  ],
  
  // 3. Eficiência por centro (ranking)
  "eficienciaPorCentro": [
    {
      "centerId": "CD01",
      "centerDescription": "CD São Paulo",
      "totalUnidades": 45000,
      "totalCaixas": 3000,
      "totalPaletes": 150,
      "totalTempoTrabalhado": 5400,  // em minutos
      "eficiencia": 500.0,            // unidades/hora
      "ranking": 1
    }
    // ... mais centros
  ],
  
  // 4. Distribuições (gráficos de rosca)
  "distribuicao": {
    "porProcesso": [
      {
        "nome": "Picking",
        "totalUnidades": 62500,
        "totalCaixas": 4250,
        "percentual": 50.0
      }
      // ... Packing, Receiving
    ],
    "porTurno": [
      {
        "nome": "Manhã",
        "totalUnidades": 50000,
        "totalCaixas": 3400,
        "percentual": 40.0
      }
      // ... Tarde, Noite
    ],
    "porCliente": [
      {
        "nome": "Cliente A",
        "totalUnidades": 45000,
        "totalCaixas": 3060,
        "percentual": 36.0
      }
      // ... mais clientes
    ]
  },
  
  // 5. Registros detalhados (tabela)
  "registros": [
    {
      "id": 1,
      "dataRegistro": "2024-01-15T00:00:00Z",
      "centerId": "CD01",
      "client": "Cliente A",
      "totalCaixas": 450,
      "totalUnidades": 1850,
      "totalPaletes": 25,
      "totalEnderecos": 78,
      "totalPausasQuantidade": 3,
      "totalPausasTempo": 45,
      "totalTempoTrabalhado": 480,
      "totalDemandas": 15,
      "processo": "Picking",
      "turno": "Manha",
      "criadoEm": "2024-01-15T08:00:00Z",
      "atualizadoEm": "2024-01-15T08:00:00Z"
    }
    // ... mais registros
  ],
  
  // 6. Metadados
  "metadata": {
    "totalRegistros": 450,
    "dataProcessamento": "2024-01-31T10:30:00Z",
    "filtrosAplicados": { /* ... */ }
  }
}
```

## 🗄️ Modelo de Dados (Prisma)

### Tabela Principal
```prisma
model DashboardProdutividadeCenter {
  id                    Int          @id @default(autoincrement())
  dataRegistro          DateTime
  centerId              String
  totalCaixas           Int
  totalUnidades         Int
  totalPaletes          Int
  totalEnderecos        Int
  totalPausasQuantidade Int
  totalPausasTempo      Int          // em minutos
  totalTempoTrabalhado  Int          // em minutos
  totalDemandas         Int
  processo              TipoProcesso
  turno                 Turno
  criadoEm              DateTime     @default(now())
  atualizadoEm          DateTime     @updatedAt
  center                Center       @relation(fields: [centerId], references: [centerId])

  @@unique([centerId, processo, dataRegistro, turno])
}
```

### Tabela de Centros
```prisma
model Center {
  centerId     String  @id @unique
  description  String
  state        String
  cluster      String  @default("distribuicao")
  // ...
}
```

## 🔧 Implementação Rápida

### 1. Criar o Service
```typescript
export class DashboardService {
  async getDashboardData(filters: DashboardFilters) {
    // 1. Buscar KPIs período atual
    // 2. Buscar KPIs período anterior
    // 3. Calcular variações
    // 4. Buscar tendência diária
    // 5. Buscar eficiência por centro
    // 6. Buscar distribuições
    // 7. Buscar registros detalhados
    
    return { kpis, tendenciaDiaria, ... };
  }
}
```

### 2. Criar a Route
```typescript
// app/api/dashboard/produtividade/route.ts
export async function GET(request: NextRequest) {
  const filters = extractFilters(request);
  const service = new DashboardService();
  const data = await service.getDashboardData(filters);
  return NextResponse.json(data);
}
```

## 📊 Queries Principais

### KPIs Agregados
```sql
SELECT 
  SUM(totalUnidades),
  SUM(totalCaixas),
  SUM(totalPaletes),
  SUM(totalDemandas),
  SUM(totalTempoTrabalhado),
  ROUND(SUM(totalUnidades) / (SUM(totalTempoTrabalhado) / 60), 2) as eficiencia
FROM DashboardProdutividadeCenter
WHERE dataRegistro BETWEEN ? AND ?
```

### Eficiência por Centro
```sql
SELECT 
  centerId,
  SUM(totalUnidades) / (SUM(totalTempoTrabalhado) / 60) as eficiencia,
  ROW_NUMBER() OVER (ORDER BY eficiencia DESC) as ranking
FROM DashboardProdutividadeCenter
GROUP BY centerId
ORDER BY eficiencia DESC
```

## ⚡ Otimizações

1. **Índices Compostos**
```sql
CREATE INDEX idx_dashboard_filters 
ON DashboardProdutividadeCenter (dataRegistro, centerId, processo, turno);
```

2. **Cache Redis**
- TTL: 5-15 minutos
- Key pattern: `dashboard:{dataInicio}:{dataFim}:{filters_hash}`

3. **Paginação**
- Usar cursor-based pagination para registros
- Limite padrão: 100 registros

## ✅ Checklist de Implementação

- [ ] Criar endpoint `/api/dashboard/produtividade`
- [ ] Validar parâmetros obrigatórios (dataInicio, dataFim)
- [ ] Implementar cálculo de KPIs do período atual
- [ ] Implementar cálculo de KPIs do período anterior
- [ ] Calcular variações percentuais
- [ ] Implementar tendência diária
- [ ] Implementar ranking de eficiência por centro
- [ ] Implementar distribuições (processo, turno, cliente)
- [ ] Implementar busca de registros detalhados
- [ ] Adicionar cache Redis
- [ ] Criar índices no banco de dados
- [ ] Adicionar tratamento de erros
- [ ] Documentar com Swagger

## 🧪 Exemplo de Teste

```typescript
describe('Dashboard API', () => {
  it('deve retornar dados do dashboard', async () => {
    const response = await fetch('/api/dashboard/produtividade?dataInicio=2024-01-01&dataFim=2024-01-31');
    const data = await response.json();
    
    expect(data).toHaveProperty('kpis');
    expect(data).toHaveProperty('tendenciaDiaria');
    expect(data).toHaveProperty('eficienciaPorCentro');
    expect(data.kpis.atual.eficienciaMedia).toBeGreaterThan(0);
  });
});
```

## 📞 Suporte

Para dúvidas sobre a implementação:
1. Consulte `BACKEND_GUIDE.md` para queries SQL detalhadas
2. Veja `types.ts` para estruturas de dados completas
3. Analise `page.tsx` para entender como os dados são usados no frontend

---

**Versão:** 1.0
**Última Atualização:** 2024
