import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const fetchAppointmentsList = async (uid) => {
  const list = [];
  try {
    const q = query(collection(db, "appointments"), where("docId", "==", uid));
    const doc = await getDocs(q);
    doc.docs.forEach((d) => {
      list.push({ ...d.data(), id: d.id });
    });
    return list;
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchAppointmentById = async (id) => {
  try {
    const q = query(
      collection(db, "appointments"),
      where("__name__", "==", id)
    );
    const doc = await getDocs(q);
    return { ...doc.docs[0].data(), id: doc.docs[0].id };
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchPatientById = async (app) => {
  try {
    const q = query(collection(db, "patients"), where("__name__", "==", app.patiendId));
    const doc = await getDocs(q);
    return { ...doc.docs[0].data(), ...app };
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchPatientByMobile = async (mobile) => {
  try {
    const q = query(collection(db, "patients"), where("mobile", "==", mobile));
    const patient = await getDocs(q);
    return { ...patient.docs[0].data(), id: patient.docs[0].id };
  } catch (err) {
    return { error: true, message: err };
  }
};

export const saveAppoinment = async (patient, appointment) => {
  try {
    if (!patient.id) {
      const savedPatient = await addDoc(collection(db, "patients"), patient);
      appointment["patiendId"] = savedPatient.id;
    } else {
      appointment["patiendId"] = patient.id;
    }

    const response = await addDoc(collection(db, "appointments"), appointment);
    return response;
  } catch (err) {
    return { error: true, message: err };
  }
};

export const updateAppoinment = async (id, appointment) => {
  try {
    const response = await setDoc(doc(db, "appointments", id), appointment);
    return response;
  } catch (err) {
    return { error: true, message: err };
  }
};
