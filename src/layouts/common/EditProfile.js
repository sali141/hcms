import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { userGenders, docSpecilizations } from "../../const/userConst";
import { auth } from "../../firebase";
import useValidator from "../../hooks/useValidator";
import { fetchUserDetails, updatePrifile } from "../../utils/userUtils";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [validator, showValidationMessage] = useValidator();
  const [profile, setProfile] = useState({});
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user) navigate("/");
    setLoading(true);
    const fetchUser = async (user) => {
      const resposne = await fetchUserDetails(user);
      setUserDetails(resposne);
      setProfile({
        name: resposne.name,
        gender: resposne.gender || "",
        address: resposne.address || "",
        phone: resposne.phone || "",
        nic: resposne.nic || "",
        regNo: resposne.regNo || "",
        location: resposne.location || "",
        specialization: resposne.specialization || "",
      });
      setLoading(false);
    };

    fetchUser(user);
  }, [user, userLoading]);

  const save = async () => {
    if (validator.allValid()) {
      setLoading(true);
      await updatePrifile(userDetails.id, profile);
      navigate("/dashboard");
      setLoading(false);
    } else {
      showValidationMessage(true);
    }
  };

  const handleProfileInputChange = (value, field) => {
    const currProfile = { ...profile };
    currProfile[field] = value;
    setProfile(currProfile);
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
          {userDetails && (
            <>
              <div className="row align-items-center">
                <div className="col-md-2">Email</div>
                <div className="col-md-10 py-4">{userDetails?.email}</div>
              </div>
              <div className="row align-items-center">
                <div className="col-md-2">Full Name</div>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-input"
                    value={profile?.name}
                    onChange={(e) =>
                      handleProfileInputChange(e.target.value, "name")
                    }
                    placeholder="Full Name"
                  />
                  {validator.message("name", profile?.name, "required", {
                    messages: {
                      required: "Full Name is required",
                    },
                  })}
                </div>
              </div>

              <div className="row mt-3 align-items-center">
                <div className="col-md-2">Address</div>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-input"
                    value={profile?.address}
                    onChange={(e) =>
                      handleProfileInputChange(e.target.value, "address")
                    }
                    placeholder="Address"
                  />
                  {validator.message("address", profile?.address, "required", {
                    messages: {
                      required: "Address required",
                    },
                  })}
                </div>
              </div>
              <div className="row mt-3  align-items-center">
                <div className="col-md-2">Phone</div>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-input w-50"
                    value={profile?.phone}
                    onChange={(e) =>
                      handleProfileInputChange(e.target.value, "phone")
                    }
                    placeholder="Phone Number"
                  />
                  {validator.message("phone", profile?.phone, "required", {
                    messages: {
                      required: "Phone No. is required",
                    },
                  })}
                </div>
              </div>

              <div className="row mt-3 align-items-center">
                <div className="col-md-2">Gender</div>
                <div className="col-md-9">
                  <select
                    className="form-input w-25"
                    value={profile?.gender}
                    onChange={(e) =>
                      handleProfileInputChange(e.target.value, "gender")
                    }
                  >
                    <option>Select..</option>
                    {userGenders.map((gender, index) => (
                      <option key={index} value={gender.value}>
                        {gender.name}
                      </option>
                    ))}
                  </select>
                  {validator.message("Gender", profile.gender, "required", {
                    messages: {
                      required: "Gender is required",
                    },
                  })}
                </div>
              </div>
              {userDetails.role !== "admin" && (
                <>
                  <div className="row mt-3  align-items-center">
                    <div className="col-md-2">
                      {userDetails.role === "doctor"
                        ? "Hospital"
                        : "Pharmacy / Lab"}
                    </div>
                    <div className="col-md-10">
                      <input
                        type="text"
                        className="form-input w-50"
                        value={profile?.location}
                        onChange={(e) =>
                          handleProfileInputChange(e.target.value, "location")
                        }
                        placeholder={
                          userDetails.role === "doctor"
                            ? "Hospital"
                            : "Pharmacy / Lab"
                        }
                      />
                      {validator.message(
                        "location",
                        profile?.location,
                        "required",
                        {
                          messages: {
                            required: "Location is required",
                          },
                        }
                      )}
                    </div>
                  </div>
                  <div className="row mt-3  align-items-center">
                    <div className="col-md-2">Registration No.</div>
                    <div className="col-md-10">
                      <input
                        type="text"
                        className="form-input w-50"
                        value={profile?.regNo}
                        onChange={(e) =>
                          handleProfileInputChange(e.target.value, "regNo")
                        }
                        placeholder="Reg No"
                      />
                      {validator.message("regNo", profile?.regNo, "required", {
                        messages: {
                          required: "Reg No. is required",
                        },
                      })}
                    </div>
                  </div>
                </>
              )}
              {userDetails.role === "doctor" && (
                <div className="row mt-3 align-items-center">
                  <div className="col-md-2">Specialization</div>
                  <div className="col-md-9">
                    <select
                      className="form-input w-50"
                      value={profile?.specialization}
                      onChange={(e) =>
                        handleProfileInputChange(
                          e.target.value,
                          "specialization"
                        )
                      }
                    >
                      <option>Select..</option>
                      {docSpecilizations.map((specialization, index) => (
                        <option key={index} value={specialization.value}>
                          {specialization.name}
                        </option>
                      ))}
                    </select>
                    {validator.message(
                      "Specialization",
                      profile.specialization,
                      "required",
                      {
                        messages: {
                          required: "Specialization is required",
                        },
                      }
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-footer">
            <button className="form_btn" onClick={save}>
              Update
            </button>
            <button
              className="form_btn ml-3"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default EditProfile;
