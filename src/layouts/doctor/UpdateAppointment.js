import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
// import "./Users.css";
import { MdCancel } from "react-icons/md";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate, useParams } from "react-router-dom";
import { APP_URL } from "../../config";
import { auth, storage } from "../../firebase";
import useValidator from "../../hooks/useValidator";
import {
  fetchAppointmentById,
  fetchPatientById,
  updateAppoinment,
} from "../../utils/appointmentUtils";
import emailjs from "@emailjs/browser";
import { NotificationManager } from "react-notifications";

const UpdateAppointment = () => {
  const [patient, setPatienet] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [user, userLoading] = useAuthState(auth);
  const [appointment, setAppointment] = useState({});
  const [medications, setMedications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [validator, showValidationMessage] = useValidator();

  const save = async () => {
    if (validator.allValid()) {
      setLoading(true);
      const currAppointment = { ...appointment };
      delete currAppointment.id;
      await updateAppoinment(id, {
        ...currAppointment,
        medications,
        reports,
        symptoms,
        status: "completed",
      });
      NotificationManager.success(
        "Appointment updated successfully",
        "Update Appointment"
      );

      setQrGenerated(true);
      setLoading(false);
    } else {
      showValidationMessage(true);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    if (!user) navigate("/");
  }, [user, userLoading]);

  useEffect(() => {
    const fetchAppointment = async (id) => {
      const appResp = await fetchAppointmentById(id);
      setAppointment(appResp);
      const patientResp = await fetchPatientById(appResp);
      setPatienet(patientResp);

      if (appResp.status === "completed") {
        setQrGenerated(true);
      }
      setLoading(false);
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
    setReports([...reports, { type: "", duration: "" }]);
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
    const qrCodeURL = document
      .getElementById("qrCodeEl")
      .toDataURL("image/jpeg");
    // .replace("image/png", "image/octet-stream");
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = `${appointment.id}_QR_Code.jpg`;
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
    NotificationManager.success(
      "QR Image downloaded successfully",
      "Download QR"
    );
  };

  const emailQRCode = () => {
    setLoading(true);
    const qrCodeURL = document
      .getElementById("qrCodeEl")
      .toDataURL("image/jpeg");
    const storageRef = ref(storage, `qr/${appointment.id}`);
    uploadString(storageRef, qrCodeURL, "data_url").then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const emailParams = {
          to_email: patient.email,
          to_name: patient.name,
          qr_link: downloadURL,
        };
        emailjs
          .send(
            "service_7jgm11c",
            "template_q31copk",
            emailParams,
            "6iAXd-zKTH62g4CU2"
          )
          .then(
            (result) => {
              setLoading(false);
              NotificationManager.success(
                "QR code sent to patient successfully",
                "Send QR"
              );
            },
            (error) => {
              setLoading(false);
              console.log(error);
            }
          );
      });
    });
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      <div className="content">
        <div className="dashboard__header">
          <div>Update Appointment</div>
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
          <h3>
            Patient Details
            <span
              onClick={() => {
                navigate(`/medical-history/${patient.patientId}/${id}`);
              }}
            >
              Patient Medical History
            </span>
          </h3>

          <div className="row align-items-center">
            <div className="col-md-2">Name</div>
            <div className="col-md-10">
              : {patient.title} {patient.name}{" "}
            </div>
          </div>
          <div className="row mt-3  align-items-center">
            <div className="col-md-2">Mobile</div>
            <div className="col-md-10">: {patient.mobile} </div>
          </div>
          <div className="row mt-3  align-items-center">
            <div className="col-md-2">Age</div>
            <div className="col-md-10">: {patient.age}</div>
          </div>
          <div className="row mt-3 align-items-center">
            <div className="col-md-2">Gender</div>
            <div className="col-md-10">: {patient.gender}</div>
          </div>
          <div className="row mt-3 align-items-center">
            <div className="col-md-2">NIC</div>
            <div className="col-md-10">: {patient.nic}</div>
          </div>
          {qrGenerated ? (
            <>
              <div className="d-flex align-items-center justify-content-center">
                <QRCodeCanvas
                  id="qrCodeEl"
                  size={250}
                  value={`${APP_URL}/view-persciption/${appointment.id}`}
                />
              </div>
              <div className="form-footer mt-3">
                <button className="form_btn mr-2" onClick={emailQRCode}>
                  Email QR
                </button>
                <button className="form_btn mr-2" onClick={downloadQRCode}>
                  Download QR
                </button>
                <button
                  className="form_btn"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  Back
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="mt-3">Symptoms</h3>
              <div className="">
                <div>
                  <textarea
                    className="form-input-textarea"
                    onChange={(e) => setSymptoms(e.target.value)}
                    value={symptoms}
                  ></textarea>
                  {validator.message("email", symptoms, "required", {
                    messages: {
                      required: "Please enter Symptoms.",
                    },
                  })}
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
                  Update & Generate QR
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default UpdateAppointment;
