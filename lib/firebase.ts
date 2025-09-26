// Client-side Firebase configuration
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgaoqCdnsft-7OeF8hZaX1gLB_cCcDsNE",
  authDomain: "dzttsa.firebaseapp.com",
  databaseURL: "https://dzttsa-default-rtdb.firebaseio.com",
  projectId: "dzttsa",
  storageBucket: "dzttsa.firebasestorage.app",
  messagingSenderId: "700845190471",
  appId: "1:700845190471:web:bd56ec43a0108a2d69b062",
  measurementId: "G-XT6ZYZ7VPQ"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export async function addData(data: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("visitor", data.id);
  }
  try {
    const docRef = doc(db, "pays", data.id!);
    await setDoc(
      docRef,
      {
        ...data,
        createdDate: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to add document");
  }
}

export { db, database };
