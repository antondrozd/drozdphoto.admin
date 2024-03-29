import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc as firestoreDoc,
  collection as firestoreCollection,
} from 'firebase/firestore'
import { getStorage, ref as firebaseRef } from 'firebase/storage'
import * as R from 'ramda'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'drozd-photo-serverless.firebaseapp.com',
  projectId: 'drozd-photo-serverless',
  storageBucket: 'drozd-photo-serverless.appspot.com',
  messagingSenderId: '456182989687',
  appId: '1:456182989687:web:3f59aae8d1c2b2230a5772',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)

export const collection = R.partial(firestoreCollection, [db])
export const doc = R.partial(firestoreDoc, [db])

export const ref = R.partial(firebaseRef, [storage])

export default app
