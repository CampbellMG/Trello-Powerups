const isProd = process.env.NODE_ENV === "production"

const warn = (warning: string, extra?: unknown) => {
    if (!isProd) {
        // Dev only
        // eslint-disable-next-line no-console
        console.log(warning, extra)
    }
}

const error = (error: Error, extra?: unknown) => {
    if (!isProd) {
        // Dev only
        // eslint-disable-next-line no-console
        console.error(error, extra)
    }
}

export const Errors = {
    warn,
    error
}
