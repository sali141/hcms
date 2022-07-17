import React, { useEffect, useState } from "react";
// import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { fetchLabAppointmentsList, fetchPatientById } from "../../utils/appointmentUtils";

export const LabAppointments = (props) => {
  const { setLoading } = props;
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetchLabAppointmentsList();

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
        console.log(response.message);
      }

      setLoading(false);
    };

    fetchAppointments();
  }, []);


  const onFilterChange = (e) => {
    if (e.target.value !== "") {
      const newList = appointments.filter((appo) =>
        appo.id.includes(e.target.value)
      );
      setFilteredAppointments(newList);
    } else {
      setFilteredAppointments(appointments);
    }
  };

  return (
    <>
      <h2>Lab Apploinments</h2>
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
                <th width={"20%"}>Ref No.</th>
                <th>Patient Name</th>
                <th width={"30%"} align="center"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>
                    {item.title} {item.name}
                  </td>
                  <td align="center">
                    
                      <button
                        onClick={() => {
                          navigate(`/update-lab-report/${item.appointmentId}`);
                        }}
                      >
                        Update Lab Reports
                      </button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="error-message mt-3">No appointments for today</div>
      )}
    </>
  );
};
