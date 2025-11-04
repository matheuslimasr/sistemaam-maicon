import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDFcHK7qO8pxQVo7jYzftYs6XOVcC8E36k',
  authDomain: 'agcutelaria-a28b3.firebaseapp.com',
  projectId: 'agcutelaria-a28b3',
  storageBucket: 'agcutelaria-a28b3.appspot.com',
  messagingSenderId: '38311752240',
  appId: '1:38311752240:web:00a4d7f9051f0eb77433f5'
}

// Initialize Firebase
export const firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const authFirebaseConfig = getAuth(firebase_app)
export const databaseFirebaseConfig = getDatabase(firebase_app)

// Initialize Cloud Storage and get a reference to the service
export const storageFirebaseConfig = getStorage(firebase_app)
