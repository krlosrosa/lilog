'use client'

import { useOverViewDia } from "@/_services/api/hooks/dashboard/dashboard"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card"
import { Badge } from "@/_shared/components/ui/badge"
import { Button } from "@/_shared/components/ui/button"
import { Input } from "@/_shared/components/ui/input"
import { Label } from "@/_shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_shared/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Calendar, Users, PlayCircle, PauseCircle, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Package, Box, MapPin } from 'lucide-react'
import { Skeleton } from "@/_shared/components/ui/skeleton"
import { normalizarNome } from "@/_shared/utils/formatNome"

// Tipos baseados na estrutura da API
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

// Componente de loading
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  )
}

// Componente de estatísticas principais
function StatsCards({ data }: { data: DashboardData }) {
  const stats = [
    {
      title: "Total Demandas",
      value: data.overView.totalDemandas,
      icon: Users,
      description: "Demandas totais do dia",
      color: "bg-blue-500"
    },
    {
      title: "Em Andamento",
      value: data.overView.totalEmAndamento,
      icon: PlayCircle,
      description: "Demandas em execução",
      color: "bg-yellow-500"
    },
    {
      title: "Em Pausa",
      value: data.overView.totalEmpausa,
      icon: PauseCircle,
      description: "Demandas pausadas",
      color: "bg-orange-500"
    },
    {
      title: "Finalizadas",
      value: data.overView.totalFinalizado,
      icon: CheckCircle,
      description: "Demandas concluídas",
      color: "bg-green-500"
    },
    {
      title: "Total Caixas",
      value: data.overView.totalCaixas,
      icon: Package,
      description: "Caixas processadas",
      color: "bg-indigo-500"
    },
    {
      title: "Total Unidades",
      value: data.overView.totalUnidades,
      icon: Box,
      description: "Unidades movimentadas",
      color: "bg-purple-500"
    },
    {
      title: "Média Endereços",
      value: data.overView.mediaEnderecosVisitados,
      icon: MapPin,
      description: "Endereços visitados (média)",
      color: "bg-cyan-500",
      isDecimal: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.isDecimal ? stat.value.toFixed(1) : stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
          <div className={`absolute bottom-0 left-0 w-full h-1 ${stat.color}`} />
        </Card>
      ))}
    </div>
  )
}

