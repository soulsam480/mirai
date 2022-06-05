import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import httpProxyMiddleware from 'next-http-proxy-middleware'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let session: any = await getSession({ req })

  session = session ?? {}
  const searlizedSession = JSON.stringify(session)

  return await httpProxyMiddleware(req, res, {
    target: process.env.NEXT_API_BASE ?? 'http://localhost:4002',
    headers: {
      Authorization: searlizedSession,
    },
    pathRewrite: [
      {
        patternStr: '^/api/trpc',
        replaceStr: '/trpc',
      },
    ],
  })
}
