
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCNaTGOLUD-V-cKH5xvwpIqcgyOfBC9Smg",
  authDomain: "mini-hackhathon-43fe8.firebaseapp.com",
  projectId: "mini-hackhathon-43fe8",
  storageBucket: "mini-hackhathon-43fe8.firebasestorage.app",
  messagingSenderId: "927856543313",
  appId: "1:927856543313:web:9df4d171ba5f4be83a9a70",
  databaseURL:"https://mini-hackhathon-43fe8-default-rtdb.firebaseio.com"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export {auth, db};