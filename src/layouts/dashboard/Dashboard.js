import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import { fetchUserDetails } from "../../utils/userUtils";
import { Users } from "../admin/Users";
import Appointments from "../doctor/Appointments";
import { Pharmacist } from "../pharmacist/Pharmacist";
import "./Dashboard.css";

function Dashboard() {
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoading) return;
    if (!user) return navigate("/");

    const fetchUser = async (user) => {
      const resposne = await fetchUserDetails(user);
      setUserDetails(resposne);
    };

    fetchUser(user);
  }, [user, userLoading]);

  const renderDashboadUserContent = () => {
    switch (userDetails.role) {
      case "admin":
        return <Users user={user} setLoading={setLoading} />;
      case "doctor":
        return <Appointments user={user} setLoading={setLoading} />;
      case "pharmacist":
        return <Pharmacist setLoading={setLoading} />;
      default:
        return <div>Not authorized to access dashboard</div>;
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading...">
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            Welcome {userDetails?.name} ({userDetails?.role})
          </div>
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
        <div className="dashboard__content">
          {user && userDetails?.role && renderDashboadUserContent()}
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default Dashboard;
