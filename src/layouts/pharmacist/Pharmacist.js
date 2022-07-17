import React from "react";
// import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase";
export const Pharmacist = (props) => {
  const { setLoading } = props;
  const navigate = useNavigate();

  setLoading(false);
  return (
    <div>
      <div>
        <button
          className="dashboard__btn mr-3"
          onClick={() => {
            navigate("/edit-profile");
          }}
        >
          Edit Profile
        </button>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};
