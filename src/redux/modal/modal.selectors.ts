import { IStore } from '../../interfaces/common.interfaces'

export const selectModal = (state: IStore) => state.modal
export const selectActiveModal = (state: IStore) => selectModal(state).currentlyActive
