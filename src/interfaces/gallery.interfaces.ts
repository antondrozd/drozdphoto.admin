import { PhotosetType, TypedAction } from './common.interfaces'
import {
  FETCH_PHOTOSET_DATA_REQUEST,
  FETCH_PHOTOSET_DATA_FAILURE,
  FETCH_PHOTOSET_DATA_SUCCESS,
  REMOVE_PHOTO,
  REORDER_PHOTOS,
  SAVE_EDITED_FAILURE,
  SAVE_EDITED_SUCCESS,
  UPLOAD_PHOTO_FAILURE,
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_PHOTO_REQUEST,
  SAVE_EDITED_REQUEST,
  CLEAR_GALLERY,
  SET_COVER,
} from '../redux/gallery/gallery.actions'

export interface IPhotoSet {
  id: string
  label: string
  descr: string
  routePath: string
  coverImgSrc: string | null
  type: PhotosetType
  photos: IPhoto[]
}

export class PhotoSet implements IPhotoSet {
  id: string
  label: string
  descr: string
  routePath: string
  coverImgSrc: string | null
  type: PhotosetType
  photos: IPhoto[]

  constructor({
    id,
    label,
    descr,
    type,
  }: {
    id: string
    label: string
    descr: string
    type: PhotosetType
  }) {
    this.id = id
    this.label = label
    this.descr = descr || ''
    this.routePath = `/${id}`
    this.coverImgSrc = null
    this.type = type
    this.photos = []
  }
}

export interface IPhoto {
  id: string
  src: string
  name: string
  width: number
  height: number
}

export type IPhotosetGalleryData = Pick<IPhotoSet, 'coverImgSrc' | 'photos'>
export type IPhotosetMetaData = Pick<IPhotoSet, 'label' | 'descr'>

export interface IActionFetchPhotosetDataRequest
  extends TypedAction<typeof FETCH_PHOTOSET_DATA_REQUEST> {}

export interface IActionFetchPhotosetDataSuccess
  extends TypedAction<typeof FETCH_PHOTOSET_DATA_SUCCESS> {
  payload: IPhotosetGalleryData
}

export interface IActionFetchPhotosetDataFailure
  extends TypedAction<typeof FETCH_PHOTOSET_DATA_FAILURE> {
  payload: any //error
}

export interface IActionReorderPhotos extends TypedAction<typeof REORDER_PHOTOS> {
  payload: IPhoto[]
}

export interface IActionRemovePhoto extends TypedAction<typeof REMOVE_PHOTO> {
  payload: IPhoto
}

export interface IActionClearGallery extends TypedAction<typeof CLEAR_GALLERY> {}

export interface IActionSelectCover extends TypedAction<typeof SET_COVER> {
  payload: string | null
}

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
  | IActionFetchPhotosetDataRequest
  | IActionFetchPhotosetDataSuccess
  | IActionFetchPhotosetDataFailure
  | IActionReorderPhotos
  | IActionRemovePhoto
  | IActionClearGallery
  | IActionSelectCover
  | IActionSaveEditedRequest
  | IActionSaveEditedSuccess
  | IActionSaveEditedFailure
  | IActionUploadPhotoRequest
  | IActionUploadPhotoSuccess
  | IActionUploadPhotoFailure
