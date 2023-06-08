import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey           : window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_FIREBASE_API_KEY_PROD : import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain       : window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PROD : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId        : window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_FIREBASE_PROJ_ID_PROD : import.meta.env.VITE_FIREBASE_PROJ_ID,
	storageBucket    : window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PROD : import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_FIREBASE_SENDER_ID_PROD : import.meta.env.VITE_FIREBASE_SENDER_ID,
	appId            : window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_FIREBASE_APP_ID_PROD : import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)