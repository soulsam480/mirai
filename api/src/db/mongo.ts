import { LogLevels, setLogLevel } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { getEnv, logger } from '../lib'

export async function createMongoConnection() {
  try {
    const mongo = await mongoose.connect(getEnv('MONGO_URI') as string)

    mongo.set('debug', getEnv('NODE_ENV') === 'development')
    setLogLevel(getEnv('NODE_ENV') === 'production' ? LogLevels.ERROR : LogLevels.TRACE)

    logger.info('Mongo connected')
    return mongo
  } catch (err) {
    logger.error('Unable to connect to mongo')
    throw err
  }
}
