import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAjcWGwlOckRRuX-1ls9Ng9Q86rilR2vf8",
  authDomain: "e-prescription-df871.firebaseapp.com",
  projectId: "e-prescription-df871",
  storageBucket: "e-prescription-df871.appspot.com",
  messagingSenderId: "78547884069",
  appId: "1:78547884069:web:46bae129ed2e64bfca87cc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password, role) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const response = await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      role
    });
    return response;
  } catch (err) {
    return(err);
  }
};


const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  storage
};
