'use client'

import { useOverViewDia } from "@/_services/api/hooks/dashboard/dashboard"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card"
import { Badge } from "@/_shared/components/ui/badge"
import { Button } from "@/_shared/components/ui/button"
import { Input } from "@/_shared/components/ui/input"
import { Label } from "@/_shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Calendar, Users, PlayCircle, PauseCircle, CheckCircle, AlertTriangle, Package, Box, MapPin, Target, CalendarDays, TrendingUp, TrendingDown, LineChart, Users2 } from 'lucide-react'
import { Skeleton } from "@/_shared/components/ui/skeleton"
import { normalizarNome } from "@/_shared/utils/formatNome"

// --- TIPOS (Sem alterações) ---
interface Operador {
  id: string
  nome: string
  turno: string
  caixas: number
  paletes: number
  unidades: number
  visitar: number
  produtividade: number
}
interface AnomaliaPausa {
  id: string
  nome: string
  turno: string
  motivoPausa: string
  tempoDePausa: number
}
interface AnomaliaDemanda {
  id: string
  nome: string
  turno: string
  tempoDemanda: number
  visitas: number
  produtividade: number
  caixas: number
  unidade: number
  paletes: number
}
interface HoraAHora {
  data: string
  caixas: number
  unidades: number
  paletes: number
  visitas: number
  produtividade: number
}
interface DashboardData {
  overView: {
    totalDemandas: number
    totalEmAndamento: number
    totalEmpausa: number
    totalFinalizado: number
    totalCaixas: number,
    totalUnidades: number,
    mediaEnderecosVisitados: number
  }
  topCinco: Operador[]
  pioresCinco: Operador[]
  anomaliaPausa: AnomaliaPausa[]
  anomaliaDemanda: AnomaliaDemanda[]
  horaAHora: HoraAHora[]
}


// --- COMPONENTES VISUAIS (Sem alterações, continuam ótimos) ---

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

