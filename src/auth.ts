import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import {jwtDecode} from "jwt-decode";


export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER as string, // Exemplo: https://keycloak.ragde.app/realms/dev
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hora
    updateAge: 30 * 60,
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.name = user.name;
        token.email = user.email;

        console.log('🔑 JWT Callback - Token armazenado:', {
          hasAccessToken: !!account.access_token,
          tokenPreview: account.access_token ? `${account.access_token.substring(0, 30)}...` : 'null'
        });
      }
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      // Permissões serão carregadas de forma assíncrona no AuthSync
      session.user.permissions = [];
      
      console.log('📝 Session Callback:', {
        hasAccessToken: !!token.accessToken,
        tokenPreview: token.accessToken ? `${token.accessToken.substring(0, 30)}...` : 'null'
      });
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  events:{
    async signOut(message) {
      if ('token' in message && message.token?.accessToken) {
        const decoded = jwtDecode(message.token?.accessToken);
        const sub = decoded.sub;
        const url = `${process.env.AUTH_KEYCLOAK_ADMIN}/users/${sub}/logout`;
        const response = await fetch(`${url}`,{
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${message.token?.accessToken}`,
          },
        });
      }
    }
  },

  pages: {
    signIn: '/login',
  },
});
