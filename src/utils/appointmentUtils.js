import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchAppointmentsList = async (uid) => {
  const list = [];
  try {
    const q = query(collection(db, "appointments"), where("uid", "==", uid));
    const doc = await getDocs(q);
    doc.docs.forEach( d => {
      list.push({...d.data(), id : d.id})
    })
    return list;

  } catch (err) {
    console.log(err);
    return err;
  }
};

export const fetchAppointmentById = async (id) => {
  try {
    const q = query(collection(db, "appointments"), where("__name__", "==", id));
    const doc = await getDocs(q);
    return {...doc.docs[0].data() , id : doc.id};

  } catch (err) {
    return {error : true};
  }
};

export const fetchPatientByMobile = async (mobile) => {
  try {
    const q = query(collection(db, "patients"), where("mobile", "==", mobile));
    const patient = await getDocs(q);
    return {...patient.docs[0].data() , id : patient.docs[0].id};

  } catch (err) {
    console.log(err)
    return {error : true, message : err};
  }
};


export const saveAppoinment = async (patient, appointment) => {
  try {
    if(!patient.id) {
      const savedPatient = await addDoc(collection(db, "patients"),patient);
      appointment['patiendId'] = savedPatient.id;
    } else {
      appointment['patiendId'] = patient.id;
    }
   
    const response = await addDoc(collection(db, "appointments"),appointment);

    console.log(response.id)
    return response;
  } catch (err) {
    return(err);
  }
};

export const updateAppoinment = async (id,appointment) => {
  console.log(appointment)
  try {
    db.collection("appointments").doc(id).update(appointment);
    // const response = await addDoc(collection(db, "appointments"),appointment);
    // return response;
  } catch (err) {
    return(err);
  }
};