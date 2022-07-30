import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import { auth, storage } from "../../firebase";
import {
  fetchAppointmentById,
  updateAppoinment,
  fetchPatientById
} from "../../utils/appointmentUtils";
import { fetchUserDetails, fetchUserDetailsById } from "../../utils/userUtils";
import emailjs from "@emailjs/browser";
import { APP_URL } from "../../config";

const UpdateLabReport = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [labAppointmentId, setLabAppointmentId] = useState(null);
  const [uploadDoc, setUploadDoc] = useState(null);
  const [doctorUser, setDoctorUser] = useState(null);
  const [patient, setPatienet] = useState(null);

  const allowedRoles = ["mlt"];
  const { id } = useParams();

  useEffect(() => {
    if (userLoading) return;

    const fetchUser = async (user) => {
      const resposne = await fetchUserDetails(user);
      if (resposne.error) {
        navigate(`/`);
      } else {
        if (allowedRoles.includes(resposne.role)) {
          setUserDetails(resposne);
          fetchAppointment(id);
        } else {
          navigate(`/dashboard`);
        }
      }
      setLoading(false);
    };

    if (!user) {
      navigate(`/`);
    } else {
      fetchUser(user);
    }
  }, [user, userLoading, id]);

  const fetchAppointment = async (id) => {
    const appResp = await fetchAppointmentById(id);
    if (!appResp.error) {
      setAppointment(appResp);
      const userResp = await fetchUserDetailsById(appResp.docId);
      const patientResp = await fetchPatientById(appResp);
      setPatienet(patientResp);
      setDoctorUser(userResp);
      setLabAppointmentId(appResp.labAppointment);
    }
    
    setLoading(false);
  };

  const uploadDocument = async (index) => {
    if (uploadDoc) {
      const docRef = ref(storage, `reports/${labAppointmentId}_${index}`);
      const uploadTask = uploadBytesResumable(docRef, uploadDoc);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const updatedReports = appointment.reports.map((rep, i) => {
              if (i === index) {
                rep.link = downloadURL;
              }
              return rep;
            });

            updateAppoinment(appointment.id, {
              reports: updatedReports,
            }).then(() => {
              NotificationManager.success(
                "Report uploaded successfully",
                "Upload Report"
              );

              setLoading(false);
            });
          });
        }
      );
    }
  };

  const sendReports = () => {
    const emailParams = {
      to_email: patient.email,
      to_name: patient.name,
      report_link: `${APP_URL}/download-report`,
      ref_no : appointment.labAppointment
    };
    emailjs
      .send(
        "service_7jgm11c",
        "template_il0l9wz",
        emailParams,
        "6iAXd-zKTH62g4CU2"
      )
      .then(
        (result) => {
          setLoading(false);
          NotificationManager.success(
            "Report download link to patient successfully",
            "Send Report"
          );
        },
        (error) => {
          setLoading(false);
          console.log(error);
        }
      );
  }

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      {appointment && userDetails && (
        <div className="content">
          <div className="dashboard__header">
            <div>
              {" "}
              Lab Appointment - Ref. No : <strong>{labAppointmentId}</strong>
            </div>
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
          {userDetails.role === "mlt" && (
            <div className="form_container">
              <>
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <strong>Doctor / Consultant</strong>
                  </div>
                  <div className="col-md-10 py-4">: {doctorUser?.name}</div>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-12">
                    <strong>Reports</strong>
                  </div>
                  <div className="col-md-10 py-4">
                    {appointment.medications &&
                      appointment.medications.length > 0 && (
                        <div>
                          {appointment.reports.map((rep, i) => (
                            <div key={i} className="row mb-2">
                              <div className="col-md-4 d-flex align-items-center">
                                {rep.type} - {rep.duration}
                              </div>
                              {labAppointmentId && (
                                <div className="col-md-8">
                                  {rep.link ? (
                                    <a
                                      href={rep.link}
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      DOWNLOAD
                                    </a>
                                  ) : (
                                    <>
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          setUploadDoc(e.target.files[0])
                                        }
                                      ></input>
                                      <button
                                        onClick={(e) => uploadDocument(i)}
                                      >
                                        Upload
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <div className="form-footer">
                  <>
                    <button className="form_btn mr-2" onClick={sendReports}>
                      Send Reports to Patient
                    </button>
                    <button
                      className="form_btn"
                      onClick={() => {
                        navigate("/dashboard");
                      }}
                    >
                      Back
                    </button>
                  </>
                </div>
              </>
            </div>
          )}
        </div>
      )}
    </LoadingOverlay>
  );
};

export default UpdateLabReport;
