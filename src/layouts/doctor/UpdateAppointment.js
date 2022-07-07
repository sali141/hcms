import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
// import "./Users.css";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import {
  fetchAppointmentById,
  fetchPatientById, updateAppoinment
} from "../../utils/appointmentUtils";

const UpdateAppointment = () => {
  const [patient, setPatienet] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [user, loading] = useAuthState(auth);
  const [appointment, setAppointment] = useState({});
  const [medications, setMedications] = useState([]);
  const [reports, setReports] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const save = async () => {
    const currAppointment = {...appointment};
    delete currAppointment.id;
    await updateAppoinment(id , { ...currAppointment, 
        medications,
        reports,
        symptoms,
        status : 'completed'
    });
    navigate("/dashboard");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [user, loading]);

  useEffect(() => {
    const fetchAppointment = async (id) => {
      const appResp = await fetchAppointmentById(id);
      setAppointment(appResp)
      const patientResp = await fetchPatientById(appResp.patiendId, appResp.id );
      setPatienet(patientResp);
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

  const downloadQRCode = () => {
    const qrCodeURL = document.getElementById('qrCodeEl')
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log(qrCodeURL)
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  }

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
        <h3 >Patient Details</h3>
        {/* <input
        type="button"
        className="download-btn"
        value="Download"
        onClick={downloadQRCode}
      />
        <QRCodeCanvas
        id="qrCodeEl"
        size={150}
        value={'test'}
      /> */}
        <div className="form-row">
          <label>Name</label>
          <div>
            : {patient.title} {patient.name}{" "}
          </div>
        </div>
        <div className="form-row">
          <label>Age</label>
          <div>: {patient.age}</div>
        </div>
        <div className="form-row">
          <label>Gender</label>
          <div>: {patient.gender}</div>
        </div>
        <div className="form-row">
          <label>NIC</label>
          <div>: {patient.nic}</div>
        </div>
        <h3 className="mt-3">Symptoms</h3>
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
        <h3 className="d-flex align-items-center mt-4">
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
        <h3 className="d-flex align-items-center mt-4">
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
        <div className="form-footer mt-3">
          <button className="form_btn" onClick={save}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppointment;
