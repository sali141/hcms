import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAppointmentsList } from "../../utils/appointmentUtils";
import "./Doctor.css"

const Appointments = (props) => {
  const { user } = props;
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  useEffect(() => {
    const fetchAppointments = async () => {
      const resposne = await fetchAppointmentsList(user.uid);
      console.log(resposne);
      setAppointments(resposne);
      setFilteredAppointments(resposne);
    };

    fetchAppointments();
  }, [user]);

  const onFilterChange = (e) => {
    if (e.target.value !== "") {
      const newList = appointments.filter((appo) =>
      appo.patientName.includes(e.target.value)
      );
      setFilteredAppointments(newList);
    } else {
      setFilteredAppointments(appointments);
    }
  };

  return (
    <div>
      <h2>Doctor Apploinments</h2>
      <div className="user-filter">
        <div>
          <input
            type="text"
            placeholder="Filter Appointments"
            onChange={onFilterChange}
          ></input>
        </div>
      </div>

      <table className="style-table">
        <thead>
          <tr>
            <th width={"10%"}>No.</th>
            <th>Patient Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th width={"30%"} align="center"></th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {item.patientTitle} {item.patientName}
              </td>
              <td>{item.gender}</td>
              <td>{item.age}</td>
              <td align="center">
                <button
                  onClick={() => {
                    navigate(`/update-appointment/${item.id}`);
                  }}
                >
                  Update Appointment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
