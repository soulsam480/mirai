import mongoose from 'mongoose'

export function getObjectId(val: string) {
  return new mongoose.Types.ObjectId(val)
}
