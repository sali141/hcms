import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword
} from "../../../firebase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, userLoaded] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userLoaded) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, userLoaded]);

  const handleLoginClick = async () => {
    setLoading(true)
    await logInWithEmailAndPassword(email, password);
    setLoading(false)
  }

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
    <div className="login">
      <div className="login__container">
      <div className="form-row">
          <label>Email</label>
          <input
          type="text"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
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
        />
        </div>
        <div className="form_footer">
        <button
          className="login__btn"
          onClick={() => handleLoginClick()}
        >
          Login
        </button>
        </div>
        
      </div>
    </div>
    </LoadingOverlay>
  );
}

export default Login;