// Componente adicional para métricas de produtividade
function MetricasProdutividade({ data }: { data: DashboardData }) {
  const metricas = [
    {
      titulo: "Eficiência de Separação",
      valor: data.overView.totalCaixas > 0 ? 
        ((data.overView.totalFinalizado / data.overView.totalDemandas) * 100).toFixed(1) + '%' : '0%',
      descricao: "Demandas finalizadas vs totais",
      tendencia: "up"
    },
    {
      titulo: "Caixas por Demanda",
      valor: data.overView.totalFinalizado > 0 ? 
        (data.overView.totalCaixas / data.overView.totalFinalizado).toFixed(1) : '0',
      descricao: "Média de caixas por demanda finalizada",
      tendencia: "neutral"
    },
    {
      titulo: "Taxa de Atividade",
      valor: data.overView.totalDemandas > 0 ? 
        (((data.overView.totalEmAndamento + data.overView.totalFinalizado) / data.overView.totalDemandas) * 100).toFixed(1) + '%' : '0%',
      descricao: "Demandas ativas vs totais",
      tendencia: "up"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metricas.map((metrica, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrica.valor}</div>
              {metrica.tendencia === "up" && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
              {metrica.tendencia === "down" && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              {metrica.tendencia === "neutral" && (
                <div className="h-4 w-4 text-gray-400">●</div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metrica.descricao}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente para tabela de operadores
function OperadoresTable({ 
  data, 
  title, 
  description 
}: { 
  data: Operador[] 
  title: string 
  description: string 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead className="text-right">Caixas</TableHead>
              <TableHead className="text-right">Paletes</TableHead>
              <TableHead className="text-right">Unidades</TableHead>
              <TableHead className="text-right">Produtividade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((operador) => (
              <TableRow key={operador.id}>
                <TableCell className="font-medium">{normalizarNome(operador.nome)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{operador.turno}</Badge>
                </TableCell>
                <TableCell className="text-right">{operador.caixas}</TableCell>
                <TableCell className="text-right">{operador.paletes}</TableCell>
                <TableCell className="text-right">{operador.unidades}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {operador.produtividade > 50 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    {operador.produtividade.toFixed(2)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Componente para gráfico de produtividade por hora
function ProdutividadeChart({ data }: { data: HoraAHora[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtividade por Hora</CardTitle>
        <CardDescription>Evolução da produtividade ao longo do dia</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="produtividade" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Componente para volume por hora
function VolumeChart({ data }: { data: HoraAHora[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume por Hora</CardTitle>
        <CardDescription>Caixas, unidades e paletes processados</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="caixas" fill="#10b981" />
            <Bar dataKey="unidades" fill="#f59e0b" />
            <Bar dataKey="paletes" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Componente para anomalias
function AnomaliasSection({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Anomalias de Pausa */}
      <Card>
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
                <TableHead>Turno</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Tempo (min)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.anomaliaPausa.map((anomalia) => (
                <TableRow key={anomalia.id}>
                  <TableCell className="font-medium">{normalizarNome(anomalia.nome)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{anomalia.turno}</Badge>
                  </TableCell>
                  <TableCell>{anomalia.motivoPausa}</TableCell>
                  <TableCell className="text-right">{anomalia.tempoDePausa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Anomalias de Demanda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Anomalias de Demanda
          </CardTitle>
          <CardDescription>Operadores com baixo desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead className="text-right">Tempo</TableHead>
                <TableHead className="text-right">Produtividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.anomaliaDemanda.map((anomalia) => (
                <TableRow key={anomalia.id}>
                  <TableCell className="font-medium">{normalizarNome(anomalia.nome)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{anomalia.turno}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{anomalia.tempoDemanda}min</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={anomalia.produtividade > 30 ? "secondary" : "destructive"}>
                      {anomalia.produtividade.toFixed(2)}
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

export default function OverViewPorCentro() {
  const { centerId } = useAuthStore()
  const [dataRegistro, setDataRegistro] = useState(() => {
    // Data atual no formato YYYY-MM-DD
    return new Date().toISOString().split('T')[0]
  })
  const [processo, setProcesso] = useState("separacao") // Valor padrão

  const { data, isLoading, isError } = useOverViewDia(centerId, dataRegistro, processo, {
    query: {
      enabled: !!centerId && !!processo && !!dataRegistro
    }
  })

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Erro ao carregar dados
            </CardTitle>
            <CardDescription>
              Ocorreu um erro ao buscar os dados do dashboard. Tente novamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Operacional</h1>
          <p className="text-muted-foreground">
            Acompanhamento em tempo real das operações do centro
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              value={dataRegistro}
              onChange={(e) => setDataRegistro(e.target.value)}
              className="w-full sm:w-40"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="processo">Processo</Label>
            <Select value={processo} onValueChange={setProcesso}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Selecione o processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEPARACAO">Separação</SelectItem>
                <SelectItem value="recebimento">Recebimento</SelectItem>
                <SelectItem value="expedicao">Expedição</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : data ? (
        <>
          {/* Cards de estatísticas */}
          <StatsCards data={data} />
          <MetricasProdutividade data={data} />
          {/* Tabs para diferentes visualizações */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="anomalias">Anomalias</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProdutividadeChart data={data.horaAHora} />
                <VolumeChart data={data.horaAHora} />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OperadoresTable 
                  data={data.topCinco} 
                  title="Top 5 Operadores"
                  description="Operadores com melhor desempenho"
                />
                <OperadoresTable 
                  data={data.pioresCinco} 
                  title="Piores 5 Operadores"
                  description="Operadores com menor desempenho"
                />
              </div>
            </TabsContent>

            <TabsContent value="anomalias" className="space-y-6">
              <AnomaliasSection data={data} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="text-center p-12">
          <CardHeader>
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Nenhum dado disponível</CardTitle>
            <CardDescription>
              Selecione uma data e processo para visualizar os dados do dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}