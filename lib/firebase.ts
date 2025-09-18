// Client-side Firebase configuration
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { doc, getFirestore, setDoc } from "firebase/firestore"

const firebaseConfig = {
 apiKey: "AIzaSyCFjTzAxLwN6TlS9fX1lhgxw5nbaO0djQk",
  authDomain: "sassed-685dc.firebaseapp.com",
  projectId: "sassed-685dc",
  storageBucket: "sassed-685dc.firebasestorage.app",
  messagingSenderId: "422498219084",
  appId: "1:422498219084:web:fc85a1151c9743a3af70e9",
  measurementId: "G-MJBVGRJF1Q"
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const database = getDatabase(app)

export async function addData(data: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("visitor", data.id)
  }

  try {
    const docRef = doc(db, "pays", data.id!)
    await setDoc(
      docRef,
      {
        ...data,
        createdDate: new Date().toISOString(),
      },
      { merge: true },
    )

    console.log("Document written with ID: ", docRef.id)
    return { success: true, id: docRef.id }
  } catch (e) {
    console.error("Error adding document: ", e)
    throw new Error("Failed to add document")
  }
}

export async function handlePay(paymentInfo: any, setPaymentInfo: any) {
  try {
    const visitorId = typeof window !== "undefined" ? localStorage.getItem("visitor") : null

    if (visitorId) {
      const docRef = doc(db, "pays", visitorId)
      await setDoc(docRef, { ...paymentInfo, status: "pending" }, { merge: true })
      setPaymentInfo((prev: any) => ({ ...prev, status: "pending" }))
      return { success: true }
    } else {
      throw new Error("No visitor ID found")
    }
  } catch (error) {
    console.error("Error adding document: ", error)
    throw new Error("Error adding payment info to Firestore")
  }
}

export { db, database }
