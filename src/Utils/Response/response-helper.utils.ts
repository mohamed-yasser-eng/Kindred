import { IFailedResponse, ISuccessResponse } from '../../Common'

export function SuccessResponse<T>(message = 'request is processed successfully', status = 200, data?: T): ISuccessResponse<T> {
  const response: ISuccessResponse<T> = {
    meta: {
      status,
      success: true,
      message,
    },
  }

  if (data !== undefined) response.data = data

  return response
}

export function FailedResponse(message = 'request processing failed', status = 500, error?: object): IFailedResponse {
  const response: IFailedResponse = {
    meta: {
      status,
      success: false,
      message,
    },
  }

  if (error !== undefined) response.error = { context: error }

  return response
}
