import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyATld-u6gqi5EjqFYhPr-DdwcxgfcCGxGw',
  authDomain: 'instagram-clone-react-cb1af.firebaseapp.com',
  projectId: 'instagram-clone-react-cb1af',
  storageBucket: 'instagram-clone-react-cb1af.appspot.com',
  messagingSenderId: '594930572939',
  appId: '1:594930572939:web:f7422881a0ea7814e73e8e',
}

const firebase = Firebase.initializeApp(config)
const { FieldValue }: any = firebase.firestore
export { firebase, FieldValue }
