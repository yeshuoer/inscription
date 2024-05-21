import NextAuth from "next-auth"
import credentials from "next-auth/providers/credentials"
import { verify } from "./libs/api"
import { z } from 'zod'
import { log } from "./libs"
import { Address } from "abitype"

declare module 'next-auth' {
  interface User {
    address: Address;
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
          log('address auth pass')
          return {
            address,
          }
        } catch(err) {
          return null
        }
      },
    })
  ],
})
