/**
 * Auth.js Integration for Next.js App Router
 * NextAuth.jsのメイン設定とエクスポート
 */

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export default NextAuth(authConfig)