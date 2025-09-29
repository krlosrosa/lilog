import { cn } from "@/_shared/lib/utils";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useSideBar } from "./useSideBar";
import { Button } from "../ui/button";
import { BetweenHorizontalEndIcon, ChevronDown, ChevronLeft, ChevronRight, ChevronsUp, LogOut, MapPin, MoreVertical } from "lucide-react";
import { Input } from "../ui/input";
import { Tooltip } from "@radix-ui/react-tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Can } from "@/_shared/utils/casl";

export default function Sidebar() {

  const { handleKeyDown, filteredNavItems, openSubmenus, searchTerm, handleSearchChange, handleSearchKeyDown, handleToggleSubmenu, handleToggleCollapse, isCollapsed, setSearchTerm, setIsCollapsed } = useSideBar();
  const { data: session } = useSession();
  const { centerId, hasMoreThanOneCenter } = useAuthStore();
  const router = useRouter();

  const renderNavItem = (navItem: NavItem, level: number = 0, index: number = 0): React.ReactNode => {
    const { label, icon: Icon, children, href, feature } = navItem;
    const hasChildren = !!children && children.length > 0;
    const isOpen = !!openSubmenus[label];
    const indentClass = level > 0 ? `ml-${level * 2}` : "";

    let content: React.ReactNode;

    // Se não tem children e tem href, renderiza como link
    if (!hasChildren && href) {
      const linkContent = (
        <div
          className={cn(
            "flex items-center group gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9 cursor-pointer select-none",
            isCollapsed && "justify-center px-0",
            indentClass
          )}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
          {!isCollapsed && (
            <span className="font-medium transition-opacity duration-300 flex-1">{label}</span>
          )}
        </div>
      );
      content = (
        <div key={`${label}-${index}`}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={href} tabIndex={0} aria-label={label}>
                  {linkContent}
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" className="select-none">
                {label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <a
              href={href}
              tabIndex={0}
              aria-label={label}
              className="block"
            >
              {linkContent}
            </a>
          )}
        </div>
      );
    } else {
      // Caso tenha children, mantém Dropdown/Tooltip
      const menuButton = (
        <div
          className={cn(
            "flex items-center group gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9 cursor-pointer select-none",
            isCollapsed && "justify-center px-0",
            indentClass
          )}
          tabIndex={0}
          aria-label={label}
          aria-haspopup={hasChildren ? "menu" : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          onClick={hasChildren && !isCollapsed ? () => handleToggleSubmenu(label) : undefined}
          onKeyDown={hasChildren && !isCollapsed ? (e) => {
            if (e.key === "Enter" || e.key === " ") handleToggleSubmenu(label);
          } : undefined}
          role="button"
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
          {!isCollapsed && (
            <span className="font-medium transition-opacity duration-300 flex-1">{label}</span>
          )}
          {hasChildren && !isCollapsed && (
            isOpen ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronsUp className="w-4 h-4 ml-auto" />
          )}
        </div>
      );

      content = (
        <div key={label} className="w-full">
          {isCollapsed ? (
            hasChildren ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {menuButton}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="min-w-[14rem] max-w-[18rem]">
                  {children?.map((sub: NavItem, subIndex: number) => renderNavItem(sub, 0, subIndex))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null
          ) : (
            menuButton
          )}
          {/* Submenu recursivo */}
          {hasChildren && isOpen && !isCollapsed && (
            <div className="ml-4 mt-1 flex flex-col gap-1">
              {children?.map((sub: NavItem, subIndex: number) => (
                <div key={sub.label}>
                  {renderNavItem(sub, level + 1, subIndex)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (feature) {
      return (
        <Can I="read" a={feature} key={`${label}-${index}-can`}>
          {content}
        </Can>
      );
    }

    return content;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "flex flex-col justify-between h-screen bg-background border-r border-border p-2 gap-2 fixed top-0 left-0 z-30 transition-all duration-300",
          isCollapsed ? "w-14 min-w-[3.5rem]" : "w-60 min-w-[15rem]"
        )}
        aria-label="Sidebar navigation"
      >
        {/* Top Section */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className={cn("flex items-center gap-2 px-1", isCollapsed && "justify-center px-0")}>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted">
              {/* Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8H9L12 2Z" fill="currentColor" />
                <circle cx="12" cy="14" r="6" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </span>
            {!isCollapsed && (
              <span className="text-base font-bold text-foreground select-none transition-opacity duration-300">Lilog</span>
            )}
            {/* Collapse Button (md+) */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("ml-auto hidden md:inline-flex", isCollapsed && "mx-0")}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              tabIndex={0}
              onClick={handleToggleCollapse}
              onKeyDown={handleKeyDown}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
          {/* Search */}
          {!isCollapsed && (
            <div className="relative transition-all duration-300">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
              </span>
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="pl-8 h-8 text-sm bg-muted text-foreground placeholder:text-muted-foreground focus:bg-background"
                aria-label="Buscar no menu"
                tabIndex={0}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                  aria-label="Limpar busca"
                  tabIndex={0}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
              )}
            </div>
          )}
          {/* Navigation */}
          <nav className="flex flex-col gap-1 mt-1" aria-label="Main navigation">
            {filteredNavItems.length > 0 ? (
              filteredNavItems.map((item, index) => {
                const renderNavItem = (navItem: NavItem, level: number = 0) => {
                  const { label, icon: Icon, children, href, feature } = navItem;
                  const hasChildren = !!children && children.length > 0;
                  const isOpen = !!openSubmenus[label];
                  const indentClass = level > 0 ? `ml-${level * 2}` : "";

                  const withPermission = (item: NavItem, children: React.ReactNode) => {
                    if (item.feature) {
                      return <Can I="read" a={item.feature} key={`${item.label}-can`}>{children}</Can>
                    }
                    return children;
                  }

                  // Se não tem children e tem href, renderiza como link
                  if (!hasChildren && href) {
                    const linkContent = (
                      <div
                        className={cn(
                          "flex items-center group gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9 cursor-pointer select-none",
                          isCollapsed && "justify-center px-0",
                          indentClass
                        )}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        {!isCollapsed && (
                          <span className="font-medium transition-opacity duration-300 flex-1">{label}</span>
                        )}
                      </div>
                    );
                    return (
                      <div key={`${label}-${index}`}>
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href={href} tabIndex={0} aria-label={label}>
                                {linkContent}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="select-none">
                              {label}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <a
                            href={href}
                            tabIndex={0}
                            aria-label={label}
                            className="block"
                          >
                            {linkContent}
                          </a>
                        )}
                      </div>
                    );
                  }

                  // Caso tenha children, mantém Dropdown/Tooltip
                  const menuButton = (
                    <div
                      className={cn(
                        "flex items-center group gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9 cursor-pointer select-none",
                        isCollapsed && "justify-center px-0",
                        indentClass
                      )}
                      tabIndex={0}
                      aria-label={label}
                      aria-haspopup={hasChildren ? "menu" : undefined}
                      aria-expanded={hasChildren ? isOpen : undefined}
                      onClick={hasChildren && !isCollapsed ? () => handleToggleSubmenu(label) : undefined}
                      onKeyDown={hasChildren && !isCollapsed ? (e) => {
                        if (e.key === "Enter" || e.key === " ") handleToggleSubmenu(label);
                      } : undefined}
                      role="button"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {!isCollapsed && (
                        <span className="font-medium transition-opacity duration-300 flex-1">{label}</span>
                      )}
                      {hasChildren && !isCollapsed && (
                        isOpen ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronsUp className="w-4 h-4 ml-auto" />
                      )}
                    </div>
                  );

                  return (
                    <div key={label} className="w-full">
                      {isCollapsed ? (
                        hasChildren ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              {menuButton}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" className="min-w-[14rem] max-w-[18rem]">
                              {children?.map((sub: NavItem) => {
                                const subHasChildren = !!sub.children && sub.children.length > 0;

                                if (subHasChildren) {
                                  return withPermission(sub,
                                    <DropdownMenuItem key={sub.label} className="p-0">
                                      <div className="w-full">
                                        <div className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground text-sm font-medium border-b border-border/50">
                                          <div className="flex items-center gap-2">
                                            {sub.icon && <sub.icon className="w-4 h-4" />}
                                            <span>{sub.label}</span>
                                          </div>
                                          <ChevronRight className="w-4 h-4" />
                                        </div>
                                        <div className="py-0.5">
                                          {sub.children?.map((subSub: NavItem) => {
                                            const subSubHasChildren = !!subSub.children && subSub.children.length > 0;

                                            if (subSubHasChildren) {
                                              return withPermission(subSub,
                                                <div key={subSub.label} className="px-3 py-0.5">
                                                  <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                                                    <div className="flex items-center gap-2">
                                                      {subSub.icon && <subSub.icon className="w-3 h-3" />}
                                                      <span>{subSub.label}</span>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3" />
                                                  </div>
                                                  <div className="ml-2 border-l border-border/30 pl-2">
                                                    {subSub.children?.map((subSubSub: NavItem) => (
                                                      withPermission(subSubSub,
                                                        <DropdownMenuItem asChild key={subSubSub.label}>
                                                          <a
                                                            href={subSubSub.href}
                                                            className="flex items-center gap-2 px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground text-xs transition-colors outline-none rounded"
                                                            tabIndex={0}
                                                            aria-label={subSubSub.label}
                                                          >
                                                            {subSubSub.icon && <subSubSub.icon className="w-3 h-3" />}
                                                            <span>{subSubSub.label}</span>
                                                          </a>
                                                        </DropdownMenuItem>
                                                      )
                                                    ))}
                                                  </div>
                                                </div>
                                              );
                                            }

                                            return withPermission(subSub,
                                              <DropdownMenuItem asChild key={subSub.label}>
                                                <a
                                                  href={subSub.href}
                                                  className="flex items-center gap-2 px-3 py-1 text-muted-foreground hover:bg-muted hover:text-foreground text-xs transition-colors outline-none"
                                                  tabIndex={0}
                                                  aria-label={subSub.label}
                                                >
                                                  {subSub.icon && <subSub.icon className="w-3 h-3" />}
                                                  <span>{subSub.label}</span>
                                                </a>
                                              </DropdownMenuItem>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </DropdownMenuItem>
                                  );
                                }

                                return withPermission(sub,
                                  <DropdownMenuItem asChild key={sub.label}>
                                    <a
                                      href={sub.href}
                                      className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground text-sm transition-colors outline-none"
                                      tabIndex={0}
                                      aria-label={sub.label}
                                    >
                                      {sub.icon && <sub.icon className="w-4 h-4" />}
                                      <span>{sub.label}</span>
                                    </a>
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : null
                      ) : (
                        menuButton
                      )}
                      {/* Submenu recursivo */}
                      {hasChildren && isOpen && !isCollapsed && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {children?.map((sub: NavItem) => (
                            <div key={sub.label}>
                                {renderNavItem(sub, level + 1)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                };

                const navItemWithPermission = (item: NavItem) => {
                  const navItem = renderNavItem(item);
                  if (item.feature) {
                    return <Can I="read" a={item.feature} key={`${item.label}-can`}>{navItem}</Can>
                  }
                  return navItem;
                }

                return navItemWithPermission(item);
              })
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Nenhum resultado encontrado para "{searchTerm}"
              </div>
            )}
          </nav>
        </div>
        {/* Bottom Section */}
        <div className="flex flex-col gap-2">
          {/*<div className="flex flex-col gap-1">
            <a
              href="#"
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9",
                isCollapsed && "justify-center px-0"
              )}
              tabIndex={0}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              {!isCollapsed && <span className="font-medium flex-1">Notifications</span>}
              {!isCollapsed && <Badge className="bg-violet-400 text-white ml-1 text-xs px-1.5 py-0.5">12</Badge>}
            </a>
            <a
              href="#"
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9",
                isCollapsed && "justify-center px-0"
              )}
              tabIndex={0}
              aria-label="Support"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              {!isCollapsed && <span className="font-medium">Support</span>}
            </a>
            <a
              href="#"
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9",
                isCollapsed && "justify-center px-0"
              )}
              tabIndex={0}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              {!isCollapsed && <span className="font-medium">Settings</span>}
            </a>
          </div>*/}
          {/* User Card */}
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-xl bg-muted transition-all duration-300",
            isCollapsed && "justify-center p-1"
          )}>
            <Avatar className="w-7 h-7">
              <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium text-foreground truncate text-sm">{session?.user?.name || 'Usuário'}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {centerId ? centerId : 'Sem centro'}
                </span>
              </div>
            )}
            {!isCollapsed && <span className="w-2 h-2 rounded-full bg-green-500 mr-1" aria-label="Online" />}

            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    aria-label="User menu"
                    tabIndex={0}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-48">
                  <DropdownMenuItem
                    disabled={!hasMoreThanOneCenter}
                    className="flex justify-between gap-2 cursor-pointer" onClick={() => router.push('/selecionar-centro')}>
                    <MapPin className="w-4 h-4" />
                    {centerId ? <div className="flex items-center gap-2">
                      <span> {centerId}</span>
                      <BetweenHorizontalEndIcon className="w-5 h-5" />
                    </div> : <span>Selecionar centro</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Button>Tema</Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};
