import { Router } from 'express'
import { authentication, validationMiddleware } from '../../Middlewares'
import reactService from './services/react.service'
import { ReactTargetParamsValidator, UpsertReactValidator } from '../../Validators'

const reactController = Router()

reactController.post('/', authentication, validationMiddleware(UpsertReactValidator), reactService.upsertReact)
reactController.get('/:onModel/:refId', authentication, validationMiddleware(ReactTargetParamsValidator), reactService.listReacts)
reactController.delete('/:onModel/:refId', authentication, validationMiddleware(ReactTargetParamsValidator), reactService.deleteReact)

export { reactController }
