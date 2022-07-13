import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAppointmentsList,
  fetchPatientById
} from "../../utils/appointmentUtils";
import "./Doctor.css";

const Appointments = (props) => {
  const { user, setLoading } = props;

  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetchAppointmentsList(user.uid);

      if (!response.error) {
        let promises = [];
        response.forEach((app) => {
          const patient = fetchPatientById(app);
          promises.push(patient);
        });
  
        const listAppointments = await Promise.all(promises);
        setAppointments(listAppointments);
        setFilteredAppointments(listAppointments);
      } else {
        console.log(response.message)
      }
      
      setLoading(false);
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
    <>
      <h2>Apploinments on {new Date().toLocaleDateString()}</h2>
      {appointments.length > 0 ? (
        <>
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
                    {item.title} {item.name}
                  </td>
                  <td>{item.gender}</td>
                  <td>{item.age}</td>
                  <td align="center">
                    {item.status === "completed" ? (
                      <div>Updated</div>
                    ) : (
                      <button
                        onClick={() => {
                          navigate(`/update-appointment/${item.id}`);
                        }}
                      >
                        Update Appointment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="error-message mt-3">
          No appointments for today
        </div>
      )}
    </>
  );
};

export default Appointments;
