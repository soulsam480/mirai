import mongoose from 'mongoose'
import { logger } from '../lib'

export async function createMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    logger.info('Mongo connected')
  } catch (err) {
    logger.error('Unable to connect to mongo')
  }
}
