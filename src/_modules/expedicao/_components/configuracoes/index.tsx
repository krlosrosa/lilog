import { Button } from "@/_shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card"
import AdicionarClientesAgrupados from "./adicionarClientesAgrupados"
import AdicionarRemessasAgrupados from "./adicionarRemessasAgrupados"
import AdicionarTransportesAgrupados from "./adicionarTransportesAgrupados"
import SegregarClientes from "./segregarClientes"
import VisualizarConfiguracoesCentro from "./visualizarConfiguracoesCentro"

export default function Configuracoes({ setTab }: { setTab: (tab: string) => void }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Configurações Avançadas</CardTitle>
          <CardDescription>
            Ajuste as opções de agrupamento e segregação para a impressão.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setTab("upload")}>
            Voltar para Upload
          </Button>
          <Button variant="outline" onClick={() => setTab("minuta")}>
            Minuta Carregamento
          </Button>
          <Button onClick={() => setTab("mapa")}>Mapas de Separação</Button>
        </div>
      </CardHeader>
      <CardContent>
        <VisualizarConfiguracoesCentro />
        <SegregarClientes />
        <AdicionarClientesAgrupados />
        <AdicionarTransportesAgrupados />
        <AdicionarRemessasAgrupados />
      </CardContent>
    </Card>
  )
}