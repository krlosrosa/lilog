import {
  Home,
  Package,
  BarChart3,
  Users,
  MapPin,
  Truck,
  RotateCcw,
  ClipboardList,
  Settings,
  Building2,
  TriangleAlert
} from "lucide-react";

export const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/", feature: "Home" },
  {
    label: "Produtividade",
    icon: BarChart3,
    href: "/produtividade",
    feature: "PRODUTIVIDADE",
    children: [
      {
        label: "Gestão",
        icon: ClipboardList,
        href: "/produtividade",
        feature: "PRODUTIVIDADE"
      },
      {
        label: "Funcionários",
        icon: Users,
        href: "/produtividade/funcionarios",
        feature: "PRODUTIVIDADE"
      },
      {
        label: "Dashboard",
        icon: BarChart3,
        href: "/produtividade/dashboard",
        feature: "PRODUTIVIDADE"
      },
      {
        label: "Anomalias",
        icon: TriangleAlert,
        href: "/produtividade/anomalias",
        feature: "PRODUTIVIDADE"
      },
    ]
  },
  {
    label: "Expedição",
    icon: Truck,
    feature: "EXPEDICAO",
    children: [
      {
        label: "Gerar Mapa",
        icon: MapPin,
        href: "/expedicao",
        feature: "EXPEDICAO"
      },
    ],
  },

  {
    label: "Devoluções",
    icon: RotateCcw,
    feature: "Devolucoes",
    children: [
      {
        label: "Overview",
        icon: Package,
        href: "/devolucao/demanda",
        feature: "Devolucoes"
      },
    ],
  },
  {
    label: "Centros",
    icon: Building2,
    href: "/centro",
    feature: "Centros",
    children: [
      {
        label: "Gestão",
        icon: Building2,
        href: "/centro",
        feature: "Centros"
      },
      {
        label: "Usuários",
        icon: Users,
        href: "/usuario",
        feature: "Centros"
      },
      {
        label: "Configurações",
        icon: Settings,
        href: "/centro/pavuna/configuracao",
        feature: "Centros"
      }
    ]
  }
];