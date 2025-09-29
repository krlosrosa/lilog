'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { Button } from '@/_shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_shared/components/ui/card';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleKeycloakLogin = async () => {
    setIsLoading(true);
    try {
      // Isso redireciona automaticamente para o login do Keycloak
      await signIn('keycloak');
    } catch (error) {
      console.error('Erro ao redirecionar para o Keycloak:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4'>
      <ToastContainer
        position='bottom-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Card className='w-full max-w-md shadow-lg border'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center text-foreground'>
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className='text-center text-muted-foreground'>
            Clique abaixo para entrar com sua conta corporativa
          </CardDescription>
        </CardHeader>

        <CardContent className='grid gap-4'>
          <Button
            type='button'
            className='w-full mt-2'
            disabled={isLoading}
            onClick={handleKeycloakLogin}
          >
            {isLoading ? 'Redirecionando...' : 'Entrar com Keycloak'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
