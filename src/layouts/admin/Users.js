import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserList } from "../../utils/userUtils";
import "./Users.css";

export const Users = (props) => {
  const {user} = props
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const fetchUsers = async () => {
      const resposne = await fetchUserList();
      setUsers(resposne);
      setFilteredUsers(resposne);
    };

    fetchUsers();
  }, [user]);


  const onFilterChange = (e) => {
    if (e.target.value !== "") {
      const newList = users.filter((user) =>
        user.name.includes(e.target.value)
      );
      setFilteredUsers(newList);
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <div className="user-filter">
        <div>
          <input type="text" placeholder="Filter Users" onChange={onFilterChange}></input>
        </div>
        <div>
          <button onClick={() => {navigate("/add-user")}}>Add New User</button>
        </div>
      </div>

      <table className="style-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Role</th>
            <th width={"20%"}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role.toUpperCase()}</td>
              <td>{user.role === "doctor" &&
               <button onClick={() => {navigate(`/add-appointment/${user.uid}`)}}>Add Appointment</button>
              }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
