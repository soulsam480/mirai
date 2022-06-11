import { Connection, createWsConn } from 'api/ws'
import { useSession } from 'next-auth/react'
import { createContext, useContext, useEffect, ReactNode, useState, useRef, useMemo } from 'react'
import { isInstituteRole } from 'utils/helpers'

interface WSProviderProps {
  children: ReactNode
}

interface WSClientContextType {
  conn: Connection | null
  setConn: (c: Connection | null) => void
}

const WSClientContext = createContext<WSClientContextType>({
  conn: null,
  setConn() {
    //
  },
})

function WSClientProvider({ children }: WSProviderProps): JSX.Element {
  const { data, status } = useSession()
  const [conn, setConn] = useState<Connection | null>(null)
  const isConnecting = useRef(false)

  useEffect(() => {
    if (
      conn === null &&
      status === 'authenticated' &&
      isInstituteRole(data.user.role).is === true &&
      !isConnecting.current
    ) {
      isConnecting.current = true

      createWsConn(data)
        .then((baseConn) => {
          setConn(baseConn)
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e)
        })
        .finally(() => {
          isConnecting.current = false
        })
    }
  }, [status, data, isConnecting, conn])

  return (
    <WSClientContext.Provider
      value={useMemo(
        () => ({
          conn,
          setConn,
        }),
        [conn],
      )}
    >
      {children}
    </WSClientContext.Provider>
  )
}

function useWS() {
  const context = useContext(WSClientContext)

  return context
}

export { WSClientProvider, useWS }
