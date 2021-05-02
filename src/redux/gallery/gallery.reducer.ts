import {
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_PHOTO_FAILURE,
  FETCH_PHOTOSET_DATA_FAILURE,
  FETCH_PHOTOSET_DATA_SUCCESS,
  REMOVE_PHOTO,
  REORDER_PHOTOS,
  SAVE_EDITED_SUCCESS,
  SAVE_EDITED_FAILURE,
  FETCH_PHOTOSET_DATA_REQUEST,
  UPLOAD_PHOTO_REQUEST,
  CLEAR_GALLERY,
  SET_COVER,
} from './gallery.actions'
import { handleGalleryErrors } from './gallery.utils'
import { IGalleryActions, IPhoto } from '../../interfaces/gallery.interfaces'

export interface IState {
  photos: IPhoto[]
  coverImgSrc: string | null
  editing: {
    status: boolean
    photosToDelete: IPhoto[]
  }
  isLoading: boolean
  isPresent: boolean
  error: Error | null
}

const initialState: IState = {
  photos: [],
  coverImgSrc: null,
  editing: {
    status: false,
    photosToDelete: [],
  },
  isLoading: false,
  isPresent: true,
  error: null,
}

const galleryReducer = (state = initialState, action: IGalleryActions): IState => {
  switch (action.type) {
    case FETCH_PHOTOSET_DATA_REQUEST:
      return { ...state, isLoading: true }
    case FETCH_PHOTOSET_DATA_SUCCESS:
      return {
        ...state,
        photos: action.payload.photos,
        coverImgSrc: action.payload.coverImgSrc,
        editing: { ...state.editing, photosToDelete: [], status: false },
        isLoading: false,
        isPresent: true,
        error: null,
      }
    case UPLOAD_PHOTO_REQUEST:
      return { ...state, isLoading: true }
    case UPLOAD_PHOTO_SUCCESS:
      return {
        ...state,
        photos: [...state.photos, action.payload],
        isLoading: false,
      }
    case FETCH_PHOTOSET_DATA_FAILURE:
    case SAVE_EDITED_FAILURE:
    case UPLOAD_PHOTO_FAILURE:
      return handleGalleryErrors(action.payload, state)
    case REMOVE_PHOTO:
      return {
        ...state,
        editing: {
          ...state.editing,
          photosToDelete: [...state.editing.photosToDelete, action.payload],
          status: true,
        },
        photos: state.photos.filter((photo) => photo.id !== action.payload.id),
      }
    case CLEAR_GALLERY:
      return {
        ...state,
        editing: {
          ...state.editing,
          photosToDelete: state.photos,
          status: true,
        },
        photos: [],
      }
    case REORDER_PHOTOS:
      return {
        ...state,
        editing: { ...state.editing, status: true },
        photos: action.payload,
      }
    case SET_COVER:
      return {
        ...state,
        editing: { ...state.editing, status: true },
        coverImgSrc: action.payload,
      }
    case SAVE_EDITED_SUCCESS:
      return {
        ...state,
        editing: { ...state.editing, photosToDelete: [], status: false },
      }
    default:
      return state
  }
}

export default galleryReducer
