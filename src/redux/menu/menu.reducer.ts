import { FETCH_MENU_ITEMS_SUCCESS, FETCH_MENU_ITEMS_FAILURE } from './menu.actions'
import { IMenuItems, IMenuActions } from '../../interfaces/menu.interface'

export interface IState {
  items: IMenuItems
  error: Error | null
}

const initialState: IState = {
  items: { album: [], serie: [] },
  error: null,
}

const menuReducer = (state = initialState, action: IMenuActions): IState => {
  switch (action.type) {
    case FETCH_MENU_ITEMS_SUCCESS:
      return { ...state, items: action.payload, error: null }
    case FETCH_MENU_ITEMS_FAILURE:
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export default menuReducer
