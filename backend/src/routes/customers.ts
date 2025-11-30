import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth from '../middlewares/auth'
import { normalizePagination } from '../middlewares/pagination'
import {
  PAGE_DEFAULT,
  PAGE_DEFAULT_LIMIT,
  PAGE_MAX_LIMIT
} from '../contants';

const customerRouter = Router()

customerRouter.get('/', auth, normalizePagination(PAGE_DEFAULT, PAGE_DEFAULT_LIMIT, PAGE_MAX_LIMIT), getCustomers)
customerRouter.get('/:id', auth, getCustomerById)
customerRouter.patch('/:id', auth, updateCustomer)
customerRouter.delete('/:id', auth, deleteCustomer)

export default customerRouter
