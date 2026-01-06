import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
      { refreshToken: token.refreshToken },
      { skipAuthRefresh: true }
    );
    console.log("Refreshed access token:", res.data);
    return {
      ...token,
      access_token: res.data.accessToken,
      accessTokenExpires: Date.now() + res.data.expiresIn * 1000,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // iniital sign in
      if (user) {
        token.id = user.body.id;
        token.full_name = user.body.full_name;
        token.email = user.body.email;
        token.role = user.body.role;
        token.division = user.body.division;
        token.division_abrv = user.body.division_abrv;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      }

      // If access token has not expired, return it
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Otherwise refresh
      console.log("Access token expired, refreshing...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.full_name = token.full_name;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.division = token.division;
      session.user.division_abrv = token.division_abrv;
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;

      return session;
    },
  },
  pages: {
    signIn: "api/auth/signin",
    signOut: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
