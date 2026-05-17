import { Router } from 'express'
import { authentication, Multer, uploadRateLimitMiddleware, validationMiddleware } from '../../Middlewares'
import postService from './services/post.service'
import { CreatePostValidator, ListHomePostsValidator, PostIdParamsValidator, UpdatePostValidator, UserPostsParamsValidator } from '../../Validators'
const postController = Router()

// add post 
postController.post('/add-post',authentication ,uploadRateLimitMiddleware, Multer().array('files',3), validationMiddleware(CreatePostValidator),postService.addPost) 

//update post 
postController.patch('/:postId', authentication, uploadRateLimitMiddleware, Multer().array('files', 3), validationMiddleware(UpdatePostValidator), postService.updatePost)


//delete post 
postController.delete('/:postId', authentication, validationMiddleware(PostIdParamsValidator), postService.deletePost)



//get home posts
postController.get('/home', authentication, validationMiddleware(ListHomePostsValidator), postService.listHomePages)

// get user posts
postController.get('/user/me', authentication, postService.listUserPosts)
postController.get('/user/:userId', authentication, validationMiddleware(UserPostsParamsValidator), postService.listUserPosts)


//social-app {{accessToken}}



export { postController }
