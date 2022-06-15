import mongoose from 'mongoose'
import { logger } from '../lib'

export async function createMongoConnection() {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI)

    logger.info('Mongo connected')
    return mongo
  } catch (err) {
    logger.error('Unable to connect to mongo')
    throw err
  }
}
