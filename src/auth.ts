import NextAuth, { DefaultSession } from "next-auth"
import credentials from "next-auth/providers/credentials"
import { z } from 'zod'
import { log } from "./libs"
import { Address } from "abitype"
import { SiweMessage } from "siwe"
import { NextResponse } from "next/server"

declare module 'next-auth' {
  interface User {
    address: Address;
  }
  interface Session {
    user: {
      address: Address;
    } & DefaultSession["user"];
  }
}

const SigninSchema = z.object({
  signature: z.string(),
  message: z.string(),
})

const dateString = z.string().refine((value) => {
  const date = new Date(value);
  return !isNaN(date.getTime()); // 验证字符串是否可以转换为有效的日期
}, {
  message: "Invalid date string"
});

const AuthSchema = z.object({
  user: z.object({
    address: z.string(),
  }),
  expires: dateString,
})

export const verify = async (signature: string, message: string) => {
  const siweMessage = new SiweMessage(message)
  try {
    const res = await siweMessage.verify({ signature })
    return {
      data: res.data,
      success: res.success,
    }
  } catch (err) {
    return {
      success: false,
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      credentials: {
        signature: {},
        message: {},
      },
      authorize: async (credentials, request) => {
        try {
          const { signature, message } = await SigninSchema.parseAsync(credentials)
          const res = await verify(signature, message)
          if (!res.success) {
            return null
          }
          const address = res.data?.address as Address
          return {
            address,
          }
        } catch (err) {
          return null
        }
      },
    })
  ],
  callbacks: {
    redirect: async ({url, baseUrl}) => {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        log('uuu', `${baseUrl}${url}`)
        return `${baseUrl}${url}`
      }
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.address = user.address
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.address = token.address as Address
      return session
    },
    authorized: async ({ request, auth }) => {
      const { pathname } = request.nextUrl
      const needAuth = [
        pathname.startsWith('/personal'),
        pathname.startsWith('/token'),
        pathname.startsWith('/market/'),
      ].some(c => c)

      if (!needAuth) {
        return NextResponse.next()
      }

      try {
        const { user, expires } = await AuthSchema.parseAsync(auth)
        log('user', user, expires)
        if (Date.now() > new Date(expires).getTime()) {
          throw new Error('JWT expired.')
        }
        return NextResponse.next()
      } catch (err) {
        log('auth error', err)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_BASE_URL}/401`)
      }
    }
  }
})
