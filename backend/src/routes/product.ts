import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '../controllers/products'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateObjId,
    validateProductBody,
    validateProductUpdateBody,
} from '../middlewares/validations'
import { Role } from '../models/user'
import { normalizePagination } from '../middlewares/pagination'
import { PAGE_DEFAULT, PAGE_DEFAULT_LIMIT, PAGE_MAX_LIMIT } from '../contants'

const productRouter = Router()

productRouter.get(
    '/',
    normalizePagination(PAGE_DEFAULT, PAGE_DEFAULT_LIMIT, PAGE_MAX_LIMIT),
    getProducts
)
productRouter.post(
    '/',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateProductBody,
    createProduct
)
productRouter.delete(
    '/:productId',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    deleteProduct
)
productRouter.patch(
    '/:productId',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    validateProductUpdateBody,
    updateProduct
)

export default productRouter
