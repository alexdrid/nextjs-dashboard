import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("🚀 ~ file: auth.config.ts:13 ~ authorized ~ auth:", auth)
      const isLoggedIn = !!auth?.user;
      console.log("🚀 ~ file: auth.config.ts:14 ~ authorized ~ isLoggedIn:", isLoggedIn)
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log("🚀 ~ file: auth.config.ts:16 ~ authorized ~ isOnDashboard:", isOnDashboard)
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unathenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;