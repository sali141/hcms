import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./layouts/auth/login/Login";
import Dashboard from "./layouts/dashboard/Dashboard";
import AddUser from "./layouts/admin/AddUser";
import AddAppointment from "./layouts/admin/AddAppointment";
import UpdateAppointment from "./layouts/doctor/UpdateAppointment";
import { Header } from "./components/header/Header";
import EditProfile from "./layouts/common/EditProfile";
import MedicalHistory from "./layouts/doctor/MedicalHistory";

function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/add-user" element={<AddUser />} />
          <Route exact path="/add-appointment/:uid" element={<AddAppointment />} />
          <Route exact path="/update-appointment/:id" element={<UpdateAppointment />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/edit-profile" element={<EditProfile />} />
          <Route exact path="/medical-history/:patientId/:appointmentId" element={<MedicalHistory />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
