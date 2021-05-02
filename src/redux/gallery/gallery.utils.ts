import { IState } from './gallery.reducer'

export const handleGalleryErrors = (error: Error, state: IState) => {
  switch (error.name) {
    case 'photoset not found':
      return { ...state, error, isPresent: false }
    default:
      return { ...state, error }
  }
}
