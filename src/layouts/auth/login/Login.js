import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../../../firebase";
import useValidator from "../../../hooks/useValidator";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, userLoaded] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [validator, showValidationMessage] = useValidator();
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoaded) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, userLoaded]);

  const handleLoginClick = async () => {
    if (validator.allValid()) {
      setLoading(true);

      await logInWithEmailAndPassword(email, password);
      setLoading(false);
    } else {
      // validator.showMessages();
      // rerender to show messages for the first time
      showValidationMessage(true);
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      <div className="login">
        <div className="login__container">
          <div className="row align-items-center">
            <div className="col-md-4">Email</div>
            <div className="col-md-8">
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
            <div className="col-md-4">Password</div>
            <div className="col-md-8">
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
          <div className="row mt-4 align-items-center">
            <div className="col-md-12">
            <button className="login__btn" onClick={() => handleLoginClick()}>
              Login
            </button>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Login;
