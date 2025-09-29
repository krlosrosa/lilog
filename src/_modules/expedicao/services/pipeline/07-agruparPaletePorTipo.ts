import type { EnrichedPickingMapItem } from "../types/pickingMap"

type Props = {
  lista: EnrichedPickingMapItem[]
  tipo: "LINHAS" | "PERCENTUAL" | null
  quantidade: number
}

export function distribuirPaletePorTipo({
  lista,
  tipo,
  quantidade,
}: Props): EnrichedPickingMapItem[] {
  if (quantidade <= 0) {
    return lista
  }

  if (!tipo) {
    return lista
  }

  const result: EnrichedPickingMapItem[] = []
  let paleteCounter = 1

  if (tipo === "LINHAS") {
    let currentLineCount = 0
    for (const item of lista) {
      currentLineCount++
      result.push({
        ...item,
        id: `${item.id}-${paleteCounter}`,
      })
      if (currentLineCount >= quantidade) {
        paleteCounter++
        currentLineCount = 0
      }
    }
  }

  if (tipo === "PERCENTUAL") {
    let currentPercentage = 0
    for (const item of lista) {
      currentPercentage += item.percentualPallete ?? 0
      if (currentPercentage > quantidade) {
        paleteCounter++
        currentPercentage = item.percentualPallete ?? 0
      }
      result.push({
        ...item,
        id: `${item.id}-${paleteCounter}`,
      })
    }
  }

  return result
}