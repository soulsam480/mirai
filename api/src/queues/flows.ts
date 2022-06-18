import { FlowProducer } from 'bullmq'

// A FlowProducer constructor takes an optional "connection"
// object otherwise it connects to a local redis instance.
export const flowProducer = new FlowProducer({
  connection: {
    port: parseInt(process.env.REDIS_PORT),
  },
})
