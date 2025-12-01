import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import { singleFileUpload } from '../middlewares/file'
import auth from '../middlewares/auth'

const uploadRouter = Router()
uploadRouter.post('/', auth, singleFileUpload('file'), uploadFile)

export default uploadRouter
