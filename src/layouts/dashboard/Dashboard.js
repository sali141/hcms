import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import { fetchUserDetails } from "../../utils/userUtils";
import { Users } from "../admin/Users";
import Appointments from "../doctor/Appointments";
import "./Dashboard.css";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    const fetchUser = async (user) => {
      const resposne = await fetchUserDetails(user);
      console.log(resposne);
      setUserDetails(resposne);
    };

    fetchUser(user);
  }, [user, loading]);

  const renderDashboadUserContent = () => {
    switch (userDetails.role) {
      case "admin":
        return <Users user={user} />;
      case "doctor":
        return <Appointments user={user} />;
      case "pharmacist":
          return <div>pharmacist page</div>;
      default:
        return <div>Not authorized to access dashboard</div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          Welcome {userDetails?.name} ({userDetails?.role})
        </div>
        <div>
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="dashboard__content">
        {user && userDetails?.role && renderDashboadUserContent()}
      </div>
    </div>
  );
}

export default Dashboard;
