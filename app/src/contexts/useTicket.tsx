import { Ticket } from '@prisma/client'
import { useAlert } from 'components/lib/store/alerts'
import { loaderAtom } from 'components/lib/store/loader'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { loggedInAtom, useUser } from 'stores/user'
import { QueryOptions } from 'types'
import { getUserHome } from 'utils/helpers'
import { useGlobalError, useQuery } from 'utils/hooks'
import { trpc } from 'utils/trpc'

export function useTickets(opts?: QueryOptions<'ticket.getAll'>) {
  opts = opts ?? {}
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()

  const { data: tickets = [], isLoading } = trpc.useQuery(['ticket.getAll', userData.instituteId as number], {
    ...opts,
    enabled: isLoggedIn,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        void router.push(getUserHome(userData.role))
      }
    },
  })

  return { tickets, isLoading }
}

export function useTicket(opts?: QueryOptions<'ticket.get'>) {
  opts = opts ?? {}
  const userData = useUser()
  const router = useRouter()
  const setAlert = useAlert()
  const setLoader = useSetAtom(loaderAtom)
  const utils = trpc.useContext()
  const { isQuery } = useQuery('ticketId')
  const setError = useGlobalError()

  const { data: ticket, isLoading } = trpc.useQuery(
    [
      'ticket.get',
      {
        instituteId: userData.instituteId as number,
        id: +(router.query.tickedId as string),
      },
    ],
    {
      onError(e) {
        setError(e)
      },
      ...opts,
      enabled: isQuery,
    },
  )

  const update = trpc.useMutation(['ticket.update'], {
    onSuccess() {
      void utils.invalidateQueries(['ticket.getAll'])
      setAlert({
        type: 'success',
        message: 'Ticket updated',
      })
      void router.push('/institute/ticket')
    },
    onError(e) {
      setError(e)
    },
  })

  const create = trpc.useMutation(['ticket.create'], {
    async onSuccess(data): Promise<Ticket> {
      void utils.invalidateQueries(['ticket.getAll'])

      setAlert({
        type: 'success',
        message: 'Ticket created',
      })

      return data
    },
    onError(e) {
      setError(e)
    },
  })

  const loading = useMemo(
    () => isLoading === true || update.isLoading || create.isLoading,
    [isLoading, update.isLoading, create.isLoading],
  )

  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    ticket,
    create,
    update,
    isLoading,
  }
}
