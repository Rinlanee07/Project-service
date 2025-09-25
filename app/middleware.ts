import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = user?.role || "GUEST";
  const { pathname } = request.nextUrl;

  // กำหนด rules ของแต่ละหน้า
  const accessRules = [
    { path: "/dashboard", roles: ["MEMBER", "SHOP", "TECHNICIAN", "ADMIN"] },
    { path: "/dashboard/create-repair", roles: ["MEMBER", "SHOP"] },
    { path: "/dashboard/repair-details", roles: ["MEMBER", "SHOP", "TECHNICIAN", "ADMIN"] },
    { path: "/dashboard/status-tracking", roles: ["MEMBER", "SHOP", "TECHNICIAN", "ADMIN"] },
    { path: "/dashboard/shipping", roles: ["MEMBER", "SHOP", "ADMIN"] },
    { path: "/dashboard/close-repair", roles: ["ADMIN"] },
  ];

  const rule = accessRules.find((rule) => pathname.startsWith(rule.path));

  if (rule && !rule.roles.includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
