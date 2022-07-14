import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyChdIJtbrb5nJeDTV8SQ-W1flNXrp2g89k',
  authDomain: 'drozd-photo-serverless.firebaseapp.com',
  projectId: 'drozd-photo-serverless',
  storageBucket: 'drozd-photo-serverless.appspot.com',
  messagingSenderId: '456182989687',
  appId: '1:456182989687:web:3f59aae8d1c2b2230a5772',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
