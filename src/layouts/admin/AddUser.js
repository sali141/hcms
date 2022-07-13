import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { userRoles } from "../../const/userConst";
import { auth, registerWithEmailAndPassword } from "../../firebase";
import useValidator from "../../hooks/useValidator";
import "./Users.css";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();
  const [validator, showValidationMessage] = useValidator();
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (validator.allValid()) {
      setLoading(true);
      await registerWithEmailAndPassword(name, email, password, role);
      navigate("/dashboard");
      setLoading(false);
    } else {
      showValidationMessage(true);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    if (!user) navigate("/");
  }, [user, userLoading]);

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
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
          <div className="row align-items-center">
            <div className="col-md-2">Full Name</div>
            <div className="col-md-10">
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              {validator.message("name", name, "required", {
                messages: {
                  required: "Full Name is required",
                },
              })}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-2">Email</div>
            <div className="col-md-10">
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
              />
              {validator.message("email", email, "required|email", {
                messages: {
                  required: "Email is required",
                },
              })}
            </div>
          </div>

          <div className="row mt-3 align-items-center">
            <div className="col-md-2">Password</div>
            <div className="col-md-10">
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {validator.message("password", password, "required", {
                messages: {
                  required: "Password is required",
                },
              })}
            </div>
          </div>
          <div className="row mt-3 align-items-center">
            <div className="col-md-2">User Role</div>
            <div className="col-md-10">
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
              {validator.message("role", role, "required", {
                messages: {
                  required: "User Role is required",
                },
              })}
            </div>
          </div>
          <div className="form-footer">
            <button className="form_btn" onClick={save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default AddUser;
