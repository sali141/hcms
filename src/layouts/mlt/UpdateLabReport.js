import {
  getDownloadURL,
  ref, uploadBytesResumable
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate, useParams } from "react-router-dom";
import { auth, storage } from "../../firebase";
import {
  fetchAppointmentById, updateAppoinment
} from "../../utils/appointmentUtils";
import { fetchUserDetails, fetchUserDetailsById } from "../../utils/userUtils";

const UpdateLabReport = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [labAppointmentId, setLabAppointmentId] = useState(null);
  const [uploadDoc, setUploadDoc] = useState(null);
  const [doctorUser, setDoctorUser] = useState(null);
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
    const userResp = await fetchUserDetailsById(appResp.docId)
    setDoctorUser(userResp);
    setLabAppointmentId(appResp.labAppointment);
    setAppointment(appResp);
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
              setLoading(false);
            });
          });
        }
      );
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      {appointment && userDetails && (
        <div className="content">
          <div className="dashboard__header">
            <div> Lab Appointment - Ref. No : <strong>{labAppointmentId}</strong></div>
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
                  <div className="col-md-10 py-4">: {doctorUser.name}</div>
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
                              {labAppointmentId && 
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
                                  <button onClick={(e) => uploadDocument(i)}>
                                    Upload
                                  </button>
                                </>
                              )}
                            </div>
                              }
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <div className="form-footer">
                    <>
                      <button
                        className="form_btn mt-3"
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
