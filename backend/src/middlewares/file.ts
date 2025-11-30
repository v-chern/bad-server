import { Request, Response, NextFunction } from 'express'
import multer, { FileFilterCallback } from 'multer'
import sharp from 'sharp'
import {
    defineUploadDir,
    defineUniqueFileName,
    removeFile,
} from '../utils/files'
import BadRequestError from '../errors/bad-request-error'
import { MAX_FILE_SIZE_B, MIN_FILE_SIZE_B } from '../contants'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const uploadDir = defineUploadDir()

        cb(null, uploadDir)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, defineUniqueFileName(file.originalname))
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const formats = ['png', 'jpg', 'jpeg', 'gif', 'svg']

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

const uploadFile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE_B,
    },
})

const validateMetaData = async (filePath: string) => {
  try {
    const metadata = await sharp(filePath).metadata();
    if (!metadata.format || 
        !metadata.width || !metadata.height ||
        !formats.includes(metadata.format)) {
        throw new BadRequestError('Недопустимый формат изображения');
    }
  } catch (err) {
    throw new BadRequestError('Некорректный файл изображения');
  }
}

export const singleFileUpload =
    (field = 'file') =>
    (req: Request, res: Response, next: NextFunction) => {
        uploadFile.single(field)(req, res, async (err) => {
            if (
                err instanceof multer.MulterError &&
                err.code === 'LIMIT_FILE_SIZE'
            ) {
                return next(
                    new BadRequestError('Файл превышает допустимый размер')
                )
            }

            const file = req.file
            if (!file) {
                return next(new BadRequestError('Файл не загружен'))
            }

            if (file.size < MIN_FILE_SIZE_B) {
                removeFile(file.path)
                return next(
                    new BadRequestError(
                        `Файл слишком маленький. Минимальный размер: ${MIN_FILE_SIZE_B} байт`
                    )
                )
            }

            try {
                await validateMetaData(file.path);
            } catch (err) {
                removeFile(file.path);
                return next(err);
            }
            return next(err)
        })
    }
