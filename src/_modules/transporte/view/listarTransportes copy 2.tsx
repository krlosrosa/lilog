'use client'
import { useBuscarTransportesPorCentro } from "@/_services/api/hooks/transporte/transporte"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card"
import { Badge } from "@/_shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs"
import { Truck, Package, CheckCircle2, Clock, Pause, AlertCircle, Play, TrendingUp } from "lucide-react"
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
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  },
  [StatusPaleteNest.EM_PROGRESSO]: {
    label: 'Em Progresso',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Play,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  [StatusPaleteNest.CONCLUIDO]: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  [StatusPaleteNest.EM_PAUSA]: {
    label: 'Em Pausa',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Pause,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  },
}

const StatusBadge = ({ status }: { status: StatusPaleteNest }) => {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1 text-sm font-semibold`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </Badge>
  )
}

// Componente de card otimizado para TV
const TransporteCardTV = ({ transporte }: { transporte: TransporteResponseZodDtoOutput }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-3">
              <Truck className="w-6 h-6" />
              <span className="font-bold">{transporte.numeroTransporte}</span>
            </CardTitle>
            <p className="text-base text-gray-600 mt-2 font-medium">{transporte.nomeRota}</p>
          </div>
          {transporte.prioridade && transporte.prioridade > 0 && (
            <Badge variant="destructive" className="ml-2 text-sm px-3 py-1 font-bold">
              P{transporte.prioridade}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-base">
          <div>
            <span className="text-gray-600 font-medium">Transportadora:</span>
            <p className="font-semibold">{transporte.nomeTransportadora}</p>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Placa:</span>
            <p className="font-semibold">{transporte.placa}</p>
          </div>
        </div>

        {transporte.temCortes && (
          <div className="flex items-center gap-2 text-orange-600 text-base font-semibold bg-orange-50 p-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>Possui cortes</span>
          </div>
        )}

        <div className="space-y-3 pt-3 border-t-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Separação</span>
            <StatusBadge status={transporte.separacao as StatusPaleteNest} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Conferência</span>
            <StatusBadge status={transporte.conferencia as StatusPaleteNest} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Carregamento</span>
            <StatusBadge status={transporte.carregamento as StatusPaleteNest} />
          </div>
        </div>

        {transporte.obs && (
          <div className="pt-3 border-t-2">
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{transporte.obs}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Coluna Kanban otimizada para TV
const KanbanColumnTV = ({ 
  title, 
  transportes, 
  etapa 
}: { 
  title: string
  transportes: TransporteResponseZodDtoOutput[]
  etapa: 'separacao' | 'conferencia' | 'carregamento'
}) => {
  const getTransportesByStatus = (status: StatusPaleteNest) => 
    transportes.filter(t => t[etapa] === status)

  const emProgresso = getTransportesByStatus(StatusPaleteNest.EM_PROGRESSO)
  const concluido = getTransportesByStatus(StatusPaleteNest.CONCLUIDO)
  const emPausa = getTransportesByStatus(StatusPaleteNest.EM_PAUSA)
  const naoIniciado = getTransportesByStatus(StatusPaleteNest.NAO_INICIADO)

  return (
    <div className="flex-1 min-w-[350px] bg-white rounded-xl p-4 border-2 border-gray-200">
      <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-800">
        <Package className="w-6 h-6" />
        {title}
        <Badge variant="secondary" className="ml-2 text-sm">
          {transportes.length}
        </Badge>
      </h3>
      
      <div className="space-y-4">
        {/* EM PROGRESSO - PRIORIDADE MÁXIMA */}
        {emProgresso.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
              <StatusBadge status={StatusPaleteNest.EM_PROGRESSO} />
              <span className="text-lg font-bold text-blue-800">({emProgresso.length})</span>
            </div>
            <div className="space-y-3">
              {emProgresso.map(t => (
                <Card key={t.numeroTransporte} className="p-4 hover:shadow-lg transition-all border-2 border-blue-200 bg-blue-25 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-lg">{t.numeroTransporte}</p>
                      <p className="text-sm text-gray-600">{t.nomeRota}</p>
                    </div>
                    {t.prioridade && t.prioridade > 0 && (
                      <Badge variant="destructive" className="text-sm font-bold">P{t.prioridade}</Badge>
                    )}
                  </div>
                  {t.temCortes && (
                    <div className="mt-2 text-sm text-orange-600 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      Possui cortes
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CONCLUÍDO - SEGUNDA PRIORIDADE */}
        {concluido.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
              <StatusBadge status={StatusPaleteNest.CONCLUIDO} />
              <span className="text-lg font-bold text-green-800">({concluido.length})</span>
            </div>
            <div className="space-y-3">
              {concluido.map(t => (
                <Card key={t.numeroTransporte} className="p-3 hover:shadow-md transition-all border-2 border-green-200 bg-green-25 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{t.numeroTransporte}</p>
                      <p className="text-xs text-gray-500">{t.nomeRota}</p>
                    </div>
                    {t.prioridade && t.prioridade > 0 && (
                      <Badge variant="destructive" className="text-xs">P{t.prioridade}</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* EM PAUSA */}
        {emPausa.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={StatusPaleteNest.EM_PAUSA} />
              <span className="text-sm text-gray-600">({emPausa.length})</span>
            </div>
            <div className="space-y-2">
              {emPausa.map(t => (
                <Card key={t.numeroTransporte} className="p-2 hover:shadow-sm transition-all cursor-pointer opacity-80">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{t.numeroTransporte}</p>
                      <p className="text-xs text-gray-500">{t.nomeRota}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* NÃO INICIADO */}
        {naoIniciado.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={StatusPaleteNest.NAO_INICIADO} />
              <span className="text-sm text-gray-600">({naoIniciado.length})</span>
            </div>
            <div className="space-y-2">
              {naoIniciado.map(t => (
                <Card key={t.numeroTransporte} className="p-2 hover:shadow-sm transition-all cursor-pointer opacity-70">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{t.numeroTransporte}</p>
                      <p className="text-xs text-gray-500">{t.nomeRota}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Overview otimizado para TV
const OverviewTV = ({ transportes }: { transportes: TransporteResponseZodDtoOutput[] }) => {
  const calcStats = (etapa: 'separacao' | 'conferencia' | 'carregamento') => {
    return {
      total: transportes.length,
      naoIniciado: transportes.filter(t => t[etapa] === StatusPaleteNest.NAO_INICIADO).length,
      emProgresso: transportes.filter(t => t[etapa] === StatusPaleteNest.EM_PROGRESSO).length,
      concluido: transportes.filter(t => t[etapa] === StatusPaleteNest.CONCLUIDO).length,
      emPausa: transportes.filter(t => t[etapa] === StatusPaleteNest.EM_PAUSA).length,
    }
  }

  const separacaoStats = calcStats('separacao')
  const conferenciaStats = calcStats('conferencia')
  const carregamentoStats = calcStats('carregamento')

  // Foca nos transportes em progresso e concluídos
  const transportesImportantes = transportes.filter(t => 
    t.separacao === StatusPaleteNest.EM_PROGRESSO || 
    t.conferencia === StatusPaleteNest.EM_PROGRESSO || 
    t.carregamento === StatusPaleteNest.EM_PROGRESSO ||
    t.separacao === StatusPaleteNest.CONCLUIDO || 
    t.conferencia === StatusPaleteNest.CONCLUIDO || 
    t.carregamento === StatusPaleteNest.CONCLUIDO
  )

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-blue-800">
              <Package className="w-5 h-5" />
              Separação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-600 font-medium">Em Progresso:</span>
              <span className="font-bold text-blue-600 text-lg">{separacaoStats.emProgresso}</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-600 font-medium">Concluído:</span>
              <span className="font-bold text-green-600 text-lg">{separacaoStats.concluido}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center bg-gray-100 p-2 rounded">
                <div className="text-gray-600">Não Iniciado</div>
                <div className="font-semibold">{separacaoStats.naoIniciado}</div>
              </div>
              <div className="text-center bg-yellow-50 p-2 rounded">
                <div className="text-yellow-700">Em Pausa</div>
                <div className="font-semibold">{separacaoStats.emPausa}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-green-800">
              <CheckCircle2 className="w-5 h-5" />
              Conferência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-600 font-medium">Em Progresso:</span>
              <span className="font-bold text-blue-600 text-lg">{conferenciaStats.emProgresso}</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-600 font-medium">Concluído:</span>
              <span className="font-bold text-green-600 text-lg">{conferenciaStats.concluido}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center bg-gray-100 p-2 rounded">
                <div className="text-gray-600">Não Iniciado</div>
                <div className="font-semibold">{conferenciaStats.naoIniciado}</div>
              </div>
              <div className="text-center bg-yellow-50 p-2 rounded">
                <div className="text-yellow-700">Em Pausa</div>
                <div className="font-semibold">{conferenciaStats.emPausa}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3 text-purple-800">
              <Truck className="w-5 h-5" />
              Carregamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-600 font-medium">Em Progresso:</span>
              <span className="font-bold text-blue-600 text-lg">{carregamentoStats.emProgresso}</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-600 font-medium">Concluído:</span>
              <span className="font-bold text-green-600 text-lg">{carregamentoStats.concluido}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center bg-gray-100 p-2 rounded">
                <div className="text-gray-600">Não Iniciado</div>
                <div className="font-semibold">{carregamentoStats.naoIniciado}</div>
              </div>
              <div className="text-center bg-yellow-50 p-2 rounded">
                <div className="text-yellow-700">Em Pausa</div>
                <div className="font-semibold">{carregamentoStats.emPausa}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transportes em Destaque */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Transportes em Andamento e Finalizados
          <Badge variant="secondary" className="ml-2">
            {transportesImportantes.length}
          </Badge>
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {transportesImportantes.map(t => (
            <TransporteCardTV key={t.numeroTransporte} transporte={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ListarTransportes() {
  const { centerId } = useAuthStore()
  const [dataDia, setDataDia] = useState(new Date('2025-10-15'))
  const [currentTime, setCurrentTime] = useState(new Date())

  // Atualiza o horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const { data } = useBuscarTransportesPorCentro(centerId, {
    data: dataDia.toISOString()
  })

  const transportes: TransporteResponseZodDtoOutput[] = data || []

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-25 min-h-screen">
      {/* Header com informações importantes */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Acompanhamento de Transportes</h1>
          <p className="text-lg text-gray-600 mt-1">
            Centro: {centerId} • {currentTime.toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-gray-700">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-lg">{transportes.length}</span> transportes
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="kanban" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
          >
            Quadro Kanban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTV transportes={transportes} />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <div className="flex gap-6 overflow-x-auto pb-6">
            <KanbanColumnTV 
              title="Separação" 
              transportes={transportes} 
              etapa="separacao"
            />
            <KanbanColumnTV 
              title="Conferência" 
              transportes={transportes} 
              etapa="conferencia"
            />
            <KanbanColumnTV 
              title="Carregamento" 
              transportes={transportes} 
              etapa="carregamento"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}