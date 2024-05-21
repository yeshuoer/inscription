// export { auth as middleware } from "@/auth"
import { log } from "@/libs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  log('rrr', request.nextUrl)
  return NextResponse.next()
}

export const config = {
  // matcher: '/personal/:path',
}
