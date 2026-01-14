import { withAuth } from "next-auth/middleware";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default withAuth({
  pages: {
    signIn: "/api/auth/signin",
  },
});

export const config = {
  matcher: ["/((?!api/auth).*)"],
};
