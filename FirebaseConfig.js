import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWUYqW1o9n0etXVZgCOym0-zwNJ0GbNs4",
  authDomain: "geoguessr-tulio.firebaseapp.com",
  projectId: "geoguessr-tulio",
  storageBucket: "geoguessr-tulio.appspot.com",
  messagingSenderId: "877484344095",
  appId: "1:877484344095:web:5e6ea838ad44e1212a662a",
  measurementId: "G-JQKSWGXC0C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };