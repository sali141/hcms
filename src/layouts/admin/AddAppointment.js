import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate, useParams } from "react-router-dom";
import { userGenders, userSalutations } from "../../const/userConst";
import { auth } from "../../firebase";
import {
  fetchPatientByMobile,
  saveAppoinment,
} from "../../utils/appointmentUtils";
import DatePicker from "react-datepicker";
import "./Users.css";
import "react-datepicker/dist/react-datepicker.css";

const AddAppointment = () => {
  const initialPatient = {
    title: "",
    name: "",
    nic: "",
    mobile: "",
    email: "",
    age: "",
    gender: "",
  };
  const [patient, setPatient] = useState(initialPatient);
  const [patientFound, setPatientFound] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [user, userLoaded] = useAuthState(auth);
  const { uid } = useParams();
  const navigate = useNavigate();

  const save = async () => {
    if (!patient.name) {
      alert("Please enter name");
      return;
    }
    const appointment = {
      date: appointmentDate,
      docId: uid,
      medications: [],
      reports: [],
      symptoms: " ",
      status: "booked",
    };
    await saveAppoinment(patient, appointment);
    navigate("/dashboard");
  };

  useEffect(() => {
    if (userLoaded) return;
    if (!user) navigate("/");
  }, [user, userLoaded]);

  const handlePatientInputChange = (value, field) => {
    const currPatient = { ...patient };
    currPatient[field] = value;
    setPatient(currPatient);
  };

  const searchPatient = async () => {
    if (!searchMobile) {
      alert("Please enter mobile number");
      return;
    }
    setShowPatientForm(false);
    setLoading(true);
    const response = await fetchPatientByMobile(searchMobile);
    if (response.error) {
      handlePatientInputChange(searchMobile, "mobile");
      setShowPatientForm(true);
      setPatientFound(false);
      setPatient(initialPatient);
      alert(
        `Patient not found for mobile number ${searchMobile}. please enter details`
      );
    } else {
      setPatient(response);
      setShowPatientForm(true);
      setPatientFound(true);
    }
    setLoading(false);
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      <div className="content">
        <div className="dashboard__header">
          <div>Add Appointment</div>

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
          <div>
            <div className="form-row mb-2">
              <label>Select Appointment Date</label>
              <div className="w-25">
                <DatePicker
                  selected={appointmentDate}
                  onChange={(date) => setAppointmentDate(date)}
                />
              </div>
            </div>
            <div className="form-row mb-2">
              <label>Enter Patient's Mobile Number</label>
              <input
                value={searchMobile}
                type="text"
                onChange={(e) => setSearchMobile(e.target.value)}
                className="form-input w-25 mr-3"
              />
              <button onClick={searchPatient}>Search</button>
            </div>
          </div>
          {showPatientForm && (
            <div>
              <h3 className="form-title">Enter Patient Details</h3>
              <div className="form-row">
                <label>Name</label>
                <div className="d-flex w-75">
                  <select
                    disabled={patientFound}
                    className="form-input w-25"
                    value={patient.title}
                    onChange={(e) =>
                      handlePatientInputChange(e.target.value, "title")
                    }
                  >
                    <option>Select..</option>
                    {userSalutations.map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    disabled={patientFound}
                    type="text"
                    className="form-input w-75"
                    value={patient.name}
                    onChange={(e) =>
                      handlePatientInputChange(e.target.value, "name")
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <label>Mobile No</label>
                <input
                  disabled={patientFound}
                  type="text"
                  className="form-input w-75"
                  value={patient.mobile}
                  onChange={(e) =>
                    handlePatientInputChange(e.target.value, "mobile")
                  }
                />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input
                  disabled={patientFound}
                  type="text"
                  className="form-input w-75"
                  value={patient.email}
                  onChange={(e) =>
                    handlePatientInputChange(e.target.value, "email")
                  }
                />
              </div>
              <div className="form-row">
                <label>NIC</label>
                <input
                  disabled={patientFound}
                  type="text"
                  className="form-input w-75"
                  value={patient.nic}
                  onChange={(e) =>
                    handlePatientInputChange(e.target.value, "nic")
                  }
                />
              </div>
              <div className="form-row">
                <label>Age</label>
                <input
                  disabled={patientFound}
                  type="text"
                  className="form-input w-75"
                  value={patient.age}
                  onChange={(e) =>
                    handlePatientInputChange(e.target.value, "age")
                  }
                />
              </div>
              <div className="form-row">
                <label>Gender</label>
                <select
                  disabled={patientFound}
                  className="form-input w-75"
                  value={patient.gender}
                  onChange={(e) =>
                    handlePatientInputChange(e.target.value, "gender")
                  }
                >
                  <option>Select..</option>
                  {userGenders.map((gender, index) => (
                    <option key={index} value={gender.value}>
                      {gender.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-footer">
            <button className="form_btn" onClick={save}>
              Save Appointment
            </button>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default AddAppointment;
