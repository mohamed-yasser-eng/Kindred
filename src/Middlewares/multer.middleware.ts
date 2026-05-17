import multer from 'multer'
import path from 'path'
import { BadRequestException } from '../Utils'

const allowedImageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const allowedImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

export const Multer = () => {
  return multer({
    storage: multer.diskStorage({}),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase()

      if (!allowedImageMimeTypes.has(file.mimetype) || !allowedImageExtensions.has(extension)) {
        return callback(new BadRequestException('Only jpeg, png, and webp image files are allowed'))
      }

      return callback(null, true)
    },
  })
}
