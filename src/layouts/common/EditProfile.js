import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import useValidator from "../../hooks/useValidator";
import { fetchUserDetails } from "../../utils/userUtils";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [validator, showValidationMessage] = useValidator();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user) navigate("/");

    const fetchUser = async (user) => {
      const resposne = await fetchUserDetails(user);
      console.log(resposne)
      setUserDetails(resposne);
    };

    fetchUser(user);
  }, [user, userLoading]);

  const save = async () => {
    if (validator.allValid()) {
      // setLoading(true);
      // navigate("/dashboard");
      // setLoading(false);
    } else {
      showValidationMessage(true);
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      <div className="content">
        <div className="dashboard__header">
          <div>Edit Profile</div>
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
          {userDetails &&
          <>
          <div className="row align-items-center">
            <div className="col-md-2">Full Name</div>
            <div className="col-md-10">
              <input
                type="text"
                className="form-input"
                value={userDetails?.name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              {validator.message("name", userDetails?.name, "required", {
                messages: {
                  required: "Full Name is required",
                },
              })}
            </div>
          </div>
          </>
          }
          
          
          <div className="form-footer">
            <button className="form_btn" onClick={save}>
              Update
            </button>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default EditProfile;
