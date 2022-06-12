import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { userGenders, userSalutations } from "../../const/userConst";
import { auth } from "../../firebase";
import { saveAppoinment } from "../../utils/appointmentUtils";
import "./Users.css";

const AddAppointment = () => {
  const [email, setEmail] = useState("");
  const [patientTitle, setPatienetTitile] = useState("");
  const [patientName, setPatienetName] = useState("");
  const [nic, setNic] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [user, loading] = useAuthState(auth);
  const { uid } = useParams();
  const navigate = useNavigate();

  const save = async () => {
    if (!patientName) alert("Please enter name");
      await saveAppoinment({
      patientTitle,
      patientName,
      nic,
      email,
      age,
      gender,
      uid : uid,
      status : 'booked'
    });
    navigate("/dashboard");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [user, loading]);

  return (
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
        <div className="form-row">
          <label>Partient Title</label>
          <select
            className="form-input"
            value={patientTitle}
            onChange={(e) => setPatienetTitile(e.target.value)}
          >
            <option>Select..</option>
            {userSalutations.map((item, index) => (
              <option key={index} value={item.value}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Partient Name</label>
          <input
            type="text"
            className="form-input"
            value={patientName}
            onChange={(e) => setPatienetName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Partient Email</label>
          <input
            type="text"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Partient NIC</label>
          <input
            type="text"
            className="form-input"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Partient Age</label>
          <input
            type="text"
            className="form-input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Partient Gender</label>
          <select
            className="form-input"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Select..</option>
            {userGenders.map((gender, index) => (
              <option key={index}  value={gender.value}>{gender.name}</option>
            ))}
          </select>
        </div>
        <div className="form-footer">
          <button className="form_btn" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;
