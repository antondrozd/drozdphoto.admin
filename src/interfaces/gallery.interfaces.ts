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
  SET_NO_PHOTOSET_SELECTED,
  FETCH_MENU_ITEMS_REQUEST,
  FETCH_MENU_ITEMS_SUCCESS,
  FETCH_MENU_ITEMS_FAILURE,
} from '../redux/gallery/gallery.actions'

import { TypedAction, PhotosetType } from './common.interfaces'

export interface IPortfolioAlbum {
  id: string
  label: string
  routePath: string
  type: 'portfolio-album'
  photos: IPhoto[]
}

export interface ISerieAlbum {
  id: string
  label: string
  descr: string
  routePath: string
  coverImgSrc: string | null
  type: 'serie-album'
  category: string
  photos: IPhoto[]
}

export type IPhotoset = IPortfolioAlbum | ISerieAlbum

export interface IPhoto {
  id: string
  src: string
  thumbSrc: string
  placeholderScr: string
  name: string
  thumbName: string
  placeholderName: string
  width: number
  height: number
}

export type IPortfolioAlbumGalleryData = Pick<IPortfolioAlbum, 'photos'>
export type ISerieAlbumGalleryData = Pick<ISerieAlbum, 'coverImgSrc' | 'photos'>
export type IPhotosetGalleryData = IPortfolioAlbumGalleryData | ISerieAlbumGalleryData

export type IPortfolioAlbumEditedGalleryData = IPortfolioAlbumGalleryData & {
  photosToDelete: IPhoto[]
}
export type ISerieAlbumEditedGalleryData = ISerieAlbumGalleryData & {
  photosToDelete: IPhoto[]
}
export type IPhotosetEditedGalleryData =
  | IPortfolioAlbumEditedGalleryData
  | ISerieAlbumEditedGalleryData

export type IAlbumMetaData = Pick<IPortfolioAlbum, 'label'>
export type ISerieMetaData = Pick<ISerieAlbum, 'label' | 'descr' | 'category'>
export type IPhotosetMetaData = IAlbumMetaData | ISerieMetaData

export type IMenuItem = Pick<IPhotoset, 'label' | 'routePath' | 'id'>

export type IMenuItems = {
  [key in PhotosetType]: IMenuItem[]
}

export interface IActionFetchMenuItemsRequest
  extends TypedAction<typeof FETCH_MENU_ITEMS_REQUEST> {}

export interface IActionFetchMenuItemsSuccess
  extends TypedAction<typeof FETCH_MENU_ITEMS_SUCCESS> {
  payload: IMenuItems
}

export interface IActionFetchMenuItemsFailure
  extends TypedAction<typeof FETCH_MENU_ITEMS_FAILURE> {
  payload: Error
}

export interface IActionFetchPhotosetDataRequest
  extends TypedAction<typeof FETCH_PHOTOSET_DATA_REQUEST> {}

export interface IActionFetchPhotosetDataSuccess
  extends TypedAction<typeof FETCH_PHOTOSET_DATA_SUCCESS> {
  payload: IPhotosetGalleryData
}

export interface IActionFetchPhotosetDataFailure
  extends TypedAction<typeof FETCH_PHOTOSET_DATA_FAILURE> {
  payload: Error
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
  payload: Error
}

export interface IActionUploadPhotoRequest
  extends TypedAction<typeof UPLOAD_PHOTO_REQUEST> {}

export interface IActionUploadPhotoSuccess
  extends TypedAction<typeof UPLOAD_PHOTO_SUCCESS> {
  payload: IPhoto
}

export interface IActionUploadPhotoFailure
  extends TypedAction<typeof UPLOAD_PHOTO_FAILURE> {
  payload: Error
}

export interface IActionSetInitialState
  extends TypedAction<typeof SET_NO_PHOTOSET_SELECTED> {}

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
  | IActionSetInitialState
  | IActionFetchMenuItemsRequest
  | IActionFetchMenuItemsSuccess
  | IActionFetchMenuItemsFailure
