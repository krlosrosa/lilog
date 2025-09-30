'use client'
import { BuscarInfoQuery } from "@/_services/graphql/produtividade/infoInfodemanda.graphql"
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card"
import { Badge } from "@/_shared/components/ui/badge"
import { Clock, User, Package, Pause, Play, CheckCircle, AlertCircle } from "lucide-react"
import { formatTime } from "@/_shared/utils/formatTime"

type InfoDemandaData = BuscarInfoQuery['infoDemanda']

interface TimelineDemandaProps {
  infoDemanda: InfoDemandaData | undefined | null
}

interface TimelineEvent {
  id: string
  type: 'inicio' | 'pausa_inicio' | 'pausa_fim' | 'palete_criado' | 'paletes_adicionados' | 'fim'
  timestamp: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'in_progress' | 'pending'
  data?: any
}

export default function TimelineDemanda({ infoDemanda }: TimelineDemandaProps) {
  if (!infoDemanda) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline da Demanda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Dados da demanda não disponíveis
          </div>
        </CardContent>
      </Card>
    )
  }


  // Indicador de status atual em tempo real
  const getCurrentStatus = () => {
    // FINALIZADO: Só se realmente tem timestamp de fim
    if (infoDemanda.fim) {
      return { status: 'FINALIZADO', color: 'text-green-600', bgColor: 'bg-green-50', icon: <CheckCircle className="w-4 h-4" /> }
    }
    
    // INCONSISTÊNCIA: Status diz concluído mas sem fim
    if (infoDemanda.status === 'CONCLUIDO' || infoDemanda.status === 'FINALIZADA') {
      return { status: 'INCONSISTÊNCIA', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: <AlertCircle className="w-4 h-4" /> }
    }
    
    // Se o status da API indica pausado
    if (infoDemanda.status === 'PAUSADO') {
      return { status: 'EM_PAUSA', color: 'text-red-600', bgColor: 'bg-red-50', icon: <Pause className="w-4 h-4" /> }
    }
    
    // Verifica se há pausas ativas (sem fim) como fallback
    const pausaAtiva = infoDemanda.pausas.find(pausa => !pausa.fim)
    if (pausaAtiva) {
      return { status: 'EM_PAUSA', color: 'text-red-600', bgColor: 'bg-red-50', icon: <Pause className="w-4 h-4" /> }
    }
    
    // Status padrão em progresso
    return { status: 'EM_PROGRESSO', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: <Play className="w-4 h-4" /> }
  }

  const statusAtual = getCurrentStatus()

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDuration = (inicio: string, fim: string | null): string => {
    if (!fim) return 'Em andamento'
    
    const start = new Date(inicio)
    const end = new Date(fim)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }



  const getTurnoColor = (turno: string) => {
    switch (turno) {
      case 'MANHA':
        return 'text-orange-600 bg-orange-50'
      case 'TARDE':
        return 'text-blue-600 bg-blue-50'
      case 'NOITE':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  // Create timeline events
  const events: TimelineEvent[] = []

  // Add process start event
  events.push({
    id: `inicio-${infoDemanda.id}`,
    type: 'inicio',
    timestamp: infoDemanda.inicio,
    title: 'Processo Iniciado',
    description: `${infoDemanda.processo} iniciado por ${infoDemanda.funcionario}`,
    icon: <Play className="w-4 h-4 text-green-600" />,
    status: 'completed',
    data: infoDemanda
  })

  // Add single palete event with all paletes grouped
  if (infoDemanda.paletes.length > 0) {
    // Find the earliest palete creation time
    const earliestPalete = infoDemanda.paletes.reduce((earliest, current) => 
      new Date(current.criadoEm) < new Date(earliest.criadoEm) ? current : earliest
    )
    
    events.push({
      id: `paletes-${infoDemanda.id}`,
      type: 'paletes_adicionados',
      timestamp: earliestPalete.criadoEm,
      title: 'Paletes Adicionados',
      description: `${infoDemanda.paletes.length} palete(s) adicionado(s) ao processo`,
      icon: <Package className="w-4 h-4 text-blue-600" />,
      status: 'completed',
      data: infoDemanda.paletes
    })
  }

  // Add pause events
  infoDemanda.pausas.forEach((pausa) => {
    // Pause start
    events.push({
      id: `pausa-inicio-${pausa.id}`,
      type: 'pausa_inicio',
      timestamp: pausa.inicio,
      title: 'Pausa Iniciada',
      description: `${pausa.motivo} - ${pausa.descricao}`,
      icon: <Pause className="w-4 h-4 text-red-600" />,
      status: 'completed',
      data: pausa
    })

    // Pause end (if exists)
    if (pausa.fim) {
      events.push({
        id: `pausa-fim-${pausa.id}`,
        type: 'pausa_fim',
        timestamp: pausa.fim,
        title: 'Pausa Finalizada',
        description: `Duração: ${formatDuration(pausa.inicio, pausa.fim)}`,
        icon: <Play className="w-4 h-4 text-green-600" />,
        status: 'completed',
        data: pausa
      })
    }
  })

  // Add process end event ONLY if actually finished
  if (infoDemanda.fim) {
    // Only add if there's a real fim timestamp
    events.push({
      id: `fim-${infoDemanda.id}`,
      type: 'fim',
      timestamp: infoDemanda.fim,
      title: 'Processo Finalizado',
      description: `Duração total: ${formatDuration(infoDemanda.inicio, infoDemanda.fim)}`,
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      status: 'completed',
      data: infoDemanda
    })
  } else if (infoDemanda.status === 'CONCLUIDO' || infoDemanda.status === 'FINALIZADA') {
    // If status says finished but no fim timestamp - this is a data inconsistency
    console.warn('⚠️ Data inconsistency: Status is CONCLUIDO but no fim timestamp', infoDemanda)
    events.push({
      id: `inconsistency-${infoDemanda.id}`,
      type: 'fim',
      timestamp: new Date().toISOString(),
      title: 'Inconsistência de Dados',
      description: 'Status marcado como concluído, mas sem timestamp de fim',
      icon: <AlertCircle className="w-4 h-4 text-orange-600" />,
      status: 'completed',
      data: infoDemanda
    })
  } else {
    // Se não há fim e não está concluído, adiciona um evento "current" para mostrar que está em andamento
    const lastEventTime = Math.max(
      new Date(infoDemanda.inicio).getTime(),
      ...infoDemanda.pausas.map(p => new Date(p.fim || p.inicio).getTime()),
      ...infoDemanda.paletes.map(p => new Date(p.atualizadoEm).getTime())
    )
    
    events.push({
      id: `current-${infoDemanda.id}`,
      type: 'inicio',
      timestamp: new Date(lastEventTime).toISOString(),
      title: 'Status Atual',
      description: statusAtual.status === 'EM_PAUSA' ? 'Processo pausado' : 'Processo em andamento...',
      icon: statusAtual.icon,
      status: 'in_progress',
      data: infoDemanda
    })
  }

  // Sort events by timestamp
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="w-full space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Demanda #{infoDemanda.id}</h2>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusAtual.bgColor} ${statusAtual.color}`}>
            {statusAtual.icon}
            {statusAtual.status}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDateTime(new Date().toISOString())}
        </div>
      </div>

      {/* Compact Info Line */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Funcionário:</span>
            <span className="font-medium">{infoDemanda.funcionario}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTurnoColor(infoDemanda.turno)}`}>
            {infoDemanda.turno}
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="font-medium">{infoDemanda.processo}</span>
          <span className="font-medium">{infoDemanda.centerId}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 p-3 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{infoDemanda.paletes.length}</div>
          <div className="text-xs text-muted-foreground">Paletes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-amber-600">{infoDemanda.pausas.length}</div>
          <div className="text-xs text-muted-foreground">Pausas</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {infoDemanda.paletes.reduce((acc, palete) => acc + palete.quantidadeCaixas, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Caixas</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{infoDemanda.produtividade.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">Produtividade</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{formatTime(infoDemanda.tempoTotal)}</div>
          <div className="text-xs text-muted-foreground">Tempo Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">{formatTime(infoDemanda.tempoTrabalhado)}</div>
          <div className="text-xs text-muted-foreground">Trabalhado</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{formatTime(infoDemanda.tempoPausas)}</div>
          <div className="text-xs text-muted-foreground">Pausas</div>
        </div>
      </div>

      {infoDemanda.obs && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">{infoDemanda.obs}</div>
          </div>
        </div>
      )}

      {/* Compact Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-2">Histórico de Eventos</h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-3">
                {/* Timeline dot */}
                <div className={`
                  relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs
                  ${event.status === 'completed' ? 'bg-background border-primary' : 
                    event.status === 'in_progress' ? 'bg-primary/10 border-primary animate-pulse' : 
                    'bg-muted border-muted-foreground/30'}
                `}>
                  {event.icon}
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{event.title}</span>
                    <time className="text-xs text-muted-foreground font-mono">
                      {formatDateTime(event.timestamp).split(' ')[1]} {/* Show only time */}
                    </time>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                  
                  {/* Lista de paletes compacta */}
                  {event.type === 'paletes_adicionados' && event.data && (
                    <div className="mt-3 space-y-2">
                      {event.data.map((palete: any) => (
                        <div key={palete.id} className="p-3 bg-muted/20 rounded border border-border/30">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium truncate">{palete.empresa}</span>
                                <Badge variant={palete.status === 'EM_PROGRESSO' ? 'secondary' : 'default'} className="text-xs h-4 flex-shrink-0">
                                  {palete.status === 'EM_PROGRESSO' ? 'PROG' : 'FIN'}
                                </Badge>
                              </div>
                              
                              <div className="h-3 w-px bg-border"></div>
                              
                              <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                  <span className="text-muted-foreground">ID:</span>
                                  <span className="font-medium font-mono text-xs">{palete.id}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Cx:</span>
                                  <span className="font-medium">{palete.quantidadeCaixas}</span>
                                </span>
                                <span className="text-muted-foreground font-medium">{palete.segmento}</span>
                                <span className="flex items-center gap-1">
                                  <span className="text-muted-foreground">V:</span>
                                  <span className="font-medium">{palete.enderecoVisitado}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="text-muted-foreground">T:</span>
                                  <span className="font-medium">{palete.transporteId}</span>
                                </span>
                              </div>
                            </div>
                            <span className={`text-sm flex-shrink-0 ${palete.validado ? 'text-green-600' : 'text-orange-600'}`}>
                              {palete.validado ? '✓' : '○'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
