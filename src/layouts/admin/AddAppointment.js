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
import useValidator from "../../hooks/useValidator";
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
  const [validator, showValidationMessage] = useValidator();
  const [validatorMobile, showMobileValidationMessage] = useValidator();

  const save = async () => {
    if (validator.allValid()) {
      setLoading(true);
      const appointment = {
        date: appointmentDate.toLocaleDateString(),
        docId: uid,
        medications: [],
        reports: [],
        symptoms: " ",
        status: "booked",
      };
      await saveAppoinment(patient, appointment);
      setLoading(false);
      navigate("/dashboard");
    } else {
      showValidationMessage(true);
    }
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
    if (validatorMobile.allValid()) {
      setShowPatientForm(false);
      setLoading(true);
      const response = await fetchPatientByMobile(searchMobile);
      if (response.error) {
        setShowPatientForm(true);
        setPatientFound(false);
        setPatient({ ...initialPatient , mobile :  searchMobile});
      } else {
        setPatient(response);
        setShowPatientForm(true);
        setPatientFound(true);
      }
      setLoading(false);
    } else {
      showMobileValidationMessage(true);
    }
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
            <div className="row align-items-center">
              <div className="col-md-3">Select Appointment Date</div>
              <div className="col-md-9">
                <DatePicker
                  selected={appointmentDate}
                  onChange={(date) => setAppointmentDate(date)}
                />
                {validator.message(
                  "appointmentDate",
                  appointmentDate,
                  "required",
                  {
                    messages: {
                      required: "Appointment Date is required",
                    },
                  }
                )}
              </div>
            </div>
            <div className="row mt-3 align-items-center">
              <div className="col-md-3">Enter Patient's Mobile Number</div>
              <div className="col-md-9">
                <input
                  value={searchMobile}
                  type="text"
                  onChange={(e) => setSearchMobile(e.target.value)}
                  className="form-input w-25 mr-3"
                />
                <button onClick={searchPatient}>Search</button>
                {validatorMobile.message("Mobile", searchMobile, "required", {
                  messages: {
                    required: "Enter mobile number",
                  },
                })}
              </div>
            </div>
          </div>
          {showPatientForm && (
            <div>
              {!patientFound && (
                <div className="error-message mt-3">
                  Mobile numebr not found. please enter patient details below
                </div>
              )}
              <h3 className="form-title mt-3">
                {patientFound ? "Patient Details" : "Enter Patient Details"}
              </h3>
              <div className="row mt-3 align-items-center">
                <div className="col-md-3">Name</div>
                <div className="col-md-9">
                  <select
                    disabled={patientFound}
                    className="form-input w-10"
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
                  {validator.message("Patient name", patient.name, "required", {
                    messages: {
                      required: "Patient name is required",
                    },
                  })}
                </div>
              </div>
              <div className="row mt-3 align-items-center">
                <div className="col-md-3">Mobile No</div>
                <div className="col-md-9">
                  <input
                    disabled={patientFound}
                    type="text"
                    className="form-input"
                    value={patient.mobile}
                    onChange={(e) =>
                      handlePatientInputChange(e.target.value, "mobile")
                    }
                  />
                  {validator.message(
                    "Patient mobile",
                    patient.mobile,
                    "required",
                    {
                      messages: {
                        required: "Mobile number is required",
                      },
                    }
                  )}
                </div>
              </div>
              <div className="row mt-3 align-items-center">
                <div className="col-md-3">Email</div>
                <div className="col-md-9">
                  <input
                    disabled={patientFound}
                    type="text"
                    className="form-input"
                    value={patient.email}
                    onChange={(e) =>
                      handlePatientInputChange(e.target.value, "email")
                    }
                  />
                  {validator.message(
                    "Patient email",
                    patient.email,
                    "required|email",
                    {
                      messages: {
                        required: "Email is required",
                      },
                    }
                  )}
                </div>
              </div>
              <div className="row mt-3 align-items-center">
                <div className="col-md-3">NIC</div>
                <div className="col-md-9">
                  <input
                    disabled={patientFound}
                    type="text"
                    className="form-input"
                    value={patient.nic}
                    onChange={(e) =>
                      handlePatientInputChange(e.target.value, "nic")
                    }
                  />
                  {validator.message("Patient nic", patient.nic, "required", {
                    messages: {
                      required: "NIC is required",
                    },
                  })}
                </div>
              </div>
              <div className="row mt-3 align-items-center">
                <div className="col-md-3">Age</div>
                <div className="col-md-9">
                  <input
                    disabled={patientFound}
                    type="text"
                    className="form-input w-25"
                    value={patient.age}
                    onChange={(e) =>
                      handlePatientInputChange(e.target.value, "age")
                    }
                  />
                  {validator.message("Patient age", patient.age, "required", {
                    messages: {
                      required: "Age is required",
                    },
                  })}
                </div>
              </div>
              <div className="row mt-3 align-items-center">
                <div className="col-md-3">Gender</div>
                <div className="col-md-9">
                  <select
                    disabled={patientFound}
                    className="form-input w-25"
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
                  {validator.message(
                    "Patient gender",
                    patient.gender,
                    "required",
                    {
                      messages: {
                        required: "Gender is required",
                      },
                    }
                  )}
                </div>
              </div>
              <div className="mt-3 form-footer">
                <button className="form_btn" onClick={save}>
                  Save Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default AddAppointment;
