'use client'
import { useBuscarTransportesPorCentro } from "@/_services/api/hooks/transporte/transporte"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/_shared/components/ui/card"
import { Badge } from "@/_shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs"
import { Truck, Package, CheckCircle2, Clock, Pause, AlertCircle, MapPin } from "lucide-react"
import { TransporteResponseZodDtoOutput } from "@/_services/api/model"

enum StatusPaleteNest {
  NAO_INICIADO = 'NAO_INICIADO',
  EM_PROGRESSO = 'EM_PROGRESSO',
  CONCLUIDO = 'CONCLUIDO',
  EM_PAUSA = 'EM_PAUSA',
}

const statusConfig = {
  [StatusPaleteNest.NAO_INICIADO]: {
    label: 'Não Iniciado',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: Clock,
  },
  [StatusPaleteNest.EM_PROGRESSO]: {
    label: 'Em Progresso',
    color: 'bg-blue-500 text-white border-blue-600',
    icon: Package,
  },
  [StatusPaleteNest.CONCLUIDO]: {
    label: 'Concluído',
    color: 'bg-green-500 text-white border-green-600',
    icon: CheckCircle2,
  },
  [StatusPaleteNest.EM_PAUSA]: {
    label: 'Em Pausa',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Pause,
  },
}

// StatusBadge super compacto
const StatusBadge = ({ status }: { status: StatusPaleteNest }) => {
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1 font-semibold text-xl py-0 px-1.5 h-4`}>
      <Icon className="w-2.5 h-2.5" />
    </Badge>
  )
}

// Card ultra compacto para TV
const KanbanTransporteCard = ({ transporte, etapa }: { 
  transporte: TransporteResponseZodDtoOutput
  etapa: 'separacao' | 'conferencia' | 'carregamento'
}) => {
  const status = transporte[etapa] as StatusPaleteNest
  const isEmProgresso = status === StatusPaleteNest.EM_PROGRESSO
  const isConcluido = status === StatusPaleteNest.CONCLUIDO

  const getBorderColor = () => {
    if (isEmProgresso) return 'border-l border-l-blue-500'
    if (isConcluido) return 'border-l border-l-green-500'
    return 'border-l border-l-gray-300'
  }

  const getPriorityColor = () => {
    if (!transporte.prioridade) return 'bg-gray-400'
    if (transporte.prioridade === 1) return 'bg-red-500'
    if (transporte.prioridade === 2) return 'bg-orange-500'
    return 'bg-yellow-500'
  }

  const getStatusColor = () => {
    if (isConcluido) return 'bg-green-50'
    if (isEmProgresso) return 'bg-blue-50'
    return 'bg-white'
  }

  return (
    <Card className={`shadow-xs hover:shadow-sm transition-all duration-150 ${getBorderColor()} ${getStatusColor()} group border p-1 mt-1.5`}>
      <CardContent className="px-1">
        {/* Primeira linha: Número e Status */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor()} flex-shrink-0`} />
            <Truck className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="font-bold text-xl text-gray-800 truncate">{transporte.numeroTransporte}</span>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {transporte.prioridade && transporte.prioridade > 0 && (
              <Badge className={`${getPriorityColor()} text-white text-sm font-bold py-0 px-1 h-3 min-w-3 flex items-center justify-center`}>
                {transporte.prioridade}
              </Badge>
            )}
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Segunda linha: Rota e Placa */}
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono font-semibold text-gray-800 text-xl bg-gray-100 px-1 py-0.5 rounded flex-shrink-0 ml-1">
            {transporte.placa}
          </span>
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <span className="text-xl text-gray-600 truncate">{transporte.nomeRota}</span>
          </div>
        </div>

        {/* Terceira linha: Transportadora e Cortes */}
        <div className="flex items-center justify-between">
          <span className="text-xl text-gray-500 truncate pr-1">{transporte.nomeTransportadora}</span>
          {transporte.temCortes && (
            <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Coluna do Kanban compacta
const KanbanColumn = ({ 
  title, 
  icon: Icon, 
  transportes, 
  etapa,
  color,
  count 
}: { 
  title: string
  icon: any
  transportes: TransporteResponseZodDtoOutput[]
  etapa: 'separacao' | 'conferencia' | 'carregamento'
  color: string
  count: number
}) => {
  return (
    <div className="flex-1 min-w-64 bg-gray-50 rounded border border-gray-200">
      {/* Header super compacto */}
      <div className={`p-1 rounded-t border-b ${color} bg-opacity-10`}>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${color}`}>
            <Icon className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-2xl text-gray-800">{title}</h3>
          </div>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs ${color}`}>
            {count}
          </div>
        </div>
      </div>

      {/* Container de cards com scroll otimizado */}
      <div className="p-1 max-h-[calc(100vh-180px)] overflow-y-auto">
        {transportes.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            <Icon className="w-6 h-6 mx-auto mb-1 opacity-50" />
            <p className="text-xl">Nenhum transporte</p>
          </div>
        ) : (
          transportes.map(transporte => (
            <KanbanTransporteCard 
              key={transporte.numeroTransporte} 
              transporte={transporte} 
              etapa={etapa} 
            />
          ))
        )}
      </div>
    </div>
  )
}

