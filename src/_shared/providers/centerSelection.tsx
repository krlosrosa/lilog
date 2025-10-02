'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/_shared/stores/auth.store'; // <-- Adapte o caminho para sua store
import { useMinhaInfo } from '@/_services/api/hooks/usuario/usuario';
import { useSession } from 'next-auth/react';

/**
 * Componente de guarda de rota que utiliza o useAuthStore (Zustand)
 * para gerenciar o acesso e redirecionamentos.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Observa as mesmas fontes de dados que o AuthSync para saber o estado de carregamento.
  const { status: sessionStatus } = useSession();

  // 2. Observa o estado interno da aplicação vindo da store.
  const user = useAuthStore((state) => state.user);
  const needsCenterSelection = useAuthStore((state) => state.needsCenterSelection);
  const hasMoreThanOneCenter = useAuthStore((state) => state.hasMoreThanOneCenter);
  const availableCenters = useAuthStore((state) => state.availableCenters);
  const centerId = useAuthStore((state) => state.centerId);

  // 3. Determina o estado geral de carregamento.
  // A aplicação está carregando se a sessão está sendo verificada, OU se a sessão
  // já foi confirmada mas ainda estamos buscando os dados do perfil do usuário.
  const isLoading = sessionStatus === 'loading' || (sessionStatus === 'authenticated' && !user );

  useEffect(() => {
    // Não executa nenhuma lógica de redirecionamento enquanto os dados estão sendo carregados.
    if (isLoading) {
      return;
    }

    const isPublicPage = pathname === '/login';
    const isOnSelectionPage = pathname === '/selecionar-centro';

    // LÓGICA DE REDIRECIONAMENTO (executada apenas após o carregamento)

    // Cenário 1: Usuário NÃO está logado (verificado pela nossa store) e não está na página de login.
    if (!user && !isPublicPage) {
      router.push('/login');
      return;
    }

    // Cenário 2: Usuário ESTÁ logado.
    if (user) {
      // Se ele precisa selecionar um centro e tem múltiplos centros disponíveis, redireciona para lá.
      if (centerId === '' && availableCenters.length > 1) {
        router.push('/selecionar-centro');
        return;
      }
    }
  }, [isLoading, user, needsCenterSelection, hasMoreThanOneCenter, availableCenters, pathname, router]);

  // 4. Enquanto carrega, exibe o loader global. É isso que previne o "flash".
  if (isLoading) {
    return <div>
      <GlobalLoader />;
      </div>
  }

  // 5. Se tudo estiver carregado e as validações passaram, renderiza a página solicitada.
  return <>{children}</>;
}

function GlobalLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5' // Cor de fundo suave
    }}>
      <p style={{ fontSize: '18px', color: '#333' }}>Carregando...</p>
    </div>
  );
}