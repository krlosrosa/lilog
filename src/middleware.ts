// middleware.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas (não requerem autenticação)
const PUBLIC_ROUTES = ['/login'];

// Rotas que não requerem seleção de centro
const NO_CENTER_SELECTION_ROUTES = ['/login', '/selecionar-centro'];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Se a rota for pública, permita o acesso
  if (PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next();
  }

  // Verifica a sessão do usuário
  const session = await auth();

  // Se não houver sessão (usuário não logado), redirecione para /login
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session?.user?.resetSenha && path !== '/reset') {
    return NextResponse.redirect(new URL('/reset', request.url));
  }

  // Verificar se usuário precisa selecionar centro
  // Nota: Como o middleware roda no servidor, não temos acesso direto ao Zustand store
  // A verificação de centro será feita no lado do cliente via AuthSync
  // Aqui apenas redirecionamos se estiver na página de seleção de centro
  
  // Se estiver autenticado, permita o acesso
  return NextResponse.next();
}

// Configuração para evitar middleware em arquivos estáticos e rotas da API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
