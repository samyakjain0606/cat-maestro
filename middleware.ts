import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher(["/", "/api/webhook/clerk"]);

export default clerkMiddleware((auth, req, evt) => {
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  if (!auth.userId) {
    // Handle users who aren't authenticated
    // You might want to redirect to login or allow access and handle in components
    return NextResponse.next();
  }

  // If the user is logged in
  console.log(`User ${auth.userId} logged in. Ensure they're registered in the database.`);

  // You might want to make an API call to your backend here to register the user
  // const response = await fetch('/api/register-user', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ userId: auth.userId })
  // });

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
