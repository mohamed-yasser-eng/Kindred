import { Router } from 'express'
import { authentication, validationMiddleware } from '../../Middlewares'
import commentService from './services/comment.service'
import { CreateCommentValidator, DeleteCommentValidator, ListCommentsValidator, UpdateCommentValidator } from '../../Validators'

const commentController = Router()

commentController.post('/', authentication, validationMiddleware(CreateCommentValidator), commentService.createComment)
commentController.get('/:onModel/:refId', authentication, validationMiddleware(ListCommentsValidator), commentService.listComments)
commentController.patch('/:commentId', authentication, validationMiddleware(UpdateCommentValidator), commentService.updateComment)
commentController.delete('/:commentId', authentication, validationMiddleware(DeleteCommentValidator), commentService.deleteComment)

export { commentController }
