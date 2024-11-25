import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCtBLVQZ-_Z7aJ0x3ue3KEDzvaj-br3Ivo",
  authDomain: "pi-react-bmrg.firebaseapp.com",
  projectId: "pi-react-bmrg",
  storageBucket: "pi-react-bmrg.firebasestorage.app",
  messagingSenderId: "202775543740",
  appId: "1:202775543740:web:57924ea91d40d5b39cb5b9"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = app.firestore();