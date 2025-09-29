'use client'
import { ToastContainer } from "react-toastify";
import { Providers as SessionProvider } from "./sessionProvider";
import { ProvidersQuery } from "./queryProvider";
import { ProviderSidebar } from "./sideBarProvider";
import { AuthSync } from "./centerSelection/AuthSync";
import AuthGuard from "./centerSelection";
import { AbilityProvider } from "./abilityProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProvidersQuery>
      <SessionProvider>
        <AbilityProvider>
          <AuthSync />
          <AuthGuard>
            <ProviderSidebar>
              {children}
            </ProviderSidebar>
          </AuthGuard>
        </AbilityProvider>
        <ToastContainer />
      </SessionProvider>
    </ProvidersQuery>
  );
}
