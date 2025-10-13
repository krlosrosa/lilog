"use client";

import { useState } from "react";
import { 
  Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Pie, PieChart, Cell, Area, AreaChart 
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/_shared/components/ui/chart";
import { Button } from "@/_shared/components/ui/button";
import { Calendar } from "@/_shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_shared/components/ui/popover";
import { Badge } from "@/_shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_shared/components/ui/select";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Boxes, Calendar as CalendarIcon, Clock, TrendingUp, Award, 
  Loader2, AlertCircle, Users, Building2, Sun
} from "lucide-react";
import { useDashCentroIndividual, useDashCentros } from "@/_services/api/hooks/dashboard/dashboard";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { normalizarNome } from "@/_shared/utils/formatNome";

// ============================================
// COLOR CONSTANTS
// ============================================

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

// ============================================
// REUSABLE COMPONENTS
// ============================================

const KpiCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const TrendChart = ({ data }: { data: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Evolução da Produtividade Diária</CardTitle>
      <CardDescription>Acompanhamento diário de caixas processadas e produtividade.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{}} className="h-[300px] w-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCaixas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="data" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="produtividade" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCaixas)" 
              name="Produtividade"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

const TurnoComparisonChart = ({ data }: { data: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Comparativo por Turno</CardTitle>
      <CardDescription>Produtividade e caixas por turno de trabalho.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{}} className="h-[320px] w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis 
              dataKey="turno" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="totalCaixas" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Total Caixas" />
            <Bar dataKey="produtividade" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Produtividade (cx/h)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

const EmpresaRankingChart = ({ data }: { data: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Ranking de Produtividade por Empresa</CardTitle>
      <CardDescription>Caixas processadas por hora trabalhada.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{}} className="h-[300px] w-full">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis 
              dataKey="empresa" 
              type="category" 
              tickLine={false} 
              axisLine={false}
              width={120}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="produtividade" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} name="Produtividade (cx/h)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

const DonutChartCard = ({ data, title, description, nameKey }: { 
  data: any[];
  title: string;
  description: string;
  nameKey: string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{}} className="h-[280px] w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="totalCaixas"
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="white" 
                    textAnchor="middle" 
                    dominantBaseline="central"
                    className="text-xs font-medium"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

const TopPerformersCard = ({ data }: { data: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Award className="h-5 w-5 text-yellow-500" />
        Top 5 Desempenho
      </CardTitle>
      <CardDescription>Melhores desempenhos de produtividade.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                index === 1 ? 'bg-gray-400/20 text-gray-600' :
                index === 2 ? 'bg-orange-500/20 text-orange-600' :
                'bg-muted text-muted-foreground'
              }`}>
                <span className="text-sm font-bold">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium">{normalizarNome(item.nome)}</p>
                <p className="text-xs text-muted-foreground">{item.totalCaixas.toLocaleString()} caixas • {item.horasTrabalhadas.toFixed(1)}h</p>
              </div>
            </div>
            <Badge variant="outline">{item.produtividade.toFixed(1)} cx/h</Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Carregando dados do dashboard...</p>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Erro ao carregar dados</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ============================================
// MAIN DASHBOARD PAGE
// ============================================

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({ 
    from: subDays(new Date(), 29), 
    to: new Date() 
  });
  const {centerId} = useAuthStore()

  const dataInicio = date?.from ? format(date.from, "yyyy-MM-dd") : format(subDays(new Date(), 29), "yyyy-MM-dd");
  const dataFim = date?.to ? format(date.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");

  // Ajuste o hook para incluir centerID se necessário
  const { data, isLoading, error } = useDashCentroIndividual(centerId,{ 
    dataInicio, 
    dataFim,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error.message || "Ocorreu um erro ao buscar os dados."} />;
  }

  if (!data) {
    return <ErrorState message="Nenhum dado disponível para o período selecionado." />;
  }

  // Processar dados para os gráficos
  const dailyTrendData = data.produtividadeDiaDia.map((item, index) => ({
    data: format(item.dataRegistro, "dd/MM", { locale: ptBR }),
    totalCaixas: item.totalCaixas,
    horasTrabalhadas: item.horasTrabalhadas,
    produtividade: item.produtividade
  }));

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Produtividade</h2>
          <p className="text-muted-foreground mt-1">Visão executiva das operações em tempo real.</p>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base">Filtros Avançados</CardTitle>
          <CardDescription>Configure os filtros para análise personalizada.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? 
                    `${format(date.from, "dd/MM/y")} - ${format(date.to, "dd/MM/y")}` : 
                    format(date.from, "dd/MM/y")
                ) : <span>Selecione um período</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar 
                initialFocus 
                mode="range" 
                defaultMonth={date?.from} 
                selected={date} 
                onSelect={setDate} 
                numberOfMonths={2} 
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Total de Caixas" 
          value={data.totalCaixas.toLocaleString()} 
          icon={Boxes} 
          description="Caixas processadas no período"
        />
        <KpiCard 
          title="Horas Trabalhadas" 
          value={data.horasTrabalhadas.toLocaleString(undefined, {maximumFractionDigits: 1})} 
          icon={Clock} 
          description="Tempo total trabalhado"
        />
        <KpiCard 
          title="Produtividade Média" 
          value={data.produtividade.toFixed(1)} 
          icon={TrendingUp} 
          description="Caixas por hora"
        />
        <KpiCard 
          title="Total de Demandas" 
          value={data.totalDemandas.toLocaleString()} 
          icon={Users} 
          description="Demandas concluídas"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChart data={dailyTrendData} />
        </div>
        <TopPerformersCard data={data.topCincoProdutividade} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TurnoComparisonChart data={data.rankingProdutividadePorTurno} />
        <EmpresaRankingChart data={data.rankingProdutividadePorEmpresa} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DonutChartCard 
          data={data.rankingProdutividadePorTurno}
          title="Distribuição de Caixas por Turno" 
          description="Percentual de caixas processadas por turno." 
          nameKey="turno"
        />
        <DonutChartCard 
          data={data.rankingProdutividadePorEmpresa}
          title="Distribuição de Caixas por Empresa" 
          description="Percentual de caixas processadas por empresa." 
          nameKey="empresa"
        />
      </div>
    </div>
  );
}