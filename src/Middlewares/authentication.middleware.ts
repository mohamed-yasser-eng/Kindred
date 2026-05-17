import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

import { IRequest, IUser } from '../Common'
import { BlackListedTokenModel, UserModel } from '../Db/Models'
import { BlackListedTokenRepository, UserRepository } from '../Db/Repositories'
import { verifyToken } from '../Utils'
import { NotFoundException, UnauthorizedException } from '../Utils/Errors/exceptions.utils'

const userRepository = new UserRepository(UserModel)
const blackListedTokenRepository = new BlackListedTokenRepository(BlackListedTokenModel)

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization: accessToken } = req.headers
  if (!accessToken) return next(new UnauthorizedException('Please login first'))

  const [Prefix, token] = accessToken.split(' ')
  if (Prefix !== process.env.JWT_PREFIX || !token) return next(new UnauthorizedException('Invalid access token format'))

  let decodedData: JwtPayload
  try {
    decodedData = verifyToken(token)
  } catch {
    return next(new UnauthorizedException('Invalid or expired access token'))
  }
  if (!decodedData._id) return next(new UnauthorizedException('Invalid payload in access token'))

  const blackListedToken = await blackListedTokenRepository.findOneDocument({ tokenId: decodedData.jti })
  if (blackListedToken) return next(new UnauthorizedException('User session expired, login again.'))

  const user: IUser | null = await userRepository.findDocumentById(decodedData._id, '-password')
  if (!user) return next(new NotFoundException('User not found, please signup first.'))
    ; (req as unknown as IRequest).loggedInUser = { user, token: decodedData as JwtPayload }
  return next()
}
