// middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/bloglist(.*)",
    "/api/bloglist/author(.*)",
    "/api/bloglist/latest",
    "/api/bloglist/(.*)"
  ],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/uploadthing"
  ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};