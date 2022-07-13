import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import useValidator from "../../hooks/useValidator";
import {
  fetchAppointmentById,
  updateAppoinment,
} from "../../utils/appointmentUtils";

const ViewPersciption = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [validator, showValidationMessage] = useValidator();
  const [appointment, setAppointment] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (userLoading) return;
    if (!user) navigate(`/${id}`);
  }, [user, userLoading,id]);

  useEffect(() => {
    const fetchAppointment = async (id) => {
      const appResp = await fetchAppointmentById(id);
      setAppointment(appResp);
      setLoading(false);
    };

    fetchAppointment(id);
  }, [id]);

  const save = async () => {
    if (validator.allValid()) {
      setLoading(true);
      await updateAppoinment(id, {
        issued: true,
      });
      navigate("/dashboard");
      setLoading(false);
    } else {
      showValidationMessage(true);
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      <div className="content">
        <div className="dashboard__header">
          <div>View Persciption</div>
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
          {appointment &&
            (appointment.issued ? (
              <div className="error-message mt-3">
                Medical has already issues for this persciption
              </div>
            ) : (
              <>
                <div className="row align-items-center">
                  <div className="col-md-2">Symptoms</div>
                  <div className="col-md-10 py-4">{appointment.symptoms}</div>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-2">Medications</div>
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
                  <button className="form_btn" onClick={save}>
                    Issued
                  </button>
                  <button
                    className="form_btn ml-3"
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ))}
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default ViewPersciption;
