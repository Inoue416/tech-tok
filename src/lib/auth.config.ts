/**
 * Auth.js (NextAuth.js) Configuration
 * Google・GitHub OAuth認証とPrisma Adapterの設定
 */

import { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

// Prismaクライアントの初期化（シングルトンパターン）
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

const prisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

export const authConfig: NextAuthConfig = {
  // Prisma Adapter for database integration
  adapter: PrismaAdapter(prisma),

  // OAuth providers configuration
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true, // 同一メールでの複数プロバイダー許可
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true, // 同一メールでの複数プロバイダー許可
    }),
  ],

  // Session strategy - JWT in cookies
  session: {
    strategy: 'jwt', // JWTでセッション管理（クッキーに保存）
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },

  // Pages configuration
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  // Callbacks for custom logic
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // JWTトークンにユーザー情報を保存
      if (user) {
        token.userId = user.id
        token.username = user.username
        token.displayName = user.displayName
        token.bio = user.bio
      }

      // セッション更新時（プロフィール更新等）の処理
      if (trigger === 'update' && session) {
        token.username = session.user.username
        token.displayName = session.user.displayName
        token.bio = session.user.bio
      }

      return token
    },

    async session({ session, token }) {
      // JWTトークンからセッションにユーザー情報を設定
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.username = token.username as string | null
        session.user.displayName = token.displayName as string | null
        session.user.bio = token.bio as string | null
      }
      return session
    },

    async signIn({ user, account, profile }) {
      // サインイン時のカスタムロジック
      if (account?.provider === 'google' || account?.provider === 'github') {
        // 初回サインイン時にユーザー名を自動生成
        if (user.email && !user.name) {
          // メールアドレスからユーザー名を生成
          const emailUsername = user.email.split('@')[0]
          const randomSuffix = Math.floor(Math.random() * 1000)
          const generatedUsername = `${emailUsername}${randomSuffix}`

          try {
            // ユーザー名の重複チェックと更新
            const existingUser = await prisma.user.findUnique({
              where: { username: generatedUsername },
            })

            if (!existingUser && user.id) {
              await prisma.user.update({
                where: { id: user.id },
                data: { username: generatedUsername },
              })
            }
          } catch (error) {
            console.error('Username generation error:', error)
            // エラーが発生してもサインインは継続
          }
        }
      }
      return true
    },

    async redirect({ url, baseUrl }) {
      // サインイン・サインアウト後のリダイレクト先
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  // Events for logging and analytics
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`)
      if (isNewUser) {
        console.log(`New user created: ${user.id}`)
      }
    },
    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email || 'Unknown'}`)
    },
  },

  // Security configuration
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Debug settings (development only)
  debug: process.env.NODE_ENV === 'development',
}

export default authConfig