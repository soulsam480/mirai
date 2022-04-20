import React from 'react'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import { CurrentAccountProvider } from 'contexts'
import { useDarkMode } from 'utils/hooks'

interface Props {
  pageProps: any
}

export const AppProviders: React.FC<Props> = ({ pageProps, children }) => {
  useDarkMode()

  return (
    <NextAuthProvider session={pageProps.session}>
      <CurrentAccountProvider>{children}</CurrentAccountProvider>
    </NextAuthProvider>
  )
}
