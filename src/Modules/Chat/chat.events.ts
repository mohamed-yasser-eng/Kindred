import { Socket } from "socket.io";
import { consumeSocketRateLimit, socketMessageRateLimiter, socketReadRateLimiter } from "../../Middlewares";
import { GetChatHistoryEventValidator, GetGroupChatEventValidator, SendGroupMessageEventValidator, SendPrivateMessageEventValidator } from "../../Validators";
import { ChatService } from "./Services/chat.services";





export class ChatEvents {
    private chatService: ChatService = new ChatService()

    constructor(private socket: Socket) { }

    private async canSendMessage(eventName: string) {
        const key = `${this.socket.data.userId}:${eventName}`
        const isAllowed = await consumeSocketRateLimit(socketMessageRateLimiter, key)
        if (!isAllowed) this.socket.emit('error', { message: 'Too many messages, please slow down.' })
        return isAllowed
    }

    private async canReadHistory(eventName: string) {
        const key = `${this.socket.data.userId}:${eventName}`
        const isAllowed = await consumeSocketRateLimit(socketReadRateLimiter, key)
        if (!isAllowed) this.socket.emit('error', { message: 'Too many chat history requests, please slow down.' })
        return isAllowed
    }

    private validateEventData<T>(validator: { safeParse: (data: unknown) => { success: true; data: T } | { success: false } }, data: unknown) {
        const result = validator.safeParse(data)
        if (!result.success) {
            this.socket.emit('error', { message: 'Invalid socket event payload' })
            return null
        }

        return result.data
    }



    sendPrivateMessageEvent() {
        this.socket.on('send-private-message', async (data) => {
            if (!(await this.canSendMessage('send-private-message'))) return
            const validData = this.validateEventData(SendPrivateMessageEventValidator, data)
            if (!validData) return
            this.chatService.sendPrivateMessage(this.socket, validData)
        })
    }


    getConversationMessagesEvent() {
        this.socket.on('get-chat-history', async (data) => {
            if (!(await this.canReadHistory('get-chat-history'))) return
            const targetUserId = this.validateEventData(GetChatHistoryEventValidator, data)
            if (!targetUserId) return
            this.chatService.getConversationMessages(this.socket, targetUserId)
        })
    }

    sendgroupMessageEvent() {
        this.socket.on('send-group-message', async (data) => {
            if (!(await this.canSendMessage('send-group-message'))) return
            const validData = this.validateEventData(SendGroupMessageEventValidator, data)
            if (!validData) return
            this.chatService.sendGroupMessage(this.socket, validData)
        })
    }

    getGroupHistoryEvent() {
        this.socket.on('get-group-chat', async (data) => {
            if (!(await this.canReadHistory('get-group-chat'))) return
            const targetGroupId = this.validateEventData(GetGroupChatEventValidator, data)
            if (!targetGroupId) return
            this.chatService.getGroupHistory(this.socket, targetGroupId)
        })
    }
}

