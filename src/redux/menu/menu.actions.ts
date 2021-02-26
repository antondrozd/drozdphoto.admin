import { db } from '../../firebase'

import { IPhotoSet } from '../../interfaces/gallery.interfaces'
import { IMenuItems, IMenuActions } from '../../interfaces/menu.interface'

export const FETCH_MENU_ITEMS_REQUEST = 'FETCH_MENU_ITEMS_REQUEST'
export const FETCH_MENU_ITEMS_SUCCESS = 'FETCH_MENU_ITEMS_SUCCESS'
export const FETCH_MENU_ITEMS_FAILURE = 'FETCH_MENU_ITEMS_FAILURE'

export const fetchMenuItemsRequest = () => async (dispatch: any) => {
  dispatch({ type: FETCH_MENU_ITEMS_REQUEST })

  try {
    const albums = await (
      await db.collection('sets').where('type', '==', 'album').get()
    ).docs.map((doc) => {
      const { routePath, label, id, type } = doc.data() as IPhotoSet

      return { routePath, label, id, type }
    })
    const series = await (
      await db.collection('sets').where('type', '==', 'serie').get()
    ).docs.map((doc) => {
      const { routePath, label, id, type } = doc.data() as IPhotoSet

      return { routePath, label, id, type }
    })

    dispatch(fetchMenuItemsSuccess({ albums, series }))
  } catch (error) {
    dispatch(fetchMenuItemsFailure(error))
  }
}

const fetchMenuItemsSuccess = (menuItems: IMenuItems): IMenuActions => ({
  type: FETCH_MENU_ITEMS_SUCCESS,
  payload: menuItems,
})

const fetchMenuItemsFailure = (error: any): IMenuActions => ({
  type: FETCH_MENU_ITEMS_FAILURE,
  payload: error,
})
