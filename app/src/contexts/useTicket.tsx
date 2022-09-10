import { TicketResolveResponse } from '@mirai/api'
import type { Ticket } from '@prisma/client'
import { useAlert, loaderAtom } from '../components/lib'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { TicketType } from '../schemas'
import { loggedInAtom, useUser, ticketFiltersAtom } from '../stores'
import { AnyObject, OverWrite } from '../types'
import { getUserHome, useGlobalError, useQuery, trpc } from '../utils'

interface Ticketmeta {
  type: TicketType
  [x: string]: any
}

export type TicketWithMeta = OverWrite<Ticket, { meta: Ticketmeta }>

export function useTickets(opts?: AnyObject) {
  opts = opts ?? {}
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()
  const ticketFilters = useAtomValue(ticketFiltersAtom)

  const { data: tickets = [], isLoading } = trpc.ticket.get_all.useQuery(
    {
      // TODO: fix bug
      // when date filter value is not there don't refetch
      instituteId: userData.instituteId as number,
      ...ticketFilters,
    },
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

export function useTicket(opts?: AnyObject) {
  opts = opts ?? {}
  const setAlert = useAlert()
  const setLoader = useSetAtom(loaderAtom)
  const utils = trpc.useContext()
  const { isQuery, queryVal } = useQuery('ticketId')
  const setError = useGlobalError()

  const { data: ticket, isLoading } = trpc.ticket.get.useQuery(Number(queryVal), {
    onError(e) {
      setError(e)
    },
    ...opts,
    enabled: isQuery,
  })

  const create = trpc.ticket.create.useMutation({
    async onSuccess(data): Promise<Ticket> {
      void utils.ticket.get_all.invalidate()

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

  const action = trpc.ticket.action.useMutation({
    async onSuccess(data): Promise<{
      success: boolean
      data: TicketResolveResponse[]
    }> {
      void utils.ticket.get_all.invalidate()

      setAlert({
        type: 'success',
        message: 'Ticket Updated',
      })

      return data
    },
    onError(e) {
      setError(e)
    },
  })

  const loading = useMemo(() => isLoading || create.isLoading, [isLoading, create.isLoading])

  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    ticket,
    create,
    action,
    isLoading,
  }
}
