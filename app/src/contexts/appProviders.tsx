import React from 'react'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import { CurrentAccount } from 'contexts'
import { useTheme } from 'utils/hooks'
import { WSClientProvider } from './WsClient'

interface Props {
  pageProps: any
}

export const AppProviders: React.FC<Props> = ({ pageProps, children }) => {
  useTheme()

  return (
    <NextAuthProvider session={pageProps.session}>
      <CurrentAccount>
        <WSClientProvider>{children}</WSClientProvider>
      </CurrentAccount>
    </NextAuthProvider>
  )
}
