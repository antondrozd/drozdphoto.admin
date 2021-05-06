import { ModalType, IModalActions } from '../../interfaces/modal.interface'

export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'

export const showModal = (
  type: ModalType,
  additionalData: object | null = null
): IModalActions => {
  return { type: SHOW_MODAL, payload: { type, additionalData } }
}

export const hideModal = (): IModalActions => ({
  type: HIDE_MODAL,
})
