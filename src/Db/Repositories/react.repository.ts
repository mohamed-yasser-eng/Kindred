import { Model } from 'mongoose'
import { IReact } from '../../Common'
import { BaseRepository } from './base.repository'

export class ReactRepository extends BaseRepository<IReact> {
  constructor(model: Model<IReact>) {
    super(model)
  }
}
