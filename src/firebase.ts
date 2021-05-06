import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

import { IPhoto, IPhotoSet } from './interfaces/gallery.interfaces'
import { IMenuItems } from './interfaces/menu.interface'

const firebaseConfig = {
  apiKey: 'AIzaSyChdIJtbrb5nJeDTV8SQ-W1flNXrp2g89k',
  authDomain: 'drozd-photo-serverless.firebaseapp.com',
  projectId: 'drozd-photo-serverless',
  storageBucket: 'drozd-photo-serverless.appspot.com',
  messagingSenderId: '456182989687',
  appId: '1:456182989687:web:3f59aae8d1c2b2230a5772',
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
export const storage = firebase.storage()

// utils
export const getMenuItems = async (): Promise<IMenuItems> => {
  const items: IMenuItems = {
    album: [],
    serie: [],
  }

  try {
    const snapshot = await db.collection('sets').get()

    snapshot.docs.forEach((doc) => {
      const { routePath, label, id, type } = doc.data() as IPhotoSet

      items[type].push({ routePath, label, id })
    })

    return items
  } catch (error) {
    console.error(error)
    return items
  }
}

export const deletePhotos = (photos: IPhoto[]) => {
  photos.forEach(async (photo) => {
    await storage.ref().child(photo.name).delete()
    await storage.ref().child(photo.thumbName).delete()
    await storage.ref().child(photo.placeholderName).delete()
  })
}

export const deletePhotoset = async (photosetID: string) => {
  const docRef = db.doc(`sets/${photosetID}`)
  const docSnapshot = await docRef.get()

  if (!docSnapshot.exists) throw new Error('Document does not exist')

  const { photos } = docSnapshot.data() as IPhotoSet

  await docRef.delete()
  deletePhotos(photos)
}

export default firebase
