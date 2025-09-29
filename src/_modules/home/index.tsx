import CardsSessao from "./_components/cardsSessao";
import { MapPin, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sistema Logístico
            <span className="text-primary"> Interno</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acesse as ferramentas internas para otimizar sua operação logística
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <CardsSessao
            title="Impressão de Mapas"
            description="Visualize e planeje rotas de forma prática e intuitiva. Gere mapas personalizados com todas as informações necessárias para sua operação logística interna."
            icon={<MapPin className="h-8 w-8 text-primary" />}
            badge="Ativo"
            href="/expedicao"
          />
          
          <CardsSessao
            title="Gestão de Produtividade"
            description="Monitore a produtividade de equipes de forma eficiente. Acompanhe métricas em tempo real e identifique oportunidades de melhoria na operação."
            icon={<BarChart3 className="h-8 w-8 text-primary" />}
            badge="Ativo"
            href="/produtividade"
          />
        </div>
      </div>
    </div>
  );
}
