// Client-side Firebase configuration
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1SM6u61pYP3Uivsnd9o2-xfnIdk3Ci2w",
  authDomain: "tannns-f866c.firebaseapp.com",
  databaseURL: "https://tannns-f866c-default-rtdb.firebaseio.com",
  projectId: "tannns-f866c",
  storageBucket: "tannns-f866c.firebasestorage.app",
  messagingSenderId: "551542084902",
  appId: "1:551542084902:web:16f3ee59d46ee5c3881de7",
  measurementId: "G-PVTG0CY9QF"
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
