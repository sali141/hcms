import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMedicalHistory,
  fetchPatientDetailsById,
} from "../../utils/appointmentUtils";

const MedicalHistory = () => {
  const navigate = useNavigate();
  const { patientId, appointmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [mediHistory, setMediHistory] = useState([]);
  const [patient, setPatienet] = useState("");

  useEffect(() => {
    const fetchHistory = async (patientId) => {
      const patientResp = await fetchPatientDetailsById(patientId);
      setPatienet(patientResp);

      const historyResp = await fetchMedicalHistory(patientId);
      if (!historyResp.error) {
        setMediHistory(
          historyResp.map((e) => {
            return {
              date: e.date,
              symptoms: e.symptoms,
              medications: e.medications,
              reports: e.reports,
            };
          })
        );
      }

      setLoading(false);
    };

    fetchHistory(patientId);
  }, [patientId]);

  return (
    <div className="content">
      <div className="dashboard__header">
        <div>Medical History</div>
        <div>
          <button
            onClick={() => {
              navigate(`/update-appointment/${appointmentId}`);
            }}
          >
            Back
          </button>
        </div>
      </div>
      <div className="form_container">
        <h3>Patient Details</h3>

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
        <h3 className="mt-3">Medical History</h3>
        {mediHistory && mediHistory.length > 0 ? (
          <table className="style-table">
            <thead>
              <tr>
                <th width={"20%"}>Date</th>
                <th>Symptoms</th>
                <th>Medications</th>
                <th>Lab Reports</th>
              </tr>
            </thead>
            <tbody>
              {mediHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.symptoms}</td>
                  <td>
                    {item.medications && item.medications.length > 0 && (
                      <ul>
                        {item.medications.map((medi, i) => (
                          <li key={i}>
                            {medi.drug} - {medi.drug} - {medi.duration}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    {item.reports && item.reports.length > 0 && (
                      <ul>
                        {item.reports.map((rep, i) => (
                          <li key={i}>
                            {rep.type} - {rep.duration} -{" "}
                            {rep.link && (
                              <a
                                href={rep.link}
                                rel="noreferrer"
                                target="_blank"
                              >
                                download
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="error-message mt-3">
            No history found for this patient
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
