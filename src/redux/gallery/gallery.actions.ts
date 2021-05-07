import { message } from 'antd'
import { ThunkAction } from 'redux-thunk'

import API from '../../api'
import {
  IPhoto,
  IGalleryActions,
  IPhotosetGalleryData,
  IPhotosetEditedGalleryData,
} from '../../interfaces/gallery.interfaces'
import { IStore } from '../../interfaces/common.interfaces'

export const FETCH_PHOTOSET_DATA_REQUEST = 'FETCH_PHOTOSET_DATA_REQUEST'
export const FETCH_PHOTOSET_DATA_SUCCESS = 'FETCH_PHOTOSET_DATA_SUCCESS'
export const FETCH_PHOTOSET_DATA_FAILURE = 'FETCH_PHOTOSET_DATA_FAILURE'
export const UPLOAD_PHOTO_REQUEST = 'UPLOAD_PHOTO_REQUEST'
export const UPLOAD_PHOTO_SUCCESS = 'UPLOAD_PHOTO_SUCCESS'
export const UPLOAD_PHOTO_FAILURE = 'UPLOAD_PHOTO_FAILURE'

export const REMOVE_PHOTO = 'REMOVE_PHOTO'
export const REORDER_PHOTOS = 'REORDER_PHOTOS'
export const CLEAR_GALLERY = 'CLEAR_GALLERY'
export const SET_COVER = 'SET_COVER'
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE'

export const SAVE_EDITED_REQUEST = 'SAVE_EDITED_REQUEST'
export const SAVE_EDITED_SUCCESS = 'SAVE_EDITED_SUCCESS'
export const SAVE_EDITED_FAILURE = 'SAVE_EDITED_FAILURE'

export const fetchPhotosetDataRequest = (
  photosetID: string
): ThunkAction<void, IStore, unknown, IGalleryActions> => async (dispatch) => {
  dispatch({ type: FETCH_PHOTOSET_DATA_REQUEST })

  try {
    const { photos, coverImgSrc } = await API.getPhotoset(photosetID)

    dispatch(fetchPhotosetDataSuccess({ photos, coverImgSrc }))
  } catch (error) {
    dispatch(fetchPhotosetDataFailure(error))
  }
}

const fetchPhotosetDataSuccess = (data: IPhotosetGalleryData): IGalleryActions => ({
  type: FETCH_PHOTOSET_DATA_SUCCESS,
  payload: data,
})

const fetchPhotosetDataFailure = (error: any): IGalleryActions => ({
  type: FETCH_PHOTOSET_DATA_FAILURE,
  payload: error,
})

export const reorderPhotos = (photos: IPhoto[]): IGalleryActions => ({
  type: REORDER_PHOTOS,
  payload: photos,
})

export const removePhoto = (photo: IPhoto): IGalleryActions => ({
  type: REMOVE_PHOTO,
  payload: photo,
})

export const clearGallery = (): IGalleryActions => ({
  type: CLEAR_GALLERY,
})

export const setCover = (coverImgSrc: string | null): IGalleryActions => ({
  type: SET_COVER,
  payload: coverImgSrc,
})

export const saveEditedRequest = (
  photosetID: string,
  data: IPhotosetEditedGalleryData
): ThunkAction<void, IStore, unknown, IGalleryActions> => async (dispatch) => {
  dispatch({ type: SAVE_EDITED_REQUEST })

  try {
    await API.updatePhotoset(photosetID, data)

    dispatch(saveEditedSuccess())
    message.success('Збережено!')
  } catch (error) {
    dispatch(saveEditedFailure(error))
    message.error(error)
  }
}

const saveEditedSuccess = (): IGalleryActions => ({
  type: SAVE_EDITED_SUCCESS,
})

const saveEditedFailure = (error: any): IGalleryActions => ({
  type: SAVE_EDITED_FAILURE,
  payload: error,
})

export const uploadPhotoRequest = (
  photosetID: string,
  file: File
): ThunkAction<void, IStore, unknown, IGalleryActions> => async (dispatch: any) => {
  dispatch({ type: UPLOAD_PHOTO_REQUEST })

  try {
    const photo = await API.uploadPhoto(photosetID, file)

    dispatch(uploadPhotoSuccess(photo))
    // message.success(`${file.name} file uploaded successfully.`)
  } catch (error) {
    dispatch(uploadPhotoFailure(error))
    message.error(`${file.name} file upload failed. Error: ${error.message}`)
  }
}

const uploadPhotoSuccess = (photo: IPhoto): IGalleryActions => ({
  type: UPLOAD_PHOTO_SUCCESS,
  payload: photo,
})

const uploadPhotoFailure = (error: any): IGalleryActions => ({
  type: UPLOAD_PHOTO_FAILURE,
  payload: error,
})

export const setInitialState = (): IGalleryActions => ({
  type: SET_INITIAL_STATE,
})
