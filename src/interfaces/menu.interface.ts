import { TypedAction } from './common.interfaces'
import {
  FETCH_MENU_ITEMS_REQUEST,
  FETCH_MENU_ITEMS_SUCCESS,
  FETCH_MENU_ITEMS_FAILURE,
} from '../redux/menu/menu.actions'

export interface IMenuItem {
  label: string
  routePath: string
  id: string
  type: string
}

export interface IMenuItems {
  albums: IMenuItem[]
  series: IMenuItem[]
}

interface IActionFetchMenuItemsRequest
  extends TypedAction<typeof FETCH_MENU_ITEMS_REQUEST> {}

interface IActionFetchMenuItemsSuccess
  extends TypedAction<typeof FETCH_MENU_ITEMS_SUCCESS> {
  payload: IMenuItems
}

interface IActionFetchMenuItemsFailure
  extends TypedAction<typeof FETCH_MENU_ITEMS_FAILURE> {
  payload: any // error
}

export type IMenuActions =
  | IActionFetchMenuItemsRequest
  | IActionFetchMenuItemsSuccess
  | IActionFetchMenuItemsFailure
