"use client"
import { useBuscarTodosOsCentros } from "@/_services/api/hooks/centro/centro"
import AdicionarNovoCentro from "../components/adicionarNovoCentro" 
import ListaCentros from "../components/listaCentros"

export default function GestaoCentroPage() {
  const { data: centros = [] } = useBuscarTodosOsCentros()

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Centros</h1>
          <p className="text-muted-foreground">
            {centros.length} centro{centros.length !== 1 ? 's' : ''} cadastrado{centros.length !== 1 ? 's' : ''}
          </p>
        </div>
        <AdicionarNovoCentro />
      </div>

      <ListaCentros />
    </div>
  )
}