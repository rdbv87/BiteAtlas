let firestoreReadsEnabled = true

export function canUseFirestoreReads(): boolean {
  return firestoreReadsEnabled
}

export function disableFirestoreReads(): void {
  firestoreReadsEnabled = false
}

export function isMissingDefaultFirestoreDatabase(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()

  return (
    message.includes("database '(default)' not found") ||
    message.includes('database "(default)" not found') ||
    (message.includes('firestore') && message.includes('not found'))
  )
}
