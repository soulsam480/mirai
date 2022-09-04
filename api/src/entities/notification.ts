import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
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

export class Data {
  @prop({ enum: SourceType, type: String })
  sourceType!: SourceType

  @prop()
  sourceId?: number

  @prop({ allowMixed: Severity.ALLOW })
  meta?: DataMeta
}

@modelOptions({
  schemaOptions: { timestamps: true, toJSON: { virtuals: true, versionKey: false } },
})
export class Notification extends TimeStamps {
  @prop({ required: true })
  ownerId!: number

  @prop({ default: false })
  read?: boolean

  @prop()
  data!: Data
}

export const notification = getModelForClass(Notification)
