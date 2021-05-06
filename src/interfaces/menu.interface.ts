import { TypedAction } from './common.interfaces'
import { IPhotoSet } from './gallery.interfaces'

import {
  FETCH_MENU_ITEMS_REQUEST,
  FETCH_MENU_ITEMS_SUCCESS,
  FETCH_MENU_ITEMS_FAILURE,
} from '../redux/menu/menu.actions'

export type IMenuItem = Pick<IPhotoSet, 'label' | 'routePath' | 'id'>

export interface IMenuItems {
  album: IMenuItem[]
  serie: IMenuItem[]
}

export interface IActionFetchMenuItemsRequest
  extends TypedAction<typeof FETCH_MENU_ITEMS_REQUEST> {}

export interface IActionFetchMenuItemsSuccess
  extends TypedAction<typeof FETCH_MENU_ITEMS_SUCCESS> {
  payload: IMenuItems
}

export interface IActionFetchMenuItemsFailure
  extends TypedAction<typeof FETCH_MENU_ITEMS_FAILURE> {
  payload: Error
}

export type IMenuActions =
  | IActionFetchMenuItemsRequest
  | IActionFetchMenuItemsSuccess
  | IActionFetchMenuItemsFailure
