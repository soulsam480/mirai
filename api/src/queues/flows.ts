import { FlowProducer } from 'bullmq'
import { getEnv } from '../lib'

// A FlowProducer constructor takes an optional "connection"
// object otherwise it connects to a local redis instance.
export const flowProducer = new FlowProducer({
  connection: {
    port: parseInt(getEnv('REDIS_PORT') as string),
  },
})
