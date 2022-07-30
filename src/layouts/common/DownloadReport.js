import React, { useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { NotificationManager } from "react-notifications";
import useValidator from "../../hooks/useValidator";
import {
  fetchAppointmentByLabAppointment,
  fetchPatientByMobile,
} from "../../utils/appointmentUtils";

const DownloadReport = () => {
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [refNo, setRefNo] = useState("");
  const [validator, showValidationMessage] = useValidator();
  const [viewReports, setViewReports] = useState(false);
  const [appointment, setAppointment] = useState(null);

  const handleAuthentication = async () => {
    if (validator.allValid()) {
      setLoading(true);
      const patientResp = await fetchPatientByMobile(mobile);
      console.log(patientResp)

      if (!patientResp.error) {
        const appResp = await fetchAppointmentByLabAppointment(refNo);
        console.log(appResp)
        if (!appResp.error) {
          if (patientResp.id === appResp.patientId) {
            setViewReports(true);
            setAppointment(appResp);
          } else {
            NotificationManager.error(
              "Invalid mobile no , ref no combination",
              "Ref No. validation"
            );
          }
        } else {
          NotificationManager.error(
            "Ref No. can't be authenticated",
            "Ref No. validation"
          );
        }
        // setPatient(response);
      } else {
        NotificationManager.error(
          "Mobile number can't be authenticated",
          "Patient validation"
        );
      }
      setLoading(false);
    } else {
      // validator.showMessages();
      // rerender to show messages for the first time
      showValidationMessage(true);
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      {viewReports && appointment ? (
        <div className="content">
          <div className="dashboard__header">
            <div>Download Reports</div>
          </div>
          <div className="form_container">
          <div className="row align-items-center">
                    <div className="col-md-2">
                      <strong>Reports</strong>
                    </div>
                    <div className="col-md-10 py-4">
                      {appointment.reports && appointment.reports.length > 0 && (
                        <div>
                          {appointment.reports.map((rep, i) => (
                            <div key={i} className="row">
                              <div className="col-md-4 d-flex align-items-center">
                                {rep.type} - {rep.duration}
                                
                              </div>
                              <div className="col-md-4 d-flex align-items-center">
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
                                      REPORT PENDING
                                    </>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
          </div>
        </div>
      ) : (
        <div className="login">
          <div className="login__container">
            <div className="row align-items-center">
              <div className="col-md-4">Mobile No</div>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-input"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile No"
                />
                {validator.message("mobile", setMobile, "required", {
                  messages: {
                    required: "Mobile is required",
                  },
                })}
              </div>
            </div>
            <div className="row mt-3 align-items-center">
              <div className="col-md-4">Ref No.</div>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-input"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="Ref No."
                />
                {validator.message("refNo", refNo, "required", {
                  messages: {
                    required: "Ref No. is required",
                  },
                })}
              </div>
            </div>
            <div className="row mt-4 align-items-center">
              <div className="col-md-12">
                <button
                  className="login__btn"
                  onClick={() => handleAuthentication()}
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadingOverlay>
  );
};

export default DownloadReport;
