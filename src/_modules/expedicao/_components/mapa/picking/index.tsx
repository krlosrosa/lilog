import { HeaderPicking } from "./headerPicking"
import { BodyPicking } from "./bodyPicking"
import { ImpressaoMapa } from "../../../services/types/pickingMap"
import { DefinirConfiguracaoImpressaoDto } from "@/_services/api/model"

interface PickingMapaProps {
  mapa: ImpressaoMapa
  config: DefinirConfiguracaoImpressaoDto | undefined
}

export default function PickingMapa({ mapa, config }: PickingMapaProps) {
  return (
    <div>
      <HeaderPicking tipo={config?.tipoImpressao} exibirCliente={config?.exibirInfoCabecalho} mapa={mapa} />
      <BodyPicking transporteId={mapa.transportId} config={config} itens={mapa.itens} />
    </div>
  )
}