// app/api/graphql/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_TARGET_URL}/graphql`;

interface GraphQLRequestBody {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse o body da requisição
    const body: GraphQLRequestBody = await req.json();
    const { query, variables, operationName } = body;


    if (!query) {
      return NextResponse.json(
        { error: 'Query GraphQL é obrigatória' },
        { status: 400 }
      );
    }

    // Copia headers da requisição
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      if (key !== 'host' && key !== 'connection' && key !== 'content-length') {
        headers[key] = value;
      }
    });

    // Cria o client GraphQL
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers,
    });

    // Faz a requisição GraphQL
    const data = await client.request(query, variables);

    console.log({data})
    // Retorna os dados
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('Erro no proxy GraphQL:', error);

    // Trata erros do GraphQL
    if (error.response) {
      return NextResponse.json(
        {
          errors: error.response.errors || [{ message: error.message }],
          data: error.response.data || null,
        },
        { status: error.response.status || 500 }
      );
    }

    // Erro genérico
    return NextResponse.json(
      {
        errors: [{ message: error.message || 'Erro desconhecido no proxy GraphQL' }],
      },
      { status: 500 }
    );
  }
}

// Também suporta GET para queries simples (opcional)
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const variablesParam = searchParams.get('variables');
    const operationName = searchParams.get('operationName');

    if (!query) {
      return NextResponse.json(
        { error: 'Query GraphQL é obrigatória' },
        { status: 400 }
      );
    }

    // Parse variables se existir
    let variables: Record<string, any> | undefined;
    if (variablesParam) {
      try {
        variables = JSON.parse(variablesParam);
      } catch {
        return NextResponse.json(
          { error: 'Variables inválidas (deve ser JSON)' },
          { status: 400 }
        );
      }
    }

    // Copia headers
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      if (key !== 'host' && key !== 'connection') {
        headers[key] = value;
      }
    });

    // Cria o client GraphQL
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers,
    });

    // Faz a requisição
    const data = await client.request(query, variables);

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('Erro no proxy GraphQL (GET):', error);

    if (error.response) {
      return NextResponse.json(
        {
          errors: error.response.errors || [{ message: error.message }],
          data: error.response.data || null,
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        errors: [{ message: error.message || 'Erro desconhecido' }],
      },
      { status: 500 }
    );
  }
}