// Error personalizado para operaciones de comunidad y gamificación.
export class CommunityError extends Error {
  public readonly code: string

  constructor(message: string, code: string = 'COMMUNITY_ERROR') {
    super(message)
    this.name = 'CommunityError'
    this.code = code
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
    }
  }
}
