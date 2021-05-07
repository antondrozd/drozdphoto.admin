import { ThunkAction } from 'redux-thunk'

import API from '../../api'

import { IStore } from '../../interfaces/common.interfaces'
import { IMenuActions, IMenuItems } from '../../interfaces/menu.interface'

export const FETCH_MENU_ITEMS_REQUEST = 'FETCH_MENU_ITEMS_REQUEST'
export const FETCH_MENU_ITEMS_SUCCESS = 'FETCH_MENU_ITEMS_SUCCESS'
export const FETCH_MENU_ITEMS_FAILURE = 'FETCH_MENU_ITEMS_FAILURE'

export const fetchMenuItemsRequest = (): ThunkAction<
  void,
  IStore,
  unknown,
  IMenuActions
> => async (dispatch) => {
  dispatch({ type: FETCH_MENU_ITEMS_REQUEST })

  try {
    const items = await API.getMenuItems()

    dispatch(fetchMenuItemsSuccess(items))
  } catch (error) {
    dispatch(fetchMenuItemsFailure(error))
  }
}

export const fetchMenuItemsSuccess = (items: IMenuItems): IMenuActions => ({
  type: FETCH_MENU_ITEMS_SUCCESS,
  payload: items,
})

export const fetchMenuItemsFailure = (error: Error): IMenuActions => ({
  type: FETCH_MENU_ITEMS_FAILURE,
  payload: error,
})
