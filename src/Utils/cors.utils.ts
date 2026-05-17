const parseClientOrigins = (): string[] => {
  return (process.env.CLIENT_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export const allowedClientOrigins = parseClientOrigins()

export const isOriginAllowed = (origin?: string) => {
  if (!origin) return true
  return allowedClientOrigins.includes(origin)
}
