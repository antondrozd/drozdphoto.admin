import { uid } from 'uid'

import firebase, { db, storage } from './firebase'
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

    const querySnapshot = await db.collection('sets').get()

    querySnapshot.forEach((doc) => {
      const { routePath, label, id, type } = doc.data() as IPhotoset

      items[type].push({ routePath, label, id })
    })

    return items
  }

  getCategories = async () => {
    const photosetsSnapshot = await db
      .collection('sets')
      .where('type', '==', 'portfolio-album')
      .get()

    const categories = photosetsSnapshot.docs.map((doc) => {
      const { label: category } = doc.data() as IPortfolioAlbum

      return category
    })

    return categories
  }

  getPhotoset = async (photosetID: string) => {
    const docSnapshot = await db.doc(`sets/${photosetID}`).get()

    if (!docSnapshot.exists) {
      const error = new Error('Document does not exist in firestore')
      error.name = 'photoset not found'

      throw error
    }

    return docSnapshot.data() as IPhotoset
  }

  addPhotoset = async (photoset: IPhotoset) => {
    return db.collection('sets').doc(photoset.id).set(photoset)
  }

  updatePhotoset = async (photosetID: string, data: IPhotosetEditedGalleryData) => {
    const { photosToDelete, ...galleryData } = data

    await db.doc(`sets/${photosetID}`).update(galleryData)

    this.deletePhotos(photosToDelete)
  }

  deletePhotos = (photos: IPhoto[]) => {
    photos.forEach(async (photo) => {
      await storage.ref().child(photo.name).delete()
      await storage.ref().child(photo.thumbName).delete()
      await storage.ref().child(photo.placeholderName).delete()
    })
  }

  deletePhotoset = async (photosetID: string) => {
    const docRef = db.doc(`sets/${photosetID}`)
    const docSnapshot = await docRef.get()

    if (!docSnapshot.exists) throw new Error('Document does not exist')

    const { photos } = docSnapshot.data() as IPhotoset

    await docRef.delete()
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

    const photoRef = storage.ref().child(photoName)
    const thumbnailRef = storage.ref().child(thumbName)
    const placeholderRef = storage.ref().child(placeholderName)

    const photoSnapshot = await photoRef.put(photoToUpload)
    const thumbnailSnapshot = await thumbnailRef.put(thumbnailToUpload)
    const placeholderSnapshot = await placeholderRef.put(placeholderToUpload)

    const photoDownloadURL = await photoSnapshot.ref.getDownloadURL()
    const thumbnailDownloadURL = await thumbnailSnapshot.ref.getDownloadURL()
    const placeholderDownloadURL = await placeholderSnapshot.ref.getDownloadURL()

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

    await db
      .doc(`sets/${photosetID}`)
      .update('photos', firebase.firestore.FieldValue.arrayUnion(photo))

    return photo
  }
}

const api = new API()

export default api
