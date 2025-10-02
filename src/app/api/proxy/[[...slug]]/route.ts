/* eslint-disable */
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError, Method } from 'axios';

// Força a rota a ser sempre dinâmica.
// Isso desliga a análise estática do Next.js que causa o erro falso sobre `params.slug`.
export const dynamic = 'force-dynamic';

// Coloque a URL base da sua API externa em uma variável de ambiente para maior segurança e flexibilidade.
const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_URL || 'http://localhost:4000/api';

/**
 * Handler genérico que atua como um proxy para a API externa usando Axios.
 * @param request A requisição original do cliente.
 * @param context O contexto da rota, contendo os parâmetros da URL.
 */
async function handler(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  try {
    // 1. Autenticação: Garante que o usuário está logado no servidor.
    const session = await auth();
    const token = session?.user?.accessToken;
    
    console.log('🔐 Proxy - Session:', { 
      hasSession: !!session, 
      hasUser: !!session?.user,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
    });
    
    if (!token) {
      // Se não houver token, retorna um erro de não autorizado.
      return NextResponse.json({ message: 'Não autorizado - Token não encontrado' }, { status: 401 });
    }
    
    // 2. Montagem da URL de destino
    const { slug } = await context.params;
    const path = slug ? slug.join('/') : ''; // Junta os segmentos do slug para formar o caminho.
    const searchParams = request.nextUrl.search; // Pega todos os query params (ex: "?chave=valor")
    const targetUrl = `${EXTERNAL_API_BASE_URL}/${path}${searchParams}`;
    
    console.log('🌐 Proxy - Target URL:', targetUrl);

    // 3. Processamento do corpo da requisição (para POST, PUT, etc.)
    let body;
    if (request.body) {
        const contentType = request.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                // Usamos request.clone() para que o corpo possa ser lido novamente se necessário.
                body = await request.clone().json();
            } catch (e) {
                console.log({e})
                // Ignora o erro se o corpo não for um JSON válido.
                body = null;
            }
        }
    }

    // 4. Encaminhamento da requisição para a API externa com Axios
    console.log('📤 Enviando para API externa:', {
      method: request.method,
      url: targetUrl,
      authHeader: `Bearer ${token.substring(0, 30)}...`,
      hasBody: !!body
    });

    const externalResponse = await axios.request({
      method: request.method as Method,
      url: targetUrl,
      headers: {
        'Authorization': `Bearer ${token}`,
        // O Axios define 'Content-Type': 'application/json' automaticamente se `data` for um objeto.
      },
      data: body, // Axios usa a propriedade 'data' para o corpo da requisição.
    });
    
    console.log('✅ Resposta da API:', { status: externalResponse.status });

    // 5. Lógica de resposta para o cliente
    // Com Axios, uma requisição bem-sucedida (status 2xx) entra aqui.
    // Retornamos os dados e o status da resposta externa.
    return NextResponse.json(externalResponse.data, { status: externalResponse.status });

  } catch (error) {
    // Axios lança um erro para qualquer status de resposta fora do intervalo 2xx.
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        console.error("❌ Erro de Axios no proxy:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.config?.url
        });
        
        // Repassa EXATAMENTE a resposta de erro da API externa para o cliente
        const errorData = axiosError.response?.data || { 
          message: axiosError.message || 'Erro na requisição' 
        };
        
        return NextResponse.json(errorData, {
            status: axiosError.response?.status || 500,
            headers: {
              'Content-Type': 'application/json',
            }
        });
    }
    
    // Captura qualquer outro erro inesperado (erro de rede, timeout, etc)
    console.error("❌ Erro inesperado no proxy da API:", error);
    return NextResponse.json({ 
      message: 'Erro interno no servidor de proxy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Exporta o mesmo handler para todos os métodos HTTP comuns.
export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
