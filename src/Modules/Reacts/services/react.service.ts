import { Request, Response } from 'express'
import { IReact, IRequest, ReactTypeEnum } from '../../../Common'
import { CommentModel, ReactModel } from '../../../Db/Models'
import { CommentRepository, PostRepository, ReactRepository } from '../../../Db/Repositories'
import { BadRequestException, NotFoundException } from '../../../Utils'
import { SuccessResponse } from '../../../Utils/Response/response-helper.utils'

class ReactService {
  private reactRepo = new ReactRepository(ReactModel)
  private postRepo = new PostRepository()
  private commentRepo = new CommentRepository(CommentModel)

  private validateOnModel(onModel: string) {
    if (!['Post', 'Comment'].includes(onModel)) throw new BadRequestException('Invalid react target type')
  }

  private validateReactType(type: string) {
    if (!Object.values(ReactTypeEnum).includes(type as ReactTypeEnum)) throw new BadRequestException('Invalid react type')
  }

  private async ensureTargetExists(refId: string, onModel: string) {
    this.validateOnModel(onModel)

    if (onModel === 'Post') {
      const post = await this.postRepo.findOneDocument({ _id: refId })
      if (!post) throw new NotFoundException('Post not found')
      return
    }

    const comment = await this.commentRepo.findOneDocument({ _id: refId })
    if (!comment) throw new NotFoundException('Comment not found')
  }

  upsertReact = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as IRequest).loggedInUser
    const { type, refId, onModel } = req.body

    if (!type || !refId || !onModel) throw new BadRequestException('React type and target are required')
    this.validateReactType(type)
    await this.ensureTargetExists(refId, onModel)

    const react = await this.reactRepo.updateDocumentById(
      { ownerId: _id, refId, onModel },
      { type, ownerId: _id, refId, onModel },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )

    return res.status(200).json(SuccessResponse<IReact>('React saved successfully', 200, react as IReact))
  }

  listReacts = async (req: Request, res: Response) => {
    const { refId, onModel } = req.params

    await this.ensureTargetExists(refId, onModel)

    const reacts = await this.reactRepo.findDocuments({ refId, onModel }, undefined, {
      populate: [
        {
          path: 'ownerId',
          select: 'firstName lastName profilePicture',
        },
      ],
    })

    return res.status(200).json(SuccessResponse<IReact[]>('Reacts fetched successfully', 200, reacts))
  }

  deleteReact = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as IRequest).loggedInUser
    const { refId, onModel } = req.params

    this.validateOnModel(onModel)

    const react = await this.reactRepo.findOneDocument({ ownerId: _id, refId, onModel })
    if (!react) throw new NotFoundException('React not found')

    await this.reactRepo.deleteByIdDocument(react._id)

    return res.status(200).json(SuccessResponse('React deleted successfully', 200))
  }
}

export default new ReactService()
