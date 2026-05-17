import { isValidObjectId } from 'mongoose'
import { z } from 'zod'

const objectId = z.string().refine((value) => isValidObjectId(value), 'invalid object id')

export const SendPrivateMessageEventValidator = z.strictObject({
  text: z.string().min(1).max(2000),
  targetUserId: objectId,
})

export const SendGroupMessageEventValidator = z.strictObject({
  text: z.string().min(1).max(2000),
  targetGroupId: objectId,
})

export const GetChatHistoryEventValidator = objectId

export const GetGroupChatEventValidator = objectId
