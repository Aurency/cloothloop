// Import modul Firebase yang dibutuhkan
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlXqSsuRGjce-9v4USNghyv6dTnTmE45o",
  authDomain: "clothloop-dfbb2.firebaseapp.com",
  databaseURL: "https://clothloop-dfbb2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clothloop-dfbb2",
  storageBucket: "clothloop-dfbb2.firebasestorage.app",
  messagingSenderId: "117199771212",
  appId: "1:117199771212:web:9183edc345835e4f10c6e9",
  measurementId: "G-M5S3K35ZQ4"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Modul Firebase yang sering digunakan
const auth = getAuth(app);
const db = getFirestore(app);

// Inisialisasi analytics hanya jika didukung
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Analytics initialized");
    } else {
      console.log("Analytics not supported in this environment");
    }
  });
}

export { app, auth, db, analytics };