// app/api/proxy/[[...path]]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ProxyParams {
  path?: string[];
}

const TARGET_URL = process.env.NEXT_PUBLIC_TARGET_URL || 'https://api.exemplo.com';

export async function GET(req: NextRequest, { params }: { params: Promise<ProxyParams> }) {
  return handleProxy(req, await params, 'GET');
}

export async function POST(req: NextRequest, { params }: { params: Promise<ProxyParams> }) {
  return handleProxy(req, await params, 'POST');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<ProxyParams> }) {
  return handleProxy(req, await params, 'PUT');
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<ProxyParams> }) {
  return handleProxy(req, await params, 'DELETE');
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<ProxyParams> }) {
  return handleProxy(req, await params, 'PATCH');
}

export async function OPTIONS(req: NextRequest, { params }: { params: Promise<ProxyParams> }) {
  return handleProxy(req, await params, 'OPTIONS');
}

export async function HEAD(req: NextRequest, { params }: { params: Promise<ProxyParams> }) {
  return handleProxy(req, await params, 'HEAD');
}

async function handleProxy(
  req: NextRequest, 
  params: ProxyParams, 
  method: string
): Promise<NextResponse> {
  try {
    // Extrai o caminho dinâmico
    const path = params.path?.join('/') || '';
    
    // Pega query parameters
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    
    // Monta URL completa
    const targetUrl = `${TARGET_URL}/${path}${queryString ? '?' + queryString : ''}`;
    
    // Copia headers
    const headers: HeadersInit = {};
    req.headers.forEach((value, key) => {
      if (key !== 'host' && key !== 'connection') {
        headers[key] = value;
      }
    });
    
    // Prepara body (se existir)
    let body: BodyInit | null = null;
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        try {
          const jsonData = await req.json();
          body = JSON.stringify(jsonData);
        } catch {
          body = null;
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        body = await req.text();
      } else if (contentType.includes('multipart/form-data')) {
        body = await req.arrayBuffer();
      } else {
        try {
          body = await req.arrayBuffer();
        } catch {
          body = null;
        }
      }
    }
    
    // Faz requisição para o destino
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'manual', // Permite controlar redirects
    });
    
    // Copia headers da resposta
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
    
    // Pega o corpo da resposta
    const responseBody = await response.arrayBuffer();
    
    // Retorna a resposta
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('Erro no proxy:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return NextResponse.json(
      { 
        error: 'Erro no proxy', 
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}


// ============================================
// Para Pages Router (Next.js 12 e anterior)
// Salve em: pages/api/proxy/[[...path]].ts
// ============================================

/*
import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponse {
  error: string;
  message: string;
}

const TARGET_URL = process.env.NEXT_PUBLIC_TARGET_URL || 'https://api.exemplo.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorResponse>
) {
  try {
    // Extrai o caminho
    const { path, ...query } = req.query;
    const pathString = Array.isArray(path) ? path.join('/') : (path || '');
    
    // Monta query string
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
    const targetUrl = `${TARGET_URL}/${pathString}${queryString ? '?' + queryString : ''}`;
    
    // Copia headers
    const headers: HeadersInit = { ...req.headers } as HeadersInit;
    delete headers['host'];
    delete headers['connection'];
    
    // Prepara body
    let body: BodyInit | null = null;
    if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.headers['content-type']?.includes('application/json')) {
        body = JSON.stringify(req.body);
      } else {
        body = req.body;
      }
    }
    
    // Faz requisição
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });
    
    // Repassa headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Repassa resposta
    const data = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(data));
    
  } catch (error) {
    console.error('Erro no proxy:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(500).json({ error: 'Erro no proxy', message: errorMessage });
  }
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
*/