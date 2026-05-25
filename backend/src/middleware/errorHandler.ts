import type { Request, Response, NextFunction } from 'express'
import type { ZodError } from 'zod'

export function errorHandler(
  err: Error & { code?: string; status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err.message, err.stack)

  if (err.code === 'P2002') {
    res.status(409).json({
      error: 'Resource already exists',
      details: err.message,
    })
    return
  }

  if (err.code === 'P2025') {
    res.status(404).json({
      error: 'Resource not found',
    })
    return
  }

  if ('issues' in err) {
    const zodError = err as unknown as ZodError
    res.status(400).json({
      error: 'Validation failed',
      details: zodError.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  res.status(err.status ?? 500).json({
    error: err.message || 'Internal server error',
  })
}
