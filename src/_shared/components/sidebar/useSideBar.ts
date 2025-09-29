import { useEffect, useState } from "react";
import { navItems } from "./listItemsMenu";
import { useProviderSidebar } from "@/_shared/providers/sideBarProvider";


export const useSideBar = () => {

  const { isCollapsed, setIsCollapsed } = useProviderSidebar();
  const [openSubmenus, setOpenSubmenus] = useState<{ [label: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") handleToggleCollapse();
  };

  const handleToggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchTerm("");
      e.currentTarget.blur();
    }
  };

  // Função para verificar se um item ou seus filhos correspondem ao filtro
  const itemMatchesSearch = (item: NavItem): boolean => {
    const matchesLabel = item.label.toLowerCase().includes(searchTerm.toLowerCase());

    if (matchesLabel) return true;

    if (item.children) {
      return item.children.some(child => itemMatchesSearch(child));
    }

    return false;
  };

  // Função para filtrar itens de navegação
  const getFilteredItems = (items: NavItem[]): NavItem[] => {
    if (!searchTerm) return items;

    return items.filter(item => itemMatchesSearch(item));
  };

  // Função para abrir automaticamente submenus que contêm resultados da busca
  const shouldAutoOpenSubmenu = (item: NavItem): boolean => {
    if (!searchTerm) return false;

    if (itemMatchesSearch(item)) {
      if (item.children) {
        return item.children.some(child => itemMatchesSearch(child));
      }
    }

    return false;
  };

  // Abrir automaticamente submenus que contêm resultados da busca
  useEffect(() => {
    if (searchTerm) {
      const newOpenSubmenus: { [label: string]: boolean } = {};

      navItems.forEach(item => {
        if (shouldAutoOpenSubmenu(item)) {
          newOpenSubmenus[item.label] = true;
        }
      });

      setOpenSubmenus(newOpenSubmenus);
    } else {
      setOpenSubmenus({});
    }
  }, [searchTerm]);

  const filteredNavItems = getFilteredItems(navItems);

  return {
    filteredNavItems,
    openSubmenus,
    searchTerm,
    handleSearchChange,
    handleSearchKeyDown,
    handleToggleSubmenu,
    handleToggleCollapse,
    isCollapsed,
    setSearchTerm,
    setIsCollapsed,
    handleKeyDown,
  }
}