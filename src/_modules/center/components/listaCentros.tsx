"use client"
import { useBuscarTodosOsCentros } from "@/_services/api/hooks/centro/centro"
import EditarCentro from "./editarCentro"
import ExcluirCentro from "./excluirCentro"
import { Card, CardContent } from "@/_shared/components/ui/card"
import { Badge } from "@/_shared/components/ui/badge"
import { Edit, Trash2, Building2 } from "lucide-react"
import { Button } from "@/_shared/components/ui/button"

type Centro = {
  centerId: string
  description: string
  state: string
  cluster: 'DISTRIBUICAO' | 'CROSS' | 'CDFABRICA'
}

const getClusterLabel = (cluster: string) => {
  const labels = {
    'DISTRIBUICAO': 'Distribuição',
    'CROSS': 'Cross',
    'CDFABRICA': 'CD Fábrica'
  }
  return labels[cluster as keyof typeof labels] || cluster
}

const getStateVariant = (state: string) => {
  return state === 'ATIVO' ? 'default' : 'secondary'
}

export default function ListaCentros() {
  const { data: centros = [], isLoading } = useBuscarTodosOsCentros()

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-2">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (centros.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum centro encontrado</h3>
          <p className="text-muted-foreground text-center">
            Comece adicionando um novo centro para gerenciar.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {centros.map((centro: Centro) => (
        <Card key={centro.centerId} className="hover:shadow-sm p-4 transition-shadow">
          <CardContent className="px-4 py-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-base truncate">{centro.centerId}</h3>
                  <Badge variant={getStateVariant(centro.state)} className="text-xs">
                    {centro.state}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getClusterLabel(centro.cluster)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">{centro.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <EditarCentro centro={centro}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </EditarCentro>
                <ExcluirCentro centro={centro}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ExcluirCentro>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
