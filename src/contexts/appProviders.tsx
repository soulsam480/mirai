import React from 'react'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import { CurrentAccountProvider } from 'contexts/currenctAccountProvider'

interface Props {
  pageProps: any
}

export const AppProviders: React.FC<Props> = ({ pageProps, children }) => {
  return (
    <NextAuthProvider session={pageProps.session}>
      <CurrentAccountProvider>{children}</CurrentAccountProvider>
    </NextAuthProvider>
  )
}
