// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    phone: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      role: string;
      phone: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone: string | null;
  }
}