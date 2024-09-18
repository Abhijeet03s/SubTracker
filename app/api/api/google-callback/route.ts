import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const code = searchParams.get('code');

   if (code) {
      return NextResponse.redirect(new URL(`/google-callback?code=${code}`, request.url));
   } else {
      return NextResponse.json({ error: 'No authorization code found' }, { status: 400 });
   }
}
