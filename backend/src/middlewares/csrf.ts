import csurf from 'csurf'
import { NextFunction, Request, Response } from 'express'

export const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    },
})

export const attachCsrfToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.locals.csrfToken = req.csrfToken()
        next()
    } catch (err) {
        next(err)
    }
}
