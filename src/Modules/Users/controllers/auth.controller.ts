import { Router } from 'express'
import AuthService from '../services/auth.service'
import { authRateLimitMiddleware, authentication, signinRateLimitMiddleware, signupRateLimitMiddleware, validationMiddleware } from '../../../Middlewares'
import { ConfirmEmailValidator, RefreshTokenValidator, SignInValidator, SignOutValidator, SignUpValidator } from '../../../Validators'
const authController = Router()

authController.post('/signup', signupRateLimitMiddleware, validationMiddleware(SignUpValidator), AuthService.signUp)

authController.post('/confirmEmail', authRateLimitMiddleware, validationMiddleware(ConfirmEmailValidator), AuthService.confirmEmail)

authController.post('/signin', signinRateLimitMiddleware, validationMiddleware(SignInValidator), AuthService.signIn)

authController.post('/refresh-token', validationMiddleware(RefreshTokenValidator), AuthService.refreshToken)

authController.post('/signout', authentication, validationMiddleware(SignOutValidator), AuthService.signOut)

export { authController }
