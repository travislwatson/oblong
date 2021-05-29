export class OblongError extends Error {
  allErrors: string[]
  isOblongError: boolean

  constructor(error: string | string[]) {
    const firstError = Array.isArray(error) ? error[0] : error
    super(firstError)
    this.allErrors = Array.isArray(error) ? error : [error]
    this.isOblongError = true
  }
}
