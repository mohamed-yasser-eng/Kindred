import mongoose, { Types } from "mongoose"
import { ChatTypeEnum, IConversation } from "../../Common"


const ConversationSchema = new mongoose.Schema<IConversation>({
    type: {
        type: String,
        default: ChatTypeEnum.DIRECT,
        enum: ChatTypeEnum
    },
    name: String,
    members: [{ type: Types.ObjectId, ref: "User", required: true }],
    directKey: String,
}, { timestamps: true })

ConversationSchema.pre('validate', function (next) {
    if (this.type === ChatTypeEnum.DIRECT && this.members?.length === 2) {
        const ids = this.members.map((member) => member.toString()).sort()
        this.members = ids.map((id) => new Types.ObjectId(id))
        this.directKey = ids.join(':')
    }
    next()
})

ConversationSchema.index({ members: 1, type: 1 })
ConversationSchema.index({ directKey: 1 }, { unique: true, partialFilterExpression: { type: ChatTypeEnum.DIRECT } })

export const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema)


