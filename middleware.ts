import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
   publicRoutes: ['/sign-in(.*)', '/sign-up(.*)', '/'],
   ignoredRoutes: ['/api/webhooks(.*)'],
   afterAuth(auth: { userId: any; isPublicRoute: any; }, req: { url: string | URL | undefined; nextUrl: { pathname: string; }; }) {
      if (!auth.userId && !auth.isPublicRoute) {
         return NextResponse.redirect(new URL('/sign-in', req.url));
      }
      if (auth.userId && (req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up'))) {
         return NextResponse.redirect(new URL('/dashboard', req.url));
      }
   },
});

export const config = {
   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};