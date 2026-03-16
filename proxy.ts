import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (internal Next.js routes)
     * - favicon.ico (favicon file)
     * - static files (images, etc)
     */
    '/((?!api|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
