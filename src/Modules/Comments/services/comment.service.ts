import { Request, Response } from 'express'
import { IComment, IRequest } from '../../../Common'
import { CommentModel } from '../../../Db/Models'
import { CommentRepository, PostRepository } from '../../../Db/Repositories'
import { BadRequestException, NotFoundException } from '../../../Utils'
import { deleteCommentTree } from '../../../Utils/Comments/comment-cleanup.utils'
import { SuccessResponse } from '../../../Utils/Response/response-helper.utils'

class CommentService {
  private commentRepo = new CommentRepository(CommentModel)
  private postRepo = new PostRepository()

  private validateOnModel(onModel: string) {
    if (!['Post', 'Comment'].includes(onModel)) throw new BadRequestException('Invalid comment target type')
  }

  private async ensureTargetExists(refId: string, onModel: string) {
    this.validateOnModel(onModel)

    if (onModel === 'Post') {
      const post = await this.postRepo.findOneDocument({ _id: refId })
      if (!post) throw new NotFoundException('Post not found')
      if (post.allowComments === false) throw new BadRequestException('Comments are disabled for this post')
      return
    }

    const comment = await this.commentRepo.findOneDocument({ _id: refId })
    if (!comment) throw new NotFoundException('Comment not found')
  }

  createComment = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as IRequest).loggedInUser
    const { content, refId, onModel, attachments } = req.body

    if (!content && !attachments) throw new BadRequestException('Comment must have content or attachment')
    if (!refId || !onModel) throw new BadRequestException('Comment target is required')

    await this.ensureTargetExists(refId, onModel)

    const comment = await this.commentRepo.createNewDocument({
      content,
      attachments,
      refId,
      onModel,
      ownerId: _id,
    })

    return res.status(201).json(SuccessResponse<IComment>('Comment created successfully', 201, comment))
  }

  listComments = async (req: Request, res: Response) => {
    const { refId, onModel } = req.params

    await this.ensureTargetExists(refId, onModel)

    const comments = await this.commentRepo.findDocuments({ refId, onModel }, undefined, {
      populate: [
        {
          path: 'ownerId',
          select: 'firstName lastName profilePicture',
        },
      ],
    })

    return res.status(200).json(SuccessResponse<IComment[]>('Comments fetched successfully', 200, comments))
  }

  updateComment = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as IRequest).loggedInUser
    const { commentId } = req.params
    const { content, attachments } = req.body

    if (!content && !attachments) throw new BadRequestException('Nothing to update')

    const comment = await this.commentRepo.updateDocumentById(
      { _id: commentId, ownerId: _id },
      { content, attachments },
      { new: true },
    )
    if (!comment) throw new NotFoundException('Comment not found')

    return res.status(200).json(SuccessResponse<IComment>('Comment updated successfully', 200, comment))
  }

  deleteComment = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as IRequest).loggedInUser
    const { commentId } = req.params

    const comment = await this.commentRepo.findOneDocument({ _id: commentId, ownerId: _id })
    if (!comment) throw new NotFoundException('Comment not found')

    await deleteCommentTree([comment._id.toString()])

    return res.status(200).json(SuccessResponse('Comment deleted successfully', 200))
  }
}

export default new CommentService()
