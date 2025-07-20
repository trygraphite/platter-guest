import { type NextRequest, NextResponse } from "next/server";
import { generateUserToken } from "@/utils/tokenGenerator";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Extract subdomain
  let currentHost = null;

  if (process.env.NODE_ENV === "production") {
    // Handle Vercel preview deployments
    if (hostname?.includes(".vercel.app")) {
      // Split the hostname into parts
      const parts = hostname.split(".");
      if (parts.length >= 3) {
        // Extract the subdomain (e.g., "sauce-grill" from "sauce-grill.platter-qr-guest.vercel.app")
        currentHost = parts[0];
      } else {
        // Handle cases where there is no subdomain (e.g., "platter-qr-guest.vercel.app")
        currentHost = null;
      }
    } else {
      // Handle custom domain or traditional subdomains
      currentHost = hostname?.replace(`.${process.env.BASE_DOMAIN}`, "");
    }
  } else {
    // Local development
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      // Try to extract subdomain from the full URL
      const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
      if (fullUrlMatch && fullUrlMatch[1]) {
        currentHost = fullUrlMatch[1];
      } else if (hostname.includes(".localhost")) {
        // Fallback to host header approach
        currentHost = hostname.split(".")[0];
      } else {
        currentHost = hostname?.split(":")[0]?.replace(".localhost", "") ?? "";
      }
    }
  }

  // Log currentHost for debugging
  // console.log("Current Host:", currentHost);

  // Special handling for root domain or www
  if (!currentHost || currentHost === "www" || currentHost === "app") {
    return null;
  }

  return currentHost;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const subdomain = extractSubdomain(request);

  // Special handling for root domain or www - redirect to marketing domain
  if (!subdomain || subdomain === "www" || subdomain === "app") {
    if (process.env.MARKETING_DOMAIN) {
      return NextResponse.redirect(
        new URL(`https://${process.env.MARKETING_DOMAIN}`)
      );
    }
  }

  // Check for existing user token in cookies
  const existingToken = request.cookies.get("user_token")?.value;

  // Generate response (either rewrite or next)
  let response: NextResponse;

  if (subdomain) {
    // Block access to admin page from subdomains (if you have one)
    if (pathname.startsWith("/admin")) {
      response = NextResponse.redirect(new URL("/", request.url));
    } else {
      // For any path on a subdomain, rewrite to the subdomain page
      response = NextResponse.rewrite(
        new URL(`/${subdomain}${pathname}`, request.url)
      );
    }
  } else {
    // On the root domain, allow normal access
    response = NextResponse.next();
  }

  // If no token exists, generate and set one
  if (!existingToken) {
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Generate token using utility function (now async)
    const newToken = await generateUserToken(userAgent, ip);
    // Set the token as an HTTP-only cookie
    response.cookies.set("user_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    // Also set a readable cookie for client-side access
    response.cookies.set("user_token_client", newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|[\\w-]+\\.\\w+).*)",
  ],
};
