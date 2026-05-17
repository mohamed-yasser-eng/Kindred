import { z } from 'zod'
import { ReactTypeEnum } from '../Common'
import { objectId } from './User/auth.validator'

const targetModel = z.enum(['Post', 'Comment'])

export const UpsertReactValidator = {
  body: z.strictObject({
    type: z.enum(ReactTypeEnum),
    refId: objectId,
    onModel: targetModel,
  }),
}

export const ReactTargetParamsValidator = {
  params: z.strictObject({
    onModel: targetModel,
    refId: objectId,
  }),
}
