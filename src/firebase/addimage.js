// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtaQSamyKvh1OhcoOaT33PAubrfBgW9GY",
  authDomain: "upload-cb0be.firebaseapp.com",
  projectId: "upload-cb0be",
  storageBucket: "upload-cb0be.appspot.com",
  messagingSenderId: "650871893807",
  appId: "1:650871893807:web:a10b610a7525ae0fbc3bda"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAphhwxLkQ_TnitUiZlniZVqIORbsGjPwo",
//   authDomain: "spwt-7325a.firebaseapp.com",
//   projectId: "spwt-7325a",
//   storageBucket: "spwt-7325a.appspot.com",
//   messagingSenderId: "736236772218",
//   appId: "1:736236772218:web:2b4a8bfb0b6531907354c3",
//   measurementId: "G-5XZKXY6DDG"
// };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);