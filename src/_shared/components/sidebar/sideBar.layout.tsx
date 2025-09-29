"use client"

import { ReactNode } from "react";
import { useIsMobile } from "@/_shared/hooks/use-mobile";
import { cn } from "@/_shared/lib/utils";
import { useProviderSidebar } from "@/_shared/providers/sideBarProvider";
import Sidebar from "./sidebar";

interface SidebarLayoutProps {
  children: ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { isCollapsed } = useProviderSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 w-full transition-all duration-300 overflow-x-hidden",
          !isMobile && isCollapsed && "ml-14",
          !isMobile && !isCollapsed && "ml-60",
          isMobile && "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}; 