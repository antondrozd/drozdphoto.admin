import { PhotosetType, TypedAction } from './common.interfaces'
import {
  FETCH_PHOTOS_REQUEST,
  FETCH_PHOTOS_FAILURE,
  FETCH_PHOTOS_SUCCESS,
  REMOVE_PHOTO,
  REORDER_PHOTOS,
  SAVE_EDITED_FAILURE,
  SAVE_EDITED_SUCCESS,
  UPLOAD_PHOTO_FAILURE,
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_PHOTO_REQUEST,
  SAVE_EDITED_REQUEST,
  CLEAR_GALLERY,
} from '../redux/gallery/gallery.actions'

export interface IPhotoSet {
  id: string
  label: string
  routePath: string
  coverImgSrc: string
  type: PhotosetType
  photos: IPhoto[]
}

export interface IPhoto {
  id: string
  src: string
  name: string
  width: number
  height: number
}

export interface IActionFetchPhotosRequest
  extends TypedAction<typeof FETCH_PHOTOS_REQUEST> {}

export interface IActionFetchPhotoSuccess
  extends TypedAction<typeof FETCH_PHOTOS_SUCCESS> {
  payload: IPhoto[]
}

export interface IActionFetchPhotosFailure
  extends TypedAction<typeof FETCH_PHOTOS_FAILURE> {
  payload: any //error
}

export interface IActionReorderPhotos extends TypedAction<typeof REORDER_PHOTOS> {
  payload: IPhoto[]
}

export interface IActionRemovePhoto extends TypedAction<typeof REMOVE_PHOTO> {
  payload: IPhoto
}

export interface IActionClearGallery extends TypedAction<typeof CLEAR_GALLERY> {}

export interface IActionSaveEditedRequest
  extends TypedAction<typeof SAVE_EDITED_REQUEST> {}

export interface IActionSaveEditedSuccess
  extends TypedAction<typeof SAVE_EDITED_SUCCESS> {}

export interface IActionSaveEditedFailure
  extends TypedAction<typeof SAVE_EDITED_FAILURE> {
  payload: any //error
}

export interface IActionUploadPhotoRequest
  extends TypedAction<typeof UPLOAD_PHOTO_REQUEST> {}

export interface IActionUploadPhotoSuccess
  extends TypedAction<typeof UPLOAD_PHOTO_SUCCESS> {
  payload: IPhoto
}

export interface IActionUploadPhotoFailure
  extends TypedAction<typeof UPLOAD_PHOTO_FAILURE> {
  payload: any //error
}

export type IGalleryActions =
  | IActionFetchPhotosRequest
  | IActionFetchPhotoSuccess
  | IActionFetchPhotosFailure
  | IActionReorderPhotos
  | IActionRemovePhoto
  | IActionClearGallery
  | IActionSaveEditedRequest
  | IActionSaveEditedSuccess
  | IActionSaveEditedFailure
  | IActionUploadPhotoRequest
  | IActionUploadPhotoSuccess
  | IActionUploadPhotoFailure
