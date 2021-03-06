import {
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_PHOTO_FAILURE,
  FETCH_PHOTOS_FAILURE,
  FETCH_PHOTOS_SUCCESS,
  REMOVE_PHOTO,
  REORDER_PHOTOS,
  SAVE_EDITED_SUCCESS,
  SAVE_EDITED_FAILURE,
  FETCH_PHOTOS_REQUEST,
  UPLOAD_PHOTO_REQUEST,
  CLEAR_GALLERY,
} from './gallery.actions'
import { IGalleryActions, IPhoto } from '../../interfaces/gallery.interfaces'

interface IState {
  photos: IPhoto[]
  editing: {
    status: boolean
    photosToDelete: IPhoto[]
  }
  isLoading: boolean
  error: any
}

const initialState: IState = {
  photos: [],
  editing: {
    status: false,
    photosToDelete: [],
  },
  isLoading: false,
  error: null,
}

const galleryReducer = (state = initialState, action: IGalleryActions): IState => {
  switch (action.type) {
    case FETCH_PHOTOS_REQUEST:
      return { ...state, isLoading: true }
    case FETCH_PHOTOS_SUCCESS:
      return {
        ...state,
        photos: action.payload,
        editing: { ...state.editing, photosToDelete: [], status: false },
        isLoading: false,
        error: null,
      }
    case UPLOAD_PHOTO_REQUEST:
      return { ...state, isLoading: true }
    case UPLOAD_PHOTO_SUCCESS:
      return { ...state, photos: [...state.photos, action.payload], isLoading: false }
    case FETCH_PHOTOS_FAILURE:
    case SAVE_EDITED_FAILURE:
    case UPLOAD_PHOTO_FAILURE:
      return { ...state, error: action.payload }
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
