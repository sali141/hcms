import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { userRoles } from "../../const/userConst";
import { auth, registerWithEmailAndPassword } from "../../firebase";
import "./Users.css";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const save = async () => {
    if (!name) alert("Please enter name");
    await registerWithEmailAndPassword(name, email, password, role);
    navigate("/dashboard");
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [user, loading]);

  return (
    <div className="content">
      <div className="dashboard__header">
        <div>Add New User</div>
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
          <label>Full Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
        </div>
        <div className="form-row">
          <label>E-mail Address</label>
          <input
            type="text"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <label>User Role</label>
          <select
            className="form-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Select..</option>
            {userRoles.map((role, index) => (
              <option key={index} value={role.value}>
                {role.name}
              </option>
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

export default AddUser;
