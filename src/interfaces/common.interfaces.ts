import { Store } from '../redux/store'

export interface TypedAction<T extends string> {
  type: T
}

export interface IStore extends Store {}