function StatsCards({ data }: { data: DashboardData }) {
  const stats = [
    { title: "Total Demandas", value: data.overView.totalDemandas, icon: Users, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300" },
    { title: "Em Andamento", value: data.overView.totalEmAndamento, icon: PlayCircle, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300", live: true },
    { title: "Em Pausa", value: data.overView.totalEmpausa, icon: PauseCircle, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-300" },
    { title: "Finalizadas", value: data.overView.totalFinalizado, icon: CheckCircle, color: "text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300" },
    { title: "Total Caixas", value: data.overView.totalCaixas, icon: Package, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300" },
    { title: "Total Unidades", value: data.overView.totalUnidades, icon: Box, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300" },
    { title: "Média Endereços", value: data.overView.mediaEnderecosVisitados.toFixed(1), icon: MapPin, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/50 dark:text-cyan-300" }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.live && (
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      <KpiHighlightCard data={data} />
    </div>
  )
}

function KpiHighlightCard({ data }: { data: DashboardData }) {
    const caixasPorDemanda = data.overView.totalFinalizado > 0
        ? (data.overView.totalCaixas / data.overView.totalFinalizado).toFixed(1)
        : '0';

    return (
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Caixas por Demanda</CardTitle>
                <div className="flex items-center justify-center h-8 w-8 rounded-full text-teal-600 bg-teal-100 dark:bg-teal-900/50 dark:text-teal-300">
                    <Target className="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{caixasPorDemanda}</div>
                <p className="text-xs text-muted-foreground mt-1">Média por demanda finalizada</p>
            </CardContent>
        </Card>
    );
}

function OperadoresTable({ data, title, description, icon: Icon, iconColor }: { data: Operador[], title: string, description: string, icon: React.ElementType, iconColor: string }) {
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${iconColor}`}/>
            <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Operador</TableHead>
              <TableHead className="text-right">Caixas</TableHead>
              <TableHead className="text-right">Produtividade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((operador) => (
              <TableRow key={operador.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted font-semibold text-sm">
                      {getInitials(operador.nome)}
                    </div>
                    <div>
                        <div className="font-medium">{normalizarNome(operador.nome)}</div>
                        <div className="text-xs text-muted-foreground">{operador.turno}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{operador.caixas}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={operador.produtividade > 50 ? "default" : "destructive"} className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 data-[variant=destructive]:bg-red-100 data-[variant=destructive]:text-red-800 data-[variant=destructive]:dark:bg-red-900/50 data-[variant=destructive]:dark:text-red-300">
                    {operador.produtividade.toFixed(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ProdutividadeChart({ data }: { data: HoraAHora[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Produtividade por Hora</CardTitle>
        <CardDescription>Evolução da produtividade ao longo do dia</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
             <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="data" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Area type="monotone" dataKey="produtividade" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProd)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function VolumeChart({ data }: { data: HoraAHora[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Volume por Hora</CardTitle>
        <CardDescription>Caixas, unidades e paletes processados</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="data" fontSize={12} />
            <YAxis fontSize={12} />
             <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Bar dataKey="caixas" fill="#10b981" name="Caixas" />
            <Bar dataKey="unidades" fill="#f59e0b" name="Unidades" />
            <Bar dataKey="paletes" fill="#ef4444" name="Paletes" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function AnomaliasSection({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Anomalias de Pausa
          </CardTitle>
          <CardDescription>Operadores com tempo excessivo de pausa</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Tempo (min)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.anomaliaPausa.map((anomalia) => (
                <TableRow key={anomalia.id}>
                  <TableCell className="font-medium">{normalizarNome(anomalia.nome)}</TableCell>
                  <TableCell>{anomalia.motivoPausa}</TableCell>
                  <TableCell className="text-right font-mono text-orange-500 font-semibold">{anomalia.tempoDePausa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Anomalias de Demanda
          </CardTitle>
          <CardDescription>Operadores com baixo desempenho na demanda atual</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Tempo (min)</TableHead>
                <TableHead className="text-right">Produtividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.anomaliaDemanda.map((anomalia) => (
                <TableRow key={anomalia.id}>
                  <TableCell className="font-medium">{normalizarNome(anomalia.nome)}</TableCell>
                  <TableCell className="text-right font-mono">{anomalia.tempoDemanda}</TableCell>
                  <TableCell className="text-right">
                     <Badge variant={anomalia.produtividade > 30 ? "secondary" : "destructive"}>
                       {anomalia.produtividade.toFixed(1)}
                     </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}


// --- COMPONENTE PRINCIPAL (Refatorado com Abas e Rotação Automática) ---

const TABS = [
  { id: 'desempenhoGeral', label: 'Desempenho Geral', icon: LineChart },
  { id: 'desempenhoIndividual', label: 'Desempenho Individual', icon: Users2 },
  { id: 'pontosAtencao', label: 'Pontos de Atenção', icon: AlertTriangle },
];

const ROTATION_INTERVAL_MS = 15000; // 15 segundos

export default function OverViewPorCentro() {
  const { centerId } = useAuthStore()
  const [dataRegistro, setDataRegistro] = useState(() => new Date().toISOString().split('T')[0])
  const [processo, setProcesso] = useState("SEPARACAO")
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const { data, isLoading, isError } = useOverViewDia(centerId, dataRegistro, processo, {
    query: {
      enabled: !!centerId && !!processo && !!dataRegistro,
      refetchInterval: 50000, // Atualiza os dados a cada 30 segundos
    }
  })
  
  // Efeito para rotacionar as abas automaticamente
  useEffect(() => {
    if (!data || isLoading) return; // Não inicia o timer se não houver dados

    const interval = setInterval(() => {
      setActiveTab(currentTab => {
        const currentIndex = TABS.findIndex(tab => tab.id === currentTab);
        const nextIndex = (currentIndex + 1) % TABS.length;
        return TABS[nextIndex].id;
      });
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [data, isLoading]);


  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-muted/40">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
             </div>
            <CardTitle className="mt-4">Erro ao Carregar Dados</CardTitle>
            <CardDescription>Ocorreu um erro ao buscar os dados do dashboard. Verifique sua conexão e tente novamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header com filtros agrupados - permanece fixo */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                <CalendarDays className="h-7 w-7 text-primary"/>
                Dashboard Operacional
              </h1>
              <p className="text-muted-foreground">Acompanhamento em tempo real das operações do centro.</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="data" className="text-xs">Data</Label>
                <Input id="data" type="date" value={dataRegistro} onChange={(e) => setDataRegistro(e.target.value)} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="processo" className="text-xs">Processo</Label>
                <Select value={processo} onValueChange={setProcesso}>
                  <SelectTrigger id="processo"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEPARACAO">Separação</SelectItem>
                    <SelectItem value="recebimento">Recebimento</SelectItem>
                    <SelectItem value="expedicao">Expedição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <DashboardSkeleton />
      ) : data ? (
        <div className="space-y-6">
          {/* KPIs Principais - permanecem fixos */}
          <StatsCards data={data} />
          
          {/* Conteúdo em Abas com Rotação Automática */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
               {TABS.map(tab => (
                 <TabsTrigger key={tab.id} value={tab.id} className="relative flex gap-2">
                   <tab.icon className="h-4 w-4" />
                   {tab.label}
                   {/* Barra de progresso para a aba ativa */}
                   {activeTab === tab.id && (
                     <div 
                        key={activeTab} // Reinicia a animação quando a aba muda
                        className="absolute bottom-0 left-0 h-0.5 bg-primary animate-progress-bar"
                        style={{animationDuration: `${ROTATION_INTERVAL_MS}ms`}}
                     />
                   )}
                 </TabsTrigger>
               ))}
            </TabsList>
            
            <TabsContent value="desempenhoGeral" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProdutividadeChart data={data.horaAHora} />
                <VolumeChart data={data.horaAHora} />
              </div>
            </TabsContent>
            
            <TabsContent value="desempenhoIndividual" className="mt-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OperadoresTable data={data.topCinco} title="Top 5 Operadores" description="Melhores desempenhos do dia" icon={TrendingUp} iconColor="text-green-500" />
                <OperadoresTable data={data.pioresCinco} title="Piores 5 Operadores" description="Menores desempenhos do dia" icon={TrendingDown} iconColor="text-red-500"/>
              </div>
            </TabsContent>

            <TabsContent value="pontosAtencao" className="mt-6">
              <AnomaliasSection data={data} />
            </TabsContent>
          </Tabs>

        </div>
      ) : (
        <Card className="text-center p-12">
          <CardHeader>
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Nenhum dado disponível</CardTitle>
            <CardDescription>Selecione uma data e processo para visualizar os dados do dashboard.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}