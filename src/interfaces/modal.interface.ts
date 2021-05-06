import { PhotosetType, TypedAction } from './common.interfaces'
import { SHOW_MODAL, HIDE_MODAL } from '../redux/modal/modal.actions'

export type ModalType = `add-${PhotosetType}`

export interface IActionShowModal extends TypedAction<typeof SHOW_MODAL> {
  payload: { type: ModalType; additionalData: object | null }
}

export interface IActionHideModal extends TypedAction<typeof HIDE_MODAL> {}

export type IModalActions = IActionShowModal | IActionHideModal
