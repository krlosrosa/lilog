'use client';
import { AbilityContext } from "../utils/casl";
import { useAuthStore } from "../stores/auth.store";
import abilityTeste from "./ability";

export function AbilityProvider({ children }: { children: React.ReactNode }) {

  const ability = useAuthStore((state) => state.ability);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}