import mongoose from 'mongoose'
import { IBlackListedToken } from '../../Common'

const blackListedTokensModel = new mongoose.Schema<IBlackListedToken>({
  tokenId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true })

blackListedTokensModel.index({ tokenId: 1 }, { unique: true })
blackListedTokensModel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const BlackListedTokenModel = mongoose.model<IBlackListedToken>('BlackListedTokens', blackListedTokensModel)

export default BlackListedTokenModel
