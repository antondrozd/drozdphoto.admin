import { message } from 'antd'
import { uid } from 'uid'
import { ThunkAction } from 'redux-thunk'

import firebase, { db, storage } from '../../firebase'
import { getAspectRatioFromImageFile } from '../../utils'
import { IPhoto, IGalleryActions, IPhotoSet } from '../../interfaces/gallery.interfaces'
import { IStore } from '../../interfaces/common.interfaces'

export const FETCH_PHOTOS_REQUEST = 'FETCH_PHOTOS_REQUEST'
export const FETCH_PHOTOS_SUCCESS = 'FETCH_PHOTOS_SUCCESS'
export const FETCH_PHOTOS_FAILURE = 'FETCH_PHOTOS_FAILURE'
export const UPLOAD_PHOTO_REQUEST = 'UPLOAD_PHOTO_REQUEST'
export const UPLOAD_PHOTO_SUCCESS = 'UPLOAD_PHOTO_SUCCESS'
export const UPLOAD_PHOTO_FAILURE = 'UPLOAD_PHOTO_FAILURE'

export const REMOVE_PHOTO = 'REMOVE_PHOTO'
export const REORDER_PHOTOS = 'REORDER_PHOTOS'
export const CLEAR_GALLERY = 'CLEAR_GALLERY'
export const SAVE_EDITED_REQUEST = 'SAVE_EDITED_REQUEST'
export const SAVE_EDITED_SUCCESS = 'SAVE_EDITED_SUCCESS'
export const SAVE_EDITED_FAILURE = 'SAVE_EDITED_FAILURE'

export const fetchPhotosRequest = (): ThunkAction<
  void,
  IStore,
  unknown,
  IGalleryActions
> => async (dispatch) => {
  dispatch({ type: FETCH_PHOTOS_REQUEST })

  try {
    const docSnapshot = await db.doc('sets/testset').get()

    const { photos } = docSnapshot.data() as IPhotoSet

    dispatch(fetchPhotosSuccess(photos))
  } catch (error) {
    fetchPhotosFailure(error)
  }
}

const fetchPhotosSuccess = (photos: IPhoto[]): IGalleryActions => ({
  type: FETCH_PHOTOS_SUCCESS,
  payload: photos,
})

const fetchPhotosFailure = (error: any): IGalleryActions => ({
  type: FETCH_PHOTOS_FAILURE,
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

export const saveEditedRequest = (
  photos: IPhoto[],
): ThunkAction<void, IStore, unknown, IGalleryActions> => async (dispatch, getState) => {
  dispatch({ type: SAVE_EDITED_REQUEST })

  try {
    await db.doc('sets/testset').update('photos', photos)

    getState().gallery.editing.photosToDelete.forEach(
      async (photo) => await storage.ref().child(photo.name).delete(),
    )

    dispatch(saveEditedSuccess())
    message.success('Saved')
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
  file: File,
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
      .doc('sets/testset')
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
