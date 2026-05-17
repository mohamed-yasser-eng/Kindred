export interface IMetaResponse {
  status: number
  success: boolean
  message: string
}

export interface IErrorDataResponse {
  context?: object
}

export interface ISuccessResponse<T = unknown> {
  meta: IMetaResponse
  data?: T
}

export interface IFailedResponse {
  meta: IMetaResponse
  error?: IErrorDataResponse
}
