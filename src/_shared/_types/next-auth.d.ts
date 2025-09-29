import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      name?: string | null;
      email?: string | null;
      accessToken?: string;
      permissions?: Permission[];
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    center?: string;
    accessToken?: string;
    resetSenha?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    permissions?: Permission[]; // Corrigido para usar 'permissions' como no auth.ts
  }
}

export type Permission = {
  centerId: string;
  processo: string;
  role: string;
}

