import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'
import { validateCustomersQuery } from '../middlewares/validations'
import { normalizePagination } from '../middlewares/pagination'
import { PAGE_DEFAULT, PAGE_DEFAULT_SIZE, PAGE_MAX_SIZE } from '../contants'

const customerRouter = Router()

customerRouter.get(
    '/',
    auth,
    roleGuardMiddleware(Role.Admin),
    normalizePagination(PAGE_DEFAULT, PAGE_DEFAULT_SIZE, PAGE_MAX_SIZE),
    validateCustomersQuery,
    getCustomers
)
customerRouter.get(
    '/:id',
    auth,
    roleGuardMiddleware(Role.Admin),
    getCustomerById
)
customerRouter.patch(
    '/:id',
    auth,
    roleGuardMiddleware(Role.Admin),
    updateCustomer
)
customerRouter.delete(
    '/:id',
    auth,
    roleGuardMiddleware(Role.Admin),
    deleteCustomer
)

export default customerRouter
