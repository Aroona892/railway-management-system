export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function notFound() {
  throw new HttpError(404, 'Not found')
}

