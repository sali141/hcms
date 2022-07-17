import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query, Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export const fetchAppointmentsList = async (docId) => {
  const list = [];
  const todate = new Date().toLocaleDateString();
  try {
    const q = query(collection(db, "appointments"), where("docId", "==", docId), where("date", "==", todate), orderBy('created', 'asc'));
    const doc = await getDocs(q);
    doc.docs.forEach((d) => {
      list.push({ ...d.data(), id: d.id });
    });
    return list;
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchMedicalHistory = async (patientId) => {
  const list = [];
  try {
    const q = query(collection(db, "appointments"), where("patientId", "==", patientId), where("status", "==", "completed"));
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
    const q = query(collection(db, "patients"), where("__name__", "==", app.patientId));
    const doc = await getDocs(q);
    return { ...doc.docs[0].data(), ...app };
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchPatientDetailsById = async (id) => {
  try {
    const q = query(collection(db, "patients"), where("__name__", "==", id));
    const doc = await getDocs(q);
    return { ...doc.docs[0].data() };
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
      appointment["patientId"] = savedPatient.id;
    } else {
      appointment["patientId"] = patient.id;
    }
    appointment.created = Timestamp.now();

    const response = await addDoc(collection(db, "appointments"), appointment);
    return response;
  } catch (err) {
    return { error: true, message: err };
  }
};

export const updateAppoinment = async (id, appointment) => {
  try {
    appointment.updated = Timestamp.now();
    const response = await updateDoc(doc(db, "appointments", id), appointment);
    return response;
  } catch (err) {
    return { error: true, message: err };
  }
};

export const saveLabAppoinment = async (labAppointment) => {
  try {
    labAppointment.created = Timestamp.now();
    const labApp = await addDoc(collection(db, "lab_appointments"), labAppointment);
    await updateAppoinment(labAppointment.appointmentId, {labAppointment : labApp.id});
    return labApp.id;
  } catch (err) {
    return { error: true, message: err };
  }
};

export const fetchLabAppointmentsList = async (docId) => {
  const list = [];
  try {
    const q = query(collection(db, "lab_appointments"), orderBy('created', 'asc'));
    const doc = await getDocs(q);
    doc.docs.forEach((d) => {
      list.push({ ...d.data(), id: d.id });
    });
    return list;
  } catch (err) {
    return { error: true, message: err };
  }
};