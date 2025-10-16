'use client'
import { useBuscarTransportesPorCentro } from "@/_services/api/hooks/transporte/transporte"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card"
import { Badge } from "@/_shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs"
import { Truck, Package, CheckCircle2, Clock, Pause, AlertCircle, TrendingUp } from "lucide-react"
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
    icon: TrendingUp,
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

const StatusBadge = ({ status, large = false }: { status: StatusPaleteNest, large?: boolean }) => {
  const config = statusConfig[status]
  const Icon = config.icon
  const sizeClasses = large ? 'text-lg py-2 px-4' : 'text-sm'
  const iconSize = large ? 'w-5 h-5' : 'w-3 h-3'
  
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-2 font-semibold ${sizeClasses}`}>
      <Icon className={iconSize} />
      {config.label}
    </Badge>
  )
}

const MetricCard = ({ 
  title, 
  icon: Icon, 
  emProgresso, 
  concluido, 
  total,
  color 
}: { 
  title: string
  icon: any
  emProgresso: number
  concluido: number
  total: number
  color: string
}) => {
  const percentual = total > 0 ? Math.round((concluido / total) * 100) : 0
  
  return (
    <Card className="border-2 hover:shadow-xl transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-3">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600">{emProgresso}</div>
              <div className="text-sm text-blue-700 font-medium mt-1">Em Progresso</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600">{concluido}</div>
              <div className="text-sm text-green-700 font-medium mt-1">Concluídos</div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progresso Geral</span>
              <span className="text-2xl font-bold text-gray-800">{percentual}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const TransporteCardCompact = ({ transporte, etapa }: { 
  transporte: TransporteResponseZodDtoOutput
  etapa: 'separacao' | 'conferencia' | 'carregamento'
}) => {
  const status = transporte[etapa] as StatusPaleteNest
  const isImportant = status === StatusPaleteNest.EM_PROGRESSO || status === StatusPaleteNest.CONCLUIDO
  
  return (
    <Card className={`${isImportant ? 'border-2 shadow-lg' : ''} hover:shadow-xl transition-all`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-xl">{transporte.numeroTransporte}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{transporte.nomeRota}</p>
          </div>
          {transporte.prioridade && transporte.prioridade > 0 && (
            <Badge variant="destructive" className="text-base font-bold py-1 px-3">
              P{transporte.prioridade}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">{transporte.nomeTransportadora}</span>
          <span className="font-mono font-semibold">{transporte.placa}</span>
        </div>

        <StatusBadge status={status} large />

        {transporte.temCortes && (
          <div className="mt-3 flex items-center gap-2 text-orange-600 font-medium bg-orange-50 p-2 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Possui cortes</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const EtapaView = ({ 
  title, 
  icon: Icon,
  transportes, 
  etapa,
  color 
}: { 
  title: string
  icon: any
  transportes: TransporteResponseZodDtoOutput[]
  etapa: 'separacao' | 'conferencia' | 'carregamento'
  color: string
}) => {
  const emProgresso = transportes.filter(t => t[etapa] === StatusPaleteNest.EM_PROGRESSO)
  const concluidos = transportes.filter(t => t[etapa] === StatusPaleteNest.CONCLUIDO)
  const outros = transportes.filter(t => 
    t[etapa] !== StatusPaleteNest.EM_PROGRESSO && 
    t[etapa] !== StatusPaleteNest.CONCLUIDO
  )

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg ${color} bg-opacity-10 border-2`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-lg ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-lg text-gray-600 mt-1">
              {emProgresso.length} em progresso • {concluidos.length} concluídos
            </p>
          </div>
        </div>
      </div>

      {emProgresso.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
            <TrendingUp className="w-6 h-6" />
            Em Progresso ({emProgresso.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {emProgresso.map(t => (
              <TransporteCardCompact key={t.numeroTransporte} transporte={t} etapa={etapa} />
            ))}
          </div>
        </div>
      )}

      {concluidos.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            Concluídos ({concluidos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {concluidos.map(t => (
              <TransporteCardCompact key={t.numeroTransporte} transporte={t} etapa={etapa} />
            ))}
          </div>
        </div>
      )}

      {outros.length > 0 && (
        <details className="group">
          <summary className="text-lg font-semibold text-gray-600 cursor-pointer hover:text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Outros Status ({outros.length})
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {outros.map(t => (
              <TransporteCardCompact key={t.numeroTransporte} transporte={t} etapa={etapa} />
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

const DashboardTV = ({ transportes }: { transportes: TransporteResponseZodDtoOutput[] }) => {
  const calcStats = (etapa: 'separacao' | 'conferencia' | 'carregamento') => {
    return {
      total: transportes.length,
      emProgresso: transportes.filter(t => t[etapa] === StatusPaleteNest.EM_PROGRESSO).length,
      concluido: transportes.filter(t => t[etapa] === StatusPaleteNest.CONCLUIDO).length,
    }
  }

  const separacaoStats = calcStats('separacao')
  const conferenciaStats = calcStats('conferencia')
  const carregamentoStats = calcStats('carregamento')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Separação"
          icon={Package}
          emProgresso={separacaoStats.emProgresso}
          concluido={separacaoStats.concluido}
          total={separacaoStats.total}
          color="bg-purple-500"
        />
        <MetricCard 
          title="Conferência"
          icon={CheckCircle2}
          emProgresso={conferenciaStats.emProgresso}
          concluido={conferenciaStats.concluido}
          total={conferenciaStats.total}
          color="bg-blue-500"
        />
        <MetricCard 
          title="Carregamento"
          icon={Truck}
          emProgresso={carregamentoStats.emProgresso}
          concluido={carregamentoStats.concluido}
          total={carregamentoStats.total}
          color="bg-green-500"
        />
      </div>
    </div>
  )
}

export default function ListarTransportes() {
  const { centerId } = useAuthStore()
  const [dataDia, setDataDia] = useState(new Date('2025-10-15'))
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { data } = useBuscarTransportesPorCentro(centerId, {
    data: dataDia.toISOString()
  })

  const transportes: TransporteResponseZodDtoOutput[] = data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-[1920px] mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 border-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Acompanhamento de Transportes</h1>
            <p className="text-lg text-gray-600 mt-2">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-gray-800 font-mono">
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
            <div className="text-2xl font-semibold text-blue-600 mt-2">
              {transportes.length} transportes
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 h-14 bg-white shadow-md">
            <TabsTrigger value="dashboard" className="text-lg font-semibold">Dashboard</TabsTrigger>
            <TabsTrigger value="separacao" className="text-lg font-semibold">Separação</TabsTrigger>
            <TabsTrigger value="conferencia" className="text-lg font-semibold">Conferência</TabsTrigger>
            <TabsTrigger value="carregamento" className="text-lg font-semibold">Carregamento</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-8">
            <DashboardTV transportes={transportes} />
          </TabsContent>

          <TabsContent value="separacao" className="mt-8">
            <EtapaView 
              title="Separação"
              icon={Package}
              transportes={transportes}
              etapa="separacao"
              color="bg-purple-500"
            />
          </TabsContent>

          <TabsContent value="conferencia" className="mt-8">
            <EtapaView 
              title="Conferência"
              icon={CheckCircle2}
              transportes={transportes}
              etapa="conferencia"
              color="bg-blue-500"
            />
          </TabsContent>

          <TabsContent value="carregamento" className="mt-8">
            <EtapaView 
              title="Carregamento"
              icon={Truck}
              transportes={transportes}
              etapa="carregamento"
              color="bg-green-500"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}