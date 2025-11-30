import { Request, Response, NextFunction } from 'express'

const normalizeNumber = (raw: unknown, def: number) => {
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : def
}

export const normalizePagination = (
    defPage = 1,
    defLimit = 5,
    maxLimit = 10
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const page = normalizeNumber(req.query.page, defPage)
        const limit = Math.min(
            normalizeNumber(req.query.limit, defLimit),
            maxLimit
        )

        req.query.page = String(page)
        req.query.limit = String(limit)
        next()
    }
}
