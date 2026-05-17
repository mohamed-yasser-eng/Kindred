import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { IRequest } from "../../../Common";
import { CommentModel, FriendShipModel, ReactModel, UserModel } from "../../../Db/Models";
import { CommentRepository, FriendShipRepository, PostRepository, ReactRepository, UserRepository } from "../../../Db/Repositories";
import { BadRequestException, NotFoundException, S3ClientService } from "../../../Utils";
import { pagination } from "../../../Utils/Pagination/pagination.utils";
import { SuccessResponse } from "../../../Utils/Response/response-helper.utils";




class PostService {
    private postRepo = new PostRepository()
    private userRepo = new UserRepository(UserModel)
    private friendshipRepo = new FriendShipRepository(FriendShipModel)
    private commentRepo = new CommentRepository(CommentModel)
    private reactRepo = new ReactRepository(ReactModel)
    private s3ClientService = new S3ClientService()

    private async validateTags(tags: string[] | undefined, ownerId: Types.ObjectId) {
        if (!tags) return []

        const users = await this.userRepo.findDocuments({ _id: { $in: tags } })
        if (users.length !== tags.length) throw new BadRequestException('One or more tags are invalid')

        const friends = await this.friendshipRepo.findDocuments({
            $or: [
                { requestFromId: ownerId, requestToId: { $in: tags }, status: 'accepted' },
                { requestFromId: { $in: tags }, requestToId: ownerId, status: 'accepted' }
            ]
        })

        if (friends.length !== tags.length) throw new BadRequestException('You can only tag your friends')

        return Array.from(new Set(tags)).map((tag) => new Types.ObjectId(tag))
    }


    addPost = async (req: Request, res: Response, next: NextFunction) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { description, allowComments, tags } = req.body
        const files = req.files as Express.Multer.File[]

        if (!description && (files && !files.length)) throw new BadRequestException('Post must have either description or attachments')

        const uniqueTags = await this.validateTags(tags, _id)

        let attachments: string[] = []
        if (files?.length) {
            const uploadData = await this.s3ClientService.uploadFilesOnS3(files, `${_id}/posts`)
            attachments = uploadData.map(({ key }) => key)
        }

        let newPost
        try {
            newPost = await this.postRepo.createNewDocument({
                description,
                attachments,
                ownerId: _id,
                allowComments,
                tags: uniqueTags
            })
        } catch (error) {
            try {
                await this.s3ClientService.deleteBulkFromS3(attachments)
            } catch (cleanupError) {
                console.warn('Failed to delete uploaded post attachments after create failure', cleanupError)
            }
            throw error
        }


        res.status(201).json(SuccessResponse('Post created successfully', 201, { post: newPost }))


    }



    listHomePages = async (req: Request, res: Response, next: NextFunction) => {
        // const { user: { _id } } = (req as IRequest).loggedInUser
        const { page, limit } = req.query
        const { limit: currentLimit, skip } = pagination({ page: Number(page), limit: Number(limit) })
        const posts = await this.postRepo.postsPagination({}, {})
        res.status(200).json(SuccessResponse('Posts fetched successfully', 200, { posts }))
    }

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { postId } = req.params
        const { description, allowComments, tags, removeAttachments } = req.body
        const files = req.files as Express.Multer.File[]

        const post = await this.postRepo.findOneDocument({ _id: postId, ownerId: _id })
        if (!post) throw new NotFoundException('Post not found')

        const updates: Record<string, unknown> = {}
        if (description !== undefined) updates.description = description
        if (allowComments !== undefined) updates.allowComments = allowComments
        if (tags !== undefined) updates.tags = await this.validateTags(tags, _id)

        let attachments = [...(post.attachments || [])]
        let uploadedAttachmentKeys: string[] = []
        const attachmentsToRemove = Array.isArray(removeAttachments) ? removeAttachments : removeAttachments ? [removeAttachments] : []
        if (attachmentsToRemove.length) {
            attachments = attachments.filter((attachment) => !attachmentsToRemove.includes(attachment))
            updates.attachments = attachments
        }

        if (files?.length) {
            const uploadData = await this.s3ClientService.uploadFilesOnS3(files, `${_id}/posts`)
            uploadedAttachmentKeys = uploadData.map(({ key }) => key)
            updates.attachments = [...attachments, ...uploadedAttachmentKeys]
        }

        if (!Object.keys(updates).length) throw new BadRequestException('Nothing to update')

        let updatedPost
        try {
            updatedPost = await this.postRepo.updateDocumentById({ _id: postId, ownerId: _id }, updates, { new: true })
        } catch (error) {
            try {
                await this.s3ClientService.deleteBulkFromS3(uploadedAttachmentKeys)
            } catch (cleanupError) {
                console.warn('Failed to delete uploaded post attachments after update failure', cleanupError)
            }
            throw error
        }

        if (attachmentsToRemove.length) {
            try {
                await this.s3ClientService.deleteBulkFromS3(attachmentsToRemove)
            } catch (cleanupError) {
                console.warn('Failed to delete removed post attachments from S3', cleanupError)
            }
        }

        res.status(200).json(SuccessResponse('Post updated successfully', 200, { post: updatedPost }))
    }

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { postId } = req.params

        const post = await this.postRepo.findOneDocument({ _id: postId, ownerId: _id })
        if (!post) throw new NotFoundException('Post not found')

        await this.commentRepo.deleteDocuments({ refId: postId, onModel: 'Post' })
        await this.reactRepo.deleteDocuments({ refId: postId, onModel: 'Post' })
        await this.postRepo.deleteByIdDocument(post._id)

        if (post.attachments?.length) {
            try {
                await this.s3ClientService.deleteBulkFromS3(post.attachments.map((attachment) => attachment.toString()))
            } catch (cleanupError) {
                console.warn('Failed to delete removed post attachments from S3', cleanupError)
            }
        }

        res.status(200).json(SuccessResponse('Post deleted successfully', 200))
    }

    listUserPosts = async (req: Request, res: Response, next: NextFunction) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { userId } = req.params
        const targetUserId = userId || _id

        const user = await this.userRepo.findDocumentById(targetUserId as any, '_id')
        if (!user) throw new NotFoundException('User not found')

        const posts = await this.postRepo.postsPagination({ ownerId: targetUserId }, {})
        res.status(200).json(SuccessResponse('User posts fetched successfully', 200, { posts }))
    }
}



export default new PostService()
