import { SHOW_MODAL, HIDE_MODAL } from './modal.actions'

import { IModalActions, ModalType } from '../../interfaces/modal.interface'

export interface IState {
  currentlyActive: ModalType | null
  additionalData: object | null
}

const initialState: IState = {
  currentlyActive: null,
  additionalData: null,
}

const modalReducer = (state = initialState, action: IModalActions): IState => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        currentlyActive: action.payload.type,
        additionalData: action.payload.additionalData,
      }
    case HIDE_MODAL:
      return { ...state, currentlyActive: null, additionalData: null }
    default:
      return state
  }
}

export default modalReducer
