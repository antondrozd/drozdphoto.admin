import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

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

export default firebase
