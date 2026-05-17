import mongoose from 'mongoose'
import { IReact, ReactTypeEnum } from '../../Common'

const reactSchema = new mongoose.Schema<IReact>({
  type: { type: String, enum: ReactTypeEnum, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true },
  onModel: { type: String, required: true, enum: ['Post', 'Comment'] },
}, { timestamps: true })

reactSchema.index({ ownerId: 1, refId: 1, onModel: 1 }, { unique: true })
reactSchema.index({ refId: 1, onModel: 1, type: 1 })

export const ReactModel = mongoose.model<IReact>('React', reactSchema)
