'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useAuthStore, User } from '@/_shared/stores/auth.store'; // <-- Ajuste o caminho se necessário
import { useMinhaInfo } from '@/_services/api/hooks/usuario/usuario'; // <-- Ajuste o caminho se necessário

/**
 * Este componente sincroniza o estado da sessão do NextAuth com a store global (Zustand).
 * Sua única responsabilidade é manter a store atualizada. Ele não faz redirecionamentos.
 */
export function AuthSync() {
  const { data: session, status: sessionStatus } = useSession();

  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.user?.accessToken);
  const authUser = useAuthStore((state) => state.user);

  const { data: minhaInfo, isSuccess: isMinhaInfoSuccess, isLoading: isMinhaInfoLoading } = useMinhaInfo({
    // A busca só é ativada quando a sessão está autenticada.
    query: {
      enabled: sessionStatus === 'authenticated',
    },
  });

  const sessionToken = session?.user?.accessToken;

  // Usamos uma ref para "lembrar" o token que já foi processado.
  // Isso quebra qualquer loop de re-renderização, garantindo que o login na store
  // aconteça apenas UMA VEZ por sessão.
  const processedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const isLoading = sessionStatus === 'loading' || (sessionStatus === 'authenticated' && isMinhaInfoLoading);
    if (isLoading) {
      return;
    }

    // Cenário 1: Usuário deslogado
    if (sessionStatus === 'unauthenticated' && authUser) {
      logout();
      processedTokenRef.current = null; // Limpa a ref para permitir um novo login futuro
      return;
    }

    // Cenário 2: Login bem-sucedido e dados do perfil prontos
    if (sessionStatus === 'authenticated' && isMinhaInfoSuccess && sessionToken && minhaInfo) {
      // Se o token da sessão atual já foi processado, não fazemos nada.
      if (sessionToken === token) {
        return;
      }
      
      const userToLogin: User = {
        name: session.user.name || '',
        email: session.user.email || '',
        accessToken: sessionToken,
        permissions: minhaInfo.listCenterRole || [],
      };

      // A mágica acontece aqui: ao chamar o login, a store é atualizada.
      // O AuthGuard, que está "ouvindo" a store, irá reagir a esta mudança
      // e executar o redirecionamento necessário.
      login(userToLogin);

      // Marca este token como processado.
      processedTokenRef.current = sessionToken;
    }
  }, [
    sessionStatus,
    sessionToken,
    minhaInfo,
    isMinhaInfoSuccess,
    isMinhaInfoLoading,
    authUser,
    login,
    logout,
  ]);

  return null;
}

