import { existsSync, mkdirSync, rename, unlink } from 'fs'
import { basename, extname, join } from 'path'
import { randomBytes } from 'crypto'

export const movingFile = (imagePath: string, from: string, to: string) => {
    const fileName = basename(imagePath)
    const imagePathTemp = join(from, fileName)
    const imagePathPermanent = join(to, fileName)
    if (!existsSync(imagePathTemp)) {
        throw new Error('Ошибка при сохранении файла')
    }

    rename(imagePathTemp, imagePathPermanent, (err) => {
        if (err) {
            throw new Error('Ошибка при сохранении файла')
        }
    })
}

export const defineUploadDir = () => {
    const uploadDir = process.env.UPLOAD_PATH_TEMP
        ? join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`)
        : join(__dirname, '../public')
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true })
    }
    return uploadDir
}

export const defineUniqueFileName = (orinigalName: string) => {
    const targetName = randomBytes(16).toString('hex') + extname(orinigalName)
    return targetName
}

export const removeFile = (fileName: string) => {
    unlink(fileName, () => {})
}
