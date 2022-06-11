import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

interface DataMeta {
  [x: string]: any
}

export enum SourceType {
  student = 'student',
  system = 'system',
  admin = 'admin',
  institute = 'institute',
  others = 'others',
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true, versionKey: false },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Data {
  @prop({ enum: SourceType, required: true })
  sourceType!: SourceType

  @prop({ required: true })
  sourceId!: number

  @prop({ required: true })
  meta!: DataMeta
}

@modelOptions({
  schemaOptions: { timestamps: true, toJSON: { virtuals: true, versionKey: false } },
})
export class Notification extends TimeStamps {
  @prop({ required: true })
  ownerId!: number

  @prop({ default: false })
  read!: boolean

  @prop({ ref: () => Data })
  data!: Ref<Data>
}

export const notificationData = getModelForClass(Data)
export const notification = getModelForClass(Notification)
