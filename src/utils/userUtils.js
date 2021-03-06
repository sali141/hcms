import { collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUserDetails = async (user) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const usr = await getDocs(q);
    return { ...usr.docs[0].data(), id: usr.docs[0].id };
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchUserDetailsById = async (id) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", id));
    const usr = await getDocs(q);
    return { ...usr.docs[0].data(), id: usr.docs[0].id };
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchUserList = async () => {
  const list = [];
  try {
    const q = query(collection(db, "users"), orderBy('role', 'asc'));
    const doc = await getDocs(q);
    doc.docs.forEach( d => {
      list.push(d.data())
    })
    return list;

  } catch (err) {
    return { error: true, message: err };
  }
};

export const updatePrifile = async (id, profile) => {
  try {
    const response = await updateDoc(doc(db, "users", id), profile);
    return response;
  } catch (err) {
    return { error: true, message: err };
  }
};
