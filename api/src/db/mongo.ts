import mongoose from 'mongoose'
import { logger } from '../lib'

export async function createMongoConnection() {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI)

    mongo.set('debug', true)

    logger.info('Mongo connected')
    return mongo
  } catch (err) {
    logger.error('Unable to connect to mongo')
    throw err
  }
}
