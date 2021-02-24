import { IStore } from '../../interfaces/common.interfaces'

export const selectGallery = (state: IStore) => state.gallery
export const selectPhotos = (state: IStore) => selectGallery(state).photos
export const selectIsLoading = (state: IStore) => selectGallery(state).isLoading
export const selectIsEdited = (state: IStore) => selectGallery(state).editing.status
