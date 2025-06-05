import { createKindeServerClient, GrantType, type SessionManager, type UserType } from '@kinde-oss/kinde-typescript-sdk'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { createFactory, createMiddleware } from 'hono/factory'
import type { CookieOptions } from 'hono/utils/cookie'
import { type Context } from 'hono'
import { env } from './env'

export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: env.KINDE_DOMAIN,
  clientId: env.KINDE_CLIENT_ID,
  clientSecret: env.KINDE_CLIENT_SECRET,
  redirectURL: env.KINDE_REDIRECT_URI,
  logoutRedirectURL: env.KINDE_LOGOUT_REDIRECT_URI,
})

const cookies = ['id_token', 'access_token', 'user', 'refresh_token'] as const

// type Cookie = (typeof cookies)[number]

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key)
    return result
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    } as const

    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions)
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions)
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key)
  },
  async destroySession() {
    cookies.forEach(key => deleteCookie(c, key))
  },
})

type MiddlewareEnv = {
  Variables: {
    user: UserType
  }
}

export const getUser = createMiddleware<MiddlewareEnv>(async (c, next) => {
  try {
    const manager = sessionManager(c)
    const isAuthenticated = await kindeClient.isAuthenticated(manager)
    if (!isAuthenticated) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const user = await kindeClient.getUser(manager)
    c.set('user', user)
    next()
  } catch (error) {
    console.error(error)
  }
})
