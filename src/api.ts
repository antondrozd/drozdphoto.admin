import { uid } from 'uid'
import {
  getDocs,
  getDoc,
  query,
  where,
  setDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore'
import { uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { ref, doc, collection } from './firebase'
import {
  compressPhoto,
  createPlaceholder,
  createThumbnail,
  getAspectRatioFromImageFile,
} from './utils'

import {
  IPhoto,
  IPhotoset,
  IPhotosetEditedGalleryData,
  IPortfolioAlbum,
  IMenuItems,
} from './interfaces/gallery.interfaces'

class API {
  getMenuItems = async (): Promise<IMenuItems> => {
    const items: IMenuItems = {
      'portfolio-album': [],
      'serie-album': [],
    }

    const querySnapshot = await getDocs(collection('sets'))

    querySnapshot.forEach((doc) => {
      const { routePath, label, id, type } = doc.data() as IPhotoset

      items[type].push({ routePath, label, id })
    })

    return items
  }

  getCategories = async () => {
    const photosetsSnapshot = await getDocs(
      query(collection('sets'), where('type', '==', 'portfolio-album'))
    )

    const categories = photosetsSnapshot.docs.map((doc) => {
      const { label: category } = doc.data() as IPortfolioAlbum

      return category
    })

    return categories
  }

  getPhotoset = async (photosetID: string) => {
    const docSnapshot = await getDoc(doc(`sets/${photosetID}`))

    if (!docSnapshot.exists) {
      const error = new Error('Document does not exist in firestore')
      error.name = 'photoset not found'

      throw error
    }

    return docSnapshot.data() as IPhotoset
  }

  addPhotoset = async (photoset: IPhotoset) => {
    return setDoc(doc('sets', photoset.id), photoset)
  }

  updatePhotoset = async (photosetID: string, data: IPhotosetEditedGalleryData) => {
    const { photosToDelete, ...galleryData } = data

    await updateDoc(doc('sets', photosetID), { ...galleryData })

    this.deletePhotos(photosToDelete)
  }

  deletePhotos = (photos: IPhoto[]) => {
    photos.forEach(async (photo) => {
      await deleteObject(ref(photo.name))
      await deleteObject(ref(photo.thumbName))
      await deleteObject(ref(photo.placeholderName))
    })
  }

  deletePhotoset = async (photosetID: string) => {
    const docRef = doc('sets', photosetID)
    const docSnapshot = await getDoc(docRef)

    if (!docSnapshot.exists) throw new Error('Document does not exist')

    const { photos } = docSnapshot.data() as IPhotoset

    await deleteDoc(docRef)
    this.deletePhotos(photos)
  }

  uploadPhoto = async (photosetID: string, file: File) => {
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

    const photoRef = ref(photoName)
    const thumbnailRef = ref(thumbName)
    const placeholderRef = ref(placeholderName)

    const photoSnapshot = await uploadBytes(photoRef, photoToUpload)
    const thumbnailSnapshot = await uploadBytes(thumbnailRef, thumbnailToUpload)
    const placeholderSnapshot = await uploadBytes(placeholderRef, placeholderToUpload)

    const photoDownloadURL = await getDownloadURL(photoSnapshot.ref)
    const thumbnailDownloadURL = await getDownloadURL(thumbnailSnapshot.ref)
    const placeholderDownloadURL = await getDownloadURL(placeholderSnapshot.ref)

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

    await updateDoc(doc('sets', photosetID), { photos: arrayUnion(photo) })

    return photo
  }
}

export default new API()
