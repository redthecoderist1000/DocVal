import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
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
          return user.body;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.full_name = user.full_name;
        token.email = user.email;
        token.role = user.role;
        token.division = user.division;
        token.division_abrv = user.division_abrv;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.full_name = token.full_name;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.division = token.division;
      session.user.division_abrv = token.division_abrv;
      return session;
    },
  },
  // pages: {
  //   signIn: "api/auth/signin",
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
