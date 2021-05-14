import { IStore } from '../../interfaces/common.interfaces'

export const selectGallery = (state: IStore) => state.gallery
export const selectPhotos = (state: IStore) => selectGallery(state).photos
export const selectIsLoading = (state: IStore) => selectGallery(state).isLoading
export const selectIsEdited = (state: IStore) => selectGallery(state).editing.status
export const selectPhotosToDelete = (state: IStore) =>
  selectGallery(state).editing.photosToDelete
export const selectCoverImgSrc = (state: IStore) => selectGallery(state).coverImgSrc
export const selectIsRequestedPhotosetPresent = (state: IStore) =>
  selectGallery(state).isRequestedPhotosetPresent
export const selectMenuItems = (state: IStore) => selectGallery(state).menuItems
export const selectCategories = (state: IStore) =>
  selectGallery(state).menuItems['portfolio-album'].map((item) => item.label)
