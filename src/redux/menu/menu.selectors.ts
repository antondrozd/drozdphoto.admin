import { IStore } from '../../interfaces/common.interfaces'

export const selectMenu = (state: IStore) => state.menu
export const selectMenuItems = (state: IStore) => selectMenu(state).menuItems
