import type { Ticket } from '@prisma/client'
import { useAlert } from 'components/lib/store/alerts'
import { loaderAtom } from 'components/lib/store/loader'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { TicketType } from 'schemas'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { loggedInAtom, useUser } from 'stores/user'
import { OverWrite, QueryOptions } from 'types'
import { getUserHome } from 'utils/helpers'
import { useGlobalError, useQuery } from 'utils/hooks'
import { trpc } from 'utils/trpc'

interface Ticketmeta {
  type: TicketType
  [x: string]: any
}

export type TicketWithMeta = OverWrite<Ticket, { meta: Ticketmeta }>

export function useTickets(opts?: QueryOptions<'ticket.get_all'>) {
  opts = opts ?? {}
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()
  const ticketFilters = useAtomValue(ticketFiltersAtom)

  const { data: tickets = [], isLoading } = trpc.useQuery(
    [
      'ticket.get_all',
      {
        // TODO: fix bug
        // when date filter value is not there don't refetch
        instituteId: userData.instituteId as number,
        ...ticketFilters,
      },
    ],
    {
      ...opts,
      // TODO: check for role
      enabled: isLoggedIn,
      onError(e) {
        if (e.data?.code === 'UNAUTHORIZED') {
          void router.push(getUserHome(userData.role))
        }
      },
    },
  )

  return { tickets, isLoading }
}

export function useTicket(opts?: QueryOptions<'ticket.get'>) {
  opts = opts ?? {}
  const setAlert = useAlert()
  const setLoader = useSetAtom(loaderAtom)
  const utils = trpc.useContext()
  const { isQuery, queryVal } = useQuery('ticketId')
  const setError = useGlobalError()

  const { data: ticket, isLoading } = trpc.useQuery(['ticket.get', Number(queryVal)], {
    onError(e) {
      setError(e)
    },
    ...opts,
    enabled: isQuery,
  })

  const create = trpc.useMutation(['ticket.create'], {
    async onSuccess(data): Promise<Ticket> {
      void utils.invalidateQueries(['ticket.get_all'])

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

  const loading = useMemo(() => isLoading === true || create.isLoading, [isLoading, create.isLoading])

  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    ticket,
    create,
    isLoading,
  }
}
