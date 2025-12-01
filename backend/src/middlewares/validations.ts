import { Joi, celebrate } from 'celebrate'
import {
    PAGE_DEFAULT,
    PAGE_DEFAULT_SIZE,
    PAGE_MAX_SIZE,
    SEARCH_STR_MAX_LEN,
} from '../contants'
import { Types } from 'mongoose'

export enum StatusType {
    Cancelled = 'cancelled',
    Completed = 'completed',
    New = 'new',
    Delivering = 'delivering',
}

// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^\+?\d[\d\s()-]{3,18}$/
const SORT_FIELDS = ['createdAt', 'totalAmount', 'orderNumber', 'status']
const SORT_ORDERS = ['asc', 'desc']

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

// валидация id
export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Невалидный id' })
                })
            )
            .messages({
                'array.empty': 'Не указаны товары',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Не указан email',
        }),
        phone: Joi.string().required().custom((value, helpers) => {
          const clean = value.replace(/[^\d+]/g, '');

          if (!phoneRegExp.test(clean)) {
            return helpers.error('pattern.invalid');
          }

          return clean; // вернёт нормализованную строку в value
        }).messages({
            'string.empty': 'Не указан телефон',
            'pattern.invalid': 'Некорректный формат телефона',
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Не указан адрес',
        }),
        total: Joi.number().required().messages({
            'string.empty': 'Не указана сумма заказа',
        }),
        comment: Joi.string().optional().allow(''),
    }),
})

// валидация товара.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().required().messages({
            'string.empty': 'Поле "category" должно быть заполнено',
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Поле "description" должно быть заполнено',
        }),
        price: Joi.number().allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string(),
        description: Joi.string(),
        price: Joi.number().allow(null),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.required': 'Поле "email" должно быть заполнено',
            }),
        password: Joi.string().required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
    }),
})

export const validateOrdersQuery = celebrate({
    query: Joi.object({
        page: Joi.number().integer().min(1).default(PAGE_DEFAULT),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(PAGE_MAX_SIZE)
            .default(PAGE_DEFAULT_SIZE),
        search: Joi.string().trim().min(1).max(SEARCH_STR_MAX_LEN),

        sortField: Joi.string()
            .valid(...SORT_FIELDS)
            .default('createdAt'),
        sortOrder: Joi.string()
            .valid(...SORT_ORDERS)
            .default('desc'),

        status: Joi.string().valid(...Object.values(StatusType)),

        totalAmountFrom: Joi.number().min(0),
        totalAmountTo: Joi.number()
            .min(0)
            .when('totalAmountFrom', {
                is: Joi.number().min(0),
                then: Joi.number().min(Joi.ref('totalAmountFrom')),
            }),

        orderDateFrom: Joi.date().iso(),
        orderDateTo: Joi.date()
            .iso()
            .when('orderDateFrom', {
                is: Joi.date().iso(),
                then: Joi.date().min(Joi.ref('orderDateFrom')),
            }),
    }).unknown(false),
})

export const validateOrdersCurrentQuery = celebrate({
    query: Joi.object({
        page: Joi.number().integer().min(1).default(PAGE_DEFAULT),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(PAGE_MAX_SIZE)
            .default(PAGE_DEFAULT_SIZE),
        search: Joi.string().trim().min(1).max(SEARCH_STR_MAX_LEN),
    }).unknown(false),
})

export const validateCustomersQuery = celebrate({
    query: Joi.object({
        page: Joi.number().integer().min(1).default(PAGE_DEFAULT),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(PAGE_MAX_SIZE)
            .default(PAGE_DEFAULT_SIZE),
        search: Joi.string().trim().min(1).max(SEARCH_STR_MAX_LEN),
    }),
})