// Funções de filtro
const filtrarSeparacao = (transportes: TransporteResponseZodDtoOutput[]) => {
  return transportes.filter(t => t.separacao === StatusPaleteNest.EM_PROGRESSO)
}

const filtrarConferencia = (transportes: TransporteResponseZodDtoOutput[]) => {
  return transportes.filter(t => 
    (t.conferencia === StatusPaleteNest.NAO_INICIADO && t.separacao === StatusPaleteNest.CONCLUIDO) ||
    t.conferencia === StatusPaleteNest.EM_PROGRESSO
  )
}

const filtrarCarregamento = (transportes: TransporteResponseZodDtoOutput[]) => {
  return transportes.filter(t => 
    (t.carregamento === StatusPaleteNest.NAO_INICIADO && t.conferencia === StatusPaleteNest.CONCLUIDO) ||
    t.carregamento === StatusPaleteNest.EM_PROGRESSO
  )
}

// Visão Kanban principal
const KanbanView = ({ transportes }: { transportes: TransporteResponseZodDtoOutput[] }) => {
  const transportesSeparacao = filtrarSeparacao(transportes)
  const transportesConferencia = filtrarConferencia(transportes)
  const transportesCarregamento = filtrarCarregamento(transportes)

  return (
    <div className="space-y-3">
      {/* Colunas do Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        <KanbanColumn
          title="Separação"
          icon={Package}
          transportes={transportesSeparacao}
          etapa="separacao"
          color="bg-purple-500"
          count={transportesSeparacao.length}
        />
        
        <KanbanColumn
          title="Conferência"
          icon={CheckCircle2}
          transportes={transportesConferencia}
          etapa="conferencia"
          color="bg-blue-500"
          count={transportesConferencia.length}
        />
        
        <KanbanColumn
          title="Carregamento"
          icon={Truck}
          transportes={transportesCarregamento}
          etapa="carregamento"
          color="bg-green-500"
          count={transportesCarregamento.length}
        />
      </div>
    </div>
  )
}

// Header compacto para TV
const TVHeader = ({ currentTime, transportesCount }: { currentTime: Date, transportesCount: number }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded shadow-sm p-3 border">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Transportes</h1>
        <p className="text-xs text-gray-600">
          {currentTime.toLocaleDateString('pt-BR')}
        </p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-800 font-mono">
          {currentTime.toLocaleTimeString('pt-BR')}
        </div>
      </div>
    </div>
  )
}

// Componente principal
export default function ListarTransportes() {
  const { centerId } = useAuthStore()
  const [dataDia, setDataDia] = useState(new Date('2025-10-17'))
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { data } = useBuscarTransportesPorCentro(centerId, {
    data: dataDia.toISOString(),
  },{
    query:{
      refetchInterval: 15000
    }
  })

  const transportes: TransporteResponseZodDtoOutput[] = data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3">
      <div className="max-w-[1920px] mx-auto space-y-3">
        <TVHeader currentTime={currentTime} transportesCount={transportes.length} />
        
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-10 bg-white shadow-xs">
            <TabsTrigger value="kanban" className="text-xs font-semibold">KANBAN</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs font-semibold">DASH</TabsTrigger>
            <TabsTrigger value="tabela" className="text-xs font-semibold">TABELA</TabsTrigger>
            <TabsTrigger value="detalhes" className="text-xs font-semibold">DETALHES</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-3">
            <KanbanView transportes={transportes} />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-3">
            <div className="text-center py-6 text-gray-500 text-sm">
              Dashboard em desenvolvimento
            </div>
          </TabsContent>

          <TabsContent value="tabela" className="mt-3">
            <div className="text-center py-6 text-gray-500 text-sm">
              Tabela em desenvolvimento
            </div>
          </TabsContent>

          <TabsContent value="detalhes" className="mt-3">
            <div className="text-center py-6 text-gray-500 text-sm">
              Detalhes em desenvolvimento
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}