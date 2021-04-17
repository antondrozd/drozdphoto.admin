import { message } from 'antd'
import { uid } from 'uid'
import { ThunkAction } from 'redux-thunk'

import firebase, { db, storage, deletePhotos } from '../../firebase'
import { getAspectRatioFromImageFile } from '../../utils'
import {
  IPhoto,
  IGalleryActions,
  IPhotoSet,
  IPhotosetGalleryData,
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
export const SELECT_COVER = 'SELECT_COVER'
export const SAVE_EDITED_REQUEST = 'SAVE_EDITED_REQUEST'
export const SAVE_EDITED_SUCCESS = 'SAVE_EDITED_SUCCESS'
export const SAVE_EDITED_FAILURE = 'SAVE_EDITED_FAILURE'

export const fetchPhotosetDataRequest = (
  photosetID: string
): ThunkAction<void, IStore, unknown, IGalleryActions> => async (dispatch) => {
  dispatch({ type: FETCH_PHOTOSET_DATA_REQUEST })

  try {
    const docSnapshot = await db.doc(`sets/${photosetID}`).get()

    const { photos, coverImgSrc } = docSnapshot.data() as IPhotoSet

    dispatch(fetchPhotosetDataSuccess({ photos, coverImgSrc }))
  } catch (error) {
    fetchPhotosetDataFailure(error)
  }
}

const fetchPhotosetDataSuccess = ({
  photos,
  coverImgSrc,
}: IPhotosetGalleryData): IGalleryActions => ({
  type: FETCH_PHOTOSET_DATA_SUCCESS,
  payload: { photos, coverImgSrc },
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

export const selectCover = (coverImgSrc: string): IGalleryActions => ({
  type: SELECT_COVER,
  payload: coverImgSrc,
})

export const saveEditedRequest = (
  photosetID: string,
  data: IPhotosetGalleryData
): ThunkAction<void, IStore, unknown, IGalleryActions> => async (dispatch, getState) => {
  dispatch({ type: SAVE_EDITED_REQUEST })

  try {
    const { photos, coverImgSrc } = data

    await db
      .doc(`sets/${photosetID}`)
      .update('photos', photos, 'coverImgSrc', coverImgSrc)

    deletePhotos(getState().gallery.editing.photosToDelete)

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
    const [fileName, fileExt] = file.name.split('.')
    const id = uid()

    const renamedFile = new File([file], `${fileName}-${id}.${fileExt}`, {
      type: file.type,
    })

    const fileRef = storage.ref().child(`${renamedFile.name}`)
    const snapshot = await fileRef.put(renamedFile)

    const downloadURL = await snapshot.ref.getDownloadURL()
    const { width, height } = await getAspectRatioFromImageFile(renamedFile)

    const photo = {
      id,
      src: downloadURL,
      width,
      height,
      name: renamedFile.name,
    }

    await db
      .doc(`sets/${photosetID}`)
      .update('photos', firebase.firestore.FieldValue.arrayUnion(photo))

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
