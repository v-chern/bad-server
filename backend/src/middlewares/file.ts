import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { defineUploadDir, defineUniqueFileName } from '../utils/files'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const uploadDir = defineUploadDir();

        cb(
            null,
            uploadDir
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, defineUniqueFileName(file.originalname));
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }
    console.log(file);

    return cb(null, true)
}

export default multer({ storage, fileFilter })
