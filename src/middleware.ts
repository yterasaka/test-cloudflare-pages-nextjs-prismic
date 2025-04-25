import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/prismicio";

export async function middleware(request: NextRequest) {
  const client = createClient();
  const repository = await client.getRepository();
  const locales = repository.languages.map((lang) => lang.id);
  const defaultLocale = locales[0];

  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api/preview") ||
    pathname.startsWith("/api/exit-preview")
  ) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/preview|api/exit-preview).*)"],
};
