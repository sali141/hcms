import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUserDetails = async (user) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const doc = await getDocs(q);
    return doc.docs[0].data();
  } catch (err) {
    console.log(err);
    return err;
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
    console.log(err);
    return err;
  }
};

