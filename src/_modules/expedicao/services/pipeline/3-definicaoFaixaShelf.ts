import type { EnrichedPickingMapItem } from "../../services/types/pickingMap"
import { addDays, differenceInDays, startOfDay } from "date-fns"

export function definirFaixaERange(
  enrichedShipments: EnrichedPickingMapItem[],
  percentMax: number,
): EnrichedPickingMapItem[] {
  return enrichedShipments.map(item => {
    if (!item.produto || !item.dtFabricacao) {
      return item
    }

    const { shelf, laranja, vermelho, amarelo } = item.produto
    if (shelf <= 0) {
      return { ...item, faixa: "verde" }
    }

    const today = startOfDay(new Date())
    const mfgDate = startOfDay(new Date(item.dtFabricacao))
    const expiryDate = addDays(mfgDate, shelf)
    const addDate = shelf * (percentMax / 100)
    const expiryDateWithAdd = addDays(mfgDate, addDate)

    const daysSinceManufacture = differenceInDays(today, mfgDate)
    const remainingDays = shelf - daysSinceManufacture
    const percentRemaining = (remainingDays / shelf) * 100

    let faixa = "verde"
    if (percentRemaining <= vermelho) {
      faixa = "vermelho"
    } else if (percentRemaining <= laranja) {
      faixa = "laranja"
    } else if (percentRemaining <= amarelo) {
      faixa = "amarelo"
    }

    return {
      ...item,
      faixa: faixa as 'verde' | 'laranja' | 'amarelo' | 'vermelho',
      dataMaxima: faixa === "verde" ? expiryDateWithAdd.toISOString() : item.dtFabricacao.toISOString(),
    }
  })
}
