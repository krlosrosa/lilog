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
import { Calendar, Users, PlayCircle, PauseCircle, CheckCircle, AlertTriangle, Package, Box, MapPin, Target, CalendarDays, TrendingUp, TrendingDown, Tv, Clock, RotateCcw } from 'lucide-react'
import { Skeleton } from "@/_shared/components/ui/skeleton"
import { normalizarNome } from "@/_shared/utils/formatNome"

// --- TIPOS ---
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

// --- CONFIGURAÇÃO DAS TABS CORRIGIDA ---
const TABS_CONFIG = [
  { id: 'overview', label: 'Visão Geral', duration: 15000 },
  { id: 'performance', label: 'Performance', duration: 12000 },
  { id: 'anomalies', label: 'Anomalias', duration: 10000 },
  { id: 'analytics', label: 'Analytics', duration: 12000 },
]

// --- COMPONENTES VISUAIS (mantidos iguais) ---

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`flex items-center justify-center h-7 w-7 rounded-full ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.live && (
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
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
    : '0'

  return (
    <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-teal-200 dark:border-teal-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">Caixas/Demanda</CardTitle>
        <div className="flex items-center justify-center h-7 w-7 rounded-full text-teal-600 bg-teal-100 dark:bg-teal-900/50 dark:text-teal-300">
          <Target className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{caixasPorDemanda}</div>
        <p className="text-xs text-muted-foreground mt-1">Média por demanda</p>
      </CardContent>
    </Card>
  )
}

function OperadoresTable({ data, title, description, highlight = false }: { data: Operador[], title: string, description: string, highlight?: boolean }) {
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Card className={`h-full ${highlight ? 'border-2 border-green-200 dark:border-green-800' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {highlight ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
          {title}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4">Operador</TableHead>
              <TableHead className="py-2 px-4 text-right">Caixas</TableHead>
              <TableHead className="py-2 px-4 text-right">Prod.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((operador) => (
              <TableRow key={operador.id} className="hover:bg-muted/50">
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted font-semibold text-xs border">
                      {getInitials(operador.nome)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{normalizarNome(operador.nome)}</div>
                      <div className="text-xs text-muted-foreground">{operador.turno}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4 text-right font-mono font-semibold">{operador.caixas}</TableCell>
                <TableCell className="py-3 px-4 text-right">
                  <Badge 
                    variant={operador.produtividade > 50 ? "default" : "destructive"} 
                    className={`text-xs font-semibold ${
                      operador.produtividade > 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                      operador.produtividade > 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}
                  >
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Produtividade por Hora</CardTitle>
        <CardDescription className="text-sm">Evolução ao longo do dia</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="data" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                fontSize: "12px"
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Volume por Hora</CardTitle>
        <CardDescription className="text-sm">Caixas, unidades e paletes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="data" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                fontSize: "12px"
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="caixas" fill="#10b981" name="Caixas" radius={[2, 2, 0, 0]} />
            <Bar dataKey="unidades" fill="#f59e0b" name="Unidades" radius={[2, 2, 0, 0]} />
            <Bar dataKey="paletes" fill="#ef4444" name="Paletes" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function AnomaliasSection({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Anomalias de Pausa
          </CardTitle>
          <CardDescription className="text-sm">Tempo excessivo de pausa</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 px-4">Operador</TableHead>
                <TableHead className="py-2 px-4">Motivo</TableHead>
                <TableHead className="py-2 px-4 text-right">Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.anomaliaPausa.map((anomalia) => (
                <TableRow key={anomalia.id}>
                  <TableCell className="py-2 px-4 font-medium text-sm">{normalizarNome(anomalia.nome)}</TableCell>
                  <TableCell className="py-2 px-4 text-sm">{anomalia.motivoPausa}</TableCell>
                  <TableCell className="py-2 px-4 text-right font-mono font-semibold text-orange-500">
                    {anomalia.tempoDePausa}min
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Anomalias de Demanda
          </CardTitle>
          <CardDescription className="text-sm">Baixo desempenho atual</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 px-4">Operador</TableHead>
                <TableHead className="py-2 px-4 text-right">Tempo</TableHead>
                <TableHead className="py-2 px-4 text-right">Prod.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.anomaliaDemanda.map((anomalia) => (
                <TableRow key={anomalia.id}>
                  <TableCell className="py-2 px-4 font-medium text-sm">{normalizarNome(anomalia.nome)}</TableCell>
                  <TableCell className="py-2 px-4 text-right font-mono text-sm">{anomalia.tempoDemanda}min</TableCell>
                  <TableCell className="py-2 px-4 text-right">
                    <Badge variant="destructive" className="text-xs font-semibold">
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

function RotationIndicator({ currentTab, totalTabs, timeLeft }: { currentTab: number, totalTabs: number, timeLeft: number }) {
  const currentTabConfig = TABS_CONFIG[currentTab]
  const progress = (timeLeft / currentTabConfig.duration) * 100
  
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <div className="flex items-center gap-2">
        <span>{currentTabConfig.label} ({currentTab + 1}/{totalTabs})</span>
        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{Math.ceil(timeLeft / 1000)}s</span>
      </div>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL CORRIGIDO ---
export default function OverViewPorCentro() {
  const { centerId } = useAuthStore()
  const [dataRegistro, setDataRegistro] = useState(() => new Date().toISOString().split('T')[0])
  const [processo, setProcesso] = useState("SEPARACAO")
  const [currentTab, setCurrentTab] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TABS_CONFIG[0].duration)
  const [isPaused, setIsPaused] = useState(false)

  const { data, isLoading, isError } = useOverViewDia(centerId, dataRegistro, processo, {
    query: {
      enabled: !!centerId && !!processo && !!dataRegistro,
      refetchInterval: 30000,
    }
  })

  // Controle da rotatividade automática das tabs - CORRIGIDO
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          const nextTab = (currentTab + 1) % TABS_CONFIG.length
          setCurrentTab(nextTab)
          return TABS_CONFIG[nextTab].duration
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentTab, isPaused]) // Adicionado currentTab como dependência

  // Reset do timer quando mudar de tab manualmente - CORRIGIDO
  const handleTabChange = (value: string) => {
    const newTabIndex = TABS_CONFIG.findIndex(tab => tab.id === value)
    if (newTabIndex !== -1) {
      setCurrentTab(newTabIndex)
      setTimeLeft(TABS_CONFIG[newTabIndex].duration)
    }
  }

  const resetRotation = () => {
    setCurrentTab(0)
    setTimeLeft(TABS_CONFIG[0].duration)
    setIsPaused(false)
  }

  // Função para forçar mudança de tab (para debug)
  const forceTabChange = (tabIndex: number) => {
    if (tabIndex >= 0 && tabIndex < TABS_CONFIG.length) {
      setCurrentTab(tabIndex)
      setTimeLeft(TABS_CONFIG[tabIndex].duration)
    }
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="w-full max-w-md text-center border-2 border-red-200">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-xl">Erro ao Carregar Dados</CardTitle>
            <CardDescription>Verifique sua conexão e tente novamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} size="lg">Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com controles de debug */}
        <Card className="bg-background/80 backdrop-blur-sm border-2">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Tv className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Dashboard Operacional</h1>
                  <p className="text-muted-foreground text-sm">
                    Modo TV - Tab atual: {TABS_CONFIG[currentTab]?.label} 
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="data" className="text-xs">Data</Label>
                  <Input 
                    id="data" 
                    type="date" 
                    value={dataRegistro} 
                    onChange={(e) => setDataRegistro(e.target.value)}
                    className="h-9 w-32"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="processo" className="text-xs">Processo</Label>
                  <Select value={processo} onValueChange={setProcesso}>
                    <SelectTrigger id="processo" className="h-9 w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEPARACAO">Separação</SelectItem>
                      <SelectItem value="RECEBIMENTO">Recebimento</SelectItem>
                      <SelectItem value="EXPEDICAO">Expedição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <RotationIndicator 
                currentTab={currentTab} 
                totalTabs={TABS_CONFIG.length} 
                timeLeft={timeLeft} 
              />
              <div className="flex items-center gap-2">
                <Button
                  variant={isPaused ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? 'Retomar' : 'Pausar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetRotation}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Debug controls - pode remover depois */}
          <CardContent className="pt-0">
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => forceTabChange(0)}>Visão Geral</Button>
              <Button variant="outline" size="sm" onClick={() => forceTabChange(1)}>Performance</Button>
              <Button variant="outline" size="sm" onClick={() => forceTabChange(2)}>Anomalias</Button>
              <Button variant="outline" size="sm" onClick={() => forceTabChange(3)}>Analytics</Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <DashboardSkeleton />
        ) : data ? (
          <Tabs value={TABS_CONFIG[currentTab]?.id || 'overview'} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12">
              {TABS_CONFIG.map((tab, index) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab 1: Visão Geral */}
            <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500">
              <StatsCards data={data} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProdutividadeChart data={data.horaAHora} />
                <VolumeChart data={data.horaAHora} />
              </div>
            </TabsContent>

            {/* Tab 2: Performance */}
            <TabsContent value="performance" className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OperadoresTable 
                  data={data.topCinco} 
                  title="Top 5 Operadores" 
                  description="Melhores desempenhos do dia" 
                  highlight={true}
                />
                <OperadoresTable 
                  data={data.pioresCinco} 
                  title="Piores 5 Operadores" 
                  description="Menores desempenhos do dia" 
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProdutividadeChart data={data.horaAHora} />
                <VolumeChart data={data.horaAHora} />
              </div>
            </TabsContent>

            {/* Tab 3: Anomalias */}
            <TabsContent value="anomalies" className="space-y-6 animate-in fade-in duration-500">
              <AnomaliasSection data={data} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OperadoresTable 
                  data={data.pioresCinco} 
                  title="Operadores com Baixa Performance" 
                  description="Foco para melhoria" 
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumo de Anomalias</CardTitle>
                    <CardDescription>Visão consolidada dos problemas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-orange-500">{data.anomaliaPausa.length}</div>
                        <div className="text-sm text-muted-foreground">Pausas Excessivas</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-red-500">{data.anomaliaDemanda.length}</div>
                        <div className="text-sm text-muted-foreground">Baixa Produtividade</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 4: Analytics */}
            <TabsContent value="analytics" className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProdutividadeChart data={data.horaAHora} />
                <VolumeChart data={data.horaAHora} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OperadoresTable 
                  data={data.topCinco} 
                  title="Top Performers" 
                  description="Operadores de destaque" 
                  highlight={true}
                />
                <OperadoresTable 
                  data={data.pioresCinco} 
                  title="Necessitam Acompanhamento" 
                  description="Oportunidades de melhoria" 
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="text-center p-12 border-2">
            <CardHeader>
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="text-xl">Nenhum dado disponível</CardTitle>
              <CardDescription>Selecione uma data e processo para visualizar os dados.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}