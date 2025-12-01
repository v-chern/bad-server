import BadRequestError from '../errors/bad-request-error'

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const normalizeSearch = (rawSearch: unknown) => {
    if (typeof rawSearch !== 'string') {
        throw new BadRequestError('Некорректное значение поискового запроса')
    }
    const escaped = escapeRegExp(rawSearch)
    return new RegExp(escaped, 'i')
}
