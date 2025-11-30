import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { normalizePagination } from '../middlewares/pagination'
import { Role } from '../models/user'
import {
  PAGE_DEFAULT,
  PAGE_DEFAULT_LIMIT,
  PAGE_MAX_LIMIT
} from '../contants';

const orderRouter = Router()

orderRouter.post(
  '/',
  auth,
  validateOrderBody,
  createOrder
);
orderRouter.get(
  '/all',
  auth,
  normalizePagination(PAGE_DEFAULT, PAGE_DEFAULT_LIMIT, PAGE_MAX_LIMIT),
  roleGuardMiddleware(Role.Admin),
  getOrders
);
orderRouter.get(
  '/all/me',
  auth,
  normalizePagination(PAGE_DEFAULT, PAGE_DEFAULT_LIMIT, PAGE_MAX_LIMIT),
  getOrdersCurrentUser
);
orderRouter.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
);
orderRouter.get('/me/:orderNumber', auth, getOrderCurrentUserByNumber)
orderRouter.patch(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    updateOrder
);

orderRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteOrder);

export default orderRouter
