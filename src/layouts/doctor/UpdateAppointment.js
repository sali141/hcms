import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import {
  fetchAppointmentById,
  saveAppoinment,
  updateAppoinment,
} from "../../utils/appointmentUtils";
// import "./Users.css";
import { MdCancel } from "react-icons/md";

const UpdateAppointment = () => {
  const [email, setEmail] = useState("");
  const [patientTitle, setPatienetTitile] = useState("");
  const [patientName, setPatienetName] = useState("");
  const [nic, setNic] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [user, loading] = useAuthState(auth);
  const [appointment, setAppointment] = useState({});
  const [medications, setMedications] = useState([]);
  const [reports, setReports] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const save = async () => {
    // if (!patientName) alert("Please enter name");
      await updateAppoinment(id , {
        medications,
        reports,
        symptoms,
        status : 'completed'
    });
    // navigate("/dashboard");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [user, loading]);

  useEffect(() => {
    const fetchAppointment = async (id) => {
      const resposne = await fetchAppointmentById(id);
      console.log(resposne)
      setAppointment(resposne);
      // setUsers(resposne);
      // setFilteredUsers(resposne);
    };

    fetchAppointment(id);
  }, [id]);

  const addMedication = () => {
    setMedications([...medications, { drug: "", dosage: "", duration: "" }]);
  };

  const removeMedication = (index) => {
    if (medications.length > 0) {
      const tempListItems = [...medications];
      tempListItems.splice(index, 1);
      setMedications(tempListItems);
    }
  };  

  const onMedicationChange = (e, field, index) => {
    setMedications(
      medications.map((medi, i) => {
        return index === i ? { ...medi, [field]: e.target.value } : medi;
      })
    );
  }; 

  const addReport = () => {
    setReports([...reports, { type: "",  duration: "" }]);
  };

  const removeReport = (index) => {
    if (reports.length > 0) {
      const tempListItems = [...reports];
      tempListItems.splice(index, 1);
      setReports(tempListItems);
    }
  };

  const onReportChange = (e, field, index) => {
    setReports(
      reports.map((report, i) => {
        return index === i ? { ...report, [field]: e.target.value } : report;
      })
    );
  };

  return (
    <div className="content">
      <div className="dashboard__header">
        <div>Update Appointments</div>
        <div>
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Back
          </button>
        </div>
      </div>
      <div className="form_container">
        <h3>Patient Details</h3>
        <div className="form-row">
          <label>Name</label>
          <div>
            : {appointment.patientTitle} {appointment.patientName}{" "}
          </div>
        </div>
        <div className="form-row">
          <label>Age</label>
          <div>: {appointment.age}</div>
        </div>
        <div className="form-row">
          <label>Gender</label>
          <div>: {appointment.gender}</div>
        </div>
        <div className="form-row">
          <label>NIC</label>
          <div>: {appointment.nic}</div>
        </div>
        <h3>Symptoms</h3>
        <div className="">
          <div>
            <textarea
              className="form-input-textarea"
              onChange={(e) => setSymptoms(e.target.value)}
              value={symptoms}
            >
              
            </textarea>
          </div>
        </div>
        <h3>
          Medications <span onClick={addMedication}>Add New</span>
        </h3>
        <div className="medications-list">
          {medications.map((medication, index) => (
            <div className="medications-list-item" key={index}>
              <input
                type="text"
                placeholder="Drug"
                value={medication.drug}
                onChange={(e) => onMedicationChange(e, "drug", index)}
              />
              <input
                type="text"
                placeholder="Dosage"
                value={medication.dosage}
                onChange={(e) => onMedicationChange(e, "dosage", index)}
              />
              <input
                type="text"
                placeholder="Duration"
                value={medication.duration}
                onChange={(e) => onMedicationChange(e, "duration", index)}

              />
              <MdCancel onClick={() => removeMedication(index)} />
            </div>
          ))}
        </div>
        <h3>
          Lab Reports <span onClick={addReport}>Add New</span>
        </h3>
        <div className="reports-list">
        {reports.map((report, index) => (
            <div className="reports-list-item" key={index}>
              <input
                type="text"
                placeholder="Type"
                value={report.type}
                onChange={(e) => onReportChange(e, "type", index)}
              />
            
              <input
                type="text"
                placeholder="Duration"
                value={report.duration}
                onChange={(e) => onReportChange(e, "duration", index)}
              />
              <MdCancel onClick={() => removeReport(index)} />
            </div>
          ))}
        </div>
        <div className="form-footer">
          <button className="form_btn" onClick={save}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppointment;
