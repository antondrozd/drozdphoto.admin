import { message } from 'antd'
import { uid } from 'uid'
import { ThunkAction } from 'redux-thunk'

import firebase, { db, storage, deletePhotos } from '../../firebase'
import {
  compressPhoto,
  createThumbnail,
  createPlaceholder,
  getAspectRatioFromImageFile,
} from '../../utils'
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
export const SET_COVER = 'SET_COVER'

export const SAVE_EDITED_REQUEST = 'SAVE_EDITED_REQUEST'
export const SAVE_EDITED_SUCCESS = 'SAVE_EDITED_SUCCESS'
export const SAVE_EDITED_FAILURE = 'SAVE_EDITED_FAILURE'

export const fetchPhotosetDataRequest = (
  photosetID: string
): ThunkAction<void, IStore, unknown, IGalleryActions> => async (dispatch) => {
  dispatch({ type: FETCH_PHOTOSET_DATA_REQUEST })

  try {
    const docSnapshot = await db.doc(`sets/${photosetID}`).get()
    if (!docSnapshot.exists) {
      const error = new Error('Document does not exist in firestore')
      error.name = 'photoset not found'

      throw error
    }

    const { photos, coverImgSrc } = docSnapshot.data() as IPhotoSet

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
    const [originFileName, fileExt] = file.name.split('.')
    const id = uid()
    const photoName = `${originFileName}-${id}.${fileExt}`
    const thumbName = `${originFileName}-${id}-thumb.${fileExt}`
    const placeholderName = `${originFileName}-${id}-placeholder.${fileExt}`

    const compressedPhoto = await compressPhoto(file)
    const thumbnail = await createThumbnail(compressedPhoto)
    const placeholder = await createPlaceholder(thumbnail)

    const photoToUpload = new File([compressedPhoto], photoName, {
      type: compressedPhoto.type,
    })
    const thumbnailToUpload = new File([thumbnail], thumbName, {
      type: compressedPhoto.type,
    })
    const placeholderToUpload = new File([placeholder], placeholderName, {
      type: compressedPhoto.type,
    })

    const photoRef = storage.ref().child(photoName)
    const thumbnailRef = storage.ref().child(thumbName)
    const placeholderRef = storage.ref().child(placeholderName)

    const photoSnapshot = await photoRef.put(photoToUpload)
    const thumbnailSnapshot = await thumbnailRef.put(thumbnailToUpload)
    const placeholderSnapshot = await placeholderRef.put(placeholderToUpload)

    const photoDownloadURL = await photoSnapshot.ref.getDownloadURL()
    const thumbnailDownloadURL = await thumbnailSnapshot.ref.getDownloadURL()
    const placeholderDownloadURL = await placeholderSnapshot.ref.getDownloadURL()

    const { width, height } = await getAspectRatioFromImageFile(photoToUpload)

    const photo: IPhoto = {
      id,
      src: photoDownloadURL,
      thumbSrc: thumbnailDownloadURL,
      placeholderScr: placeholderDownloadURL,
      width,
      height,
      name: photoName,
      thumbName,
      placeholderName,
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
