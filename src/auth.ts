import NextAuth, { DefaultSession } from "next-auth"
import credentials from "next-auth/providers/credentials"
import { verify } from "./libs/api"
import { z } from 'zod'
import { log } from "./libs"
import { Address } from "abitype"

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
        } catch(err) {
          return null
        }
      },
    })
  ],
  callbacks: {
    jwt: async ({token, user }) => {
      if (user) {
        token.address = user.address
      }
      return token
    },
    session: async ({session, token}) => {
      session.user.address = token.address as Address
      return session
    }
  }
})
