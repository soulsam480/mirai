/**
 * ! Avoid exporting any unused server code to not have client side runtime errors
 * ! don't export bscrpt related code
 */

export type { AppRouter } from './rpc/routers/appRouter'
export { getUserHome, isInstituteRole } from './lib/helpers'
export type { SessionUser } from './rpc/context'
export * from './types/payloads'
export * from './types/response'
