import type { NextAuthConfig } from "next-auth";

/**
 * Config edge-safe (sin Mongoose ni bcrypt) para usar en el middleware.
 * Los providers se agregan en auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Salas en vivo: accesibles para invitados (sin login).
      // La autorización fina se hace por token de participante en la API.
      if (pathname.startsWith("/s/") || pathname.startsWith("/api/sessions")) {
        return true;
      }

      const authPaths = ["/login", "/register"];
      const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

      if (isAuthPage) {
        // Si ya está logueado y va al login/register, lo mando al dashboard.
        if (isLoggedIn) {
          return Response.redirect(new URL("/app", nextUrl));
        }
        return true;
      }
      // Resto de rutas protegidas.
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "member";
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "admin" | "member") ?? "member";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
