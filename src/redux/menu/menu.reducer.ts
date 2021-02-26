import { FETCH_MENU_ITEMS_SUCCESS, FETCH_MENU_ITEMS_FAILURE } from './menu.actions'

import { IMenuItems, IMenuActions } from '../../interfaces/menu.interface'

interface IState {
  menuItems: IMenuItems
  error: null
}

const initialState: IState = { menuItems: { albums: [], series: [] }, error: null }

const menuReducer = (state = initialState, action: IMenuActions): IState => {
  switch (action.type) {
    case FETCH_MENU_ITEMS_SUCCESS:
      return {
        ...state,
        menuItems: action.payload,
        error: null,
      }
    case FETCH_MENU_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

export default menuReducer
