import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Sadece Premium araçları korumaya alıyoruz
const isProtectedRoute = createRouteMatcher([
  '/cv-builder(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
