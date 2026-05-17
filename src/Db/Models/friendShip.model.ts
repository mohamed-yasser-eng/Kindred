import mongoose from 'mongoose'
import { FriendShipStatusEnum, IFriendShip } from '../../Common'

const friendShipSchema = new mongoose.Schema<IFriendShip>({
  requestFromId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestToId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: FriendShipStatusEnum,
    default: FriendShipStatusEnum.PENDING,
  },
  friendshipKey: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true })

friendShipSchema.pre('validate', function (next) {
  if (this.requestFromId && this.requestToId) {
    const ids = [this.requestFromId.toString(), this.requestToId.toString()].sort()
    this.friendshipKey = ids.join(':')
  }
  next()
})

friendShipSchema.index({ requestFromId: 1, status: 1 })
friendShipSchema.index({ requestToId: 1, status: 1 })
friendShipSchema.index({ friendshipKey: 1 }, { unique: true })

export const FriendShipModel = mongoose.model<IFriendShip>('FriendShip', friendShipSchema)
