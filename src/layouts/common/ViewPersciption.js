import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import { auth, logout } from "../../firebase";
import {
  fetchAppointmentById,
  saveLabAppoinment,
  updateAppoinment,
} from "../../utils/appointmentUtils";
import { fetchUserDetails, fetchUserDetailsById } from "../../utils/userUtils";

const ViewPersciption = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [labAppointmentId, setLabAppointmentId] = useState(null);
  const [isMediIssued, setIsMediIssued] = useState(false);
  const [doctorUser, setDoctorUser] = useState(null);

  const allowedRoles = ["pharmacist", "mlt"];
  const { id } = useParams();

  useEffect(() => {
    if (userLoading) return;
    setLoading(true);

    const fetchUser = async (user) => {
      setLoading(true);
      const resposne = await fetchUserDetails(user);
      if (resposne.error) {
        navigate(`/${id}`);
      } else {
        if (allowedRoles.includes(resposne.role)) {
          setUserDetails(resposne);
          fetchAppointment(id);
        } else {
          navigate(`/dashboard`);
        }
      }
    };

    if (!user) {
      navigate(`/${id}`);
    } else {
      fetchUser(user);
    }
  }, [user, userLoading, id]);

  const fetchAppointment = async (id) => {
    const appResp = await fetchAppointmentById(id);
    const userResp = await fetchUserDetailsById(appResp.docId);
    setDoctorUser(userResp);
    setLabAppointmentId(appResp.labAppointment);
    setAppointment(appResp);
    setLoading(false);
  };

  const updateIssued = async () => {
    if (id) {
      setLoading(true);
      await updateAppoinment(id, {
        issued: true,
      });
      setIsMediIssued(true);
      NotificationManager.success(
        "Medicine issue updated successfully",
        "Issue Medicine"
      );

      setLoading(false);
    }
  };

  const createLabAppointment = async () => {
    const labAppoinment = {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      status: "pending",
    };
    if (appointment.id) {
      setLoading(true);
      const labAppResp = await saveLabAppoinment(labAppoinment);
      if (!labAppResp.error) {
        setLabAppointmentId(labAppResp);
        NotificationManager.success(
          "Lab appointment created successfully",
          "Lab Appointment"
        );
      }
      setLoading(false);
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      {appointment && userDetails && (
        <div className="content">
          <div className="dashboard__header">
            <div>
              {userDetails.role === "pharmacist"
                ? "Persciption"
                : "Lab Reports"}
            </div>
          </div>
          {userDetails.role === "pharmacist" && (
            <div className="form_container">
              {appointment.issued ? (
                <>
                  <div className="error-message mt-3">
                    Medical has already issued for this persciption
                  </div>
                  <button className="form_btn mt-3" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : isMediIssued ? (
                <>
                  <div className="thank-msg">
                    <div>Thank you </div>
                    <div className="lab-ref-no">
                      <span>Persciption has been updated</span>
                    </div>
                  </div>
                  <button className="form_btn mt-3" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <strong>Doctor / Consultant</strong>
                    </div>
                    <div className="col-md-10 py-4">: {doctorUser.name}</div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <strong>Medications</strong>
                    </div>
                    <div className="col-md-10 py-4">
                      {appointment.medications &&
                        appointment.medications.length > 0 && (
                          <ul>
                            {appointment.medications.map((medi, i) => (
                              <li key={i}>
                                {medi.drug} - {medi.drug} - {medi.duration}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </div>
                  <div className="form-footer">
                    <button className="form_btn" onClick={updateIssued}>
                      Medical Issued
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {userDetails.role === "mlt" && (
            <div className="form_container">
              {labAppointmentId ? (
                <>
                  <div className="thank-msg">
                    <div>Thanks you for creating Lab Appointment </div>
                    <div className="lab-ref-no">
                      Ref. No : <span>{labAppointmentId}</span>
                    </div>
                  </div>
                  <button className="form_btn mt-3" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <strong>Doctor / Consultant</strong>
                    </div>
                    <div className="col-md-10 py-4">: {doctorUser.name}</div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <strong>Reports</strong>
                    </div>
                    <div className="col-md-10 py-4">
                      {appointment.reports && appointment.reports.length > 0 && (
                        <div>
                          {appointment.reports.map((rep, i) => (
                            <div key={i} className="row">
                              <div className="col-md-12 d-flex align-items-center">
                                {rep.type} - {rep.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-footer">
                    <button className="form_btn" onClick={createLabAppointment}>
                      Create Lab Appointment
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </LoadingOverlay>
  );
};

export default ViewPersciption;
