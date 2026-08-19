import type { ZodError, ZodIssue } from 'zod'

export class ValidationError extends Error {
  public readonly field: string
  public readonly issues: ZodIssue[]

  constructor(message: string, field: string, issues: ZodIssue[] = []) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.issues = issues
  }

  static fromZodError(error: ZodError): ValidationError {
    const firstIssue = error.issues[0]

    if (!firstIssue) {
      return new ValidationError('Validation failed', '', error.issues)
    }

    const field = firstIssue.path.join('.')
    const message = firstIssue.message

    return new ValidationError(message, field, error.issues)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      field: this.field,
      issues: this.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    }
  }
}
