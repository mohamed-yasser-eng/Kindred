import mongoose from "mongoose";
import { IComment } from "../../Common";

const commentSchema = new mongoose.Schema<IComment>({
    content: String,
    attachments: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true },
    onModel: { type: String, required: true, enum: ['Post', 'Comment'] }
}, { timestamps: true })

commentSchema.index({ refId: 1, onModel: 1, createdAt: -1 })
commentSchema.index({ ownerId: 1, createdAt: -1 })

 
export const CommentModel = mongoose.model<IComment>('Comment', commentSchema)
