/**
 * Auth.js Type Extensions
 * NextAuth.jsの型定義拡張
 */

import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username?: string | null
      displayName?: string | null
      bio?: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    username?: string | null
    displayName?: string | null
    bio?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    username?: string | null
    displayName?: string | null
    bio?: string | null
  }
}

export {}