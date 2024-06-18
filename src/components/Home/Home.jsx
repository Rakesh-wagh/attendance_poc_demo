import React, { useEffect, useState } from "react";
import { doSignOut } from "../../firebase/auth";
import { fetchEmployees } from "../../firebase/auth";
import "./Home.css";

const Home = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees(setEmployees);
  }, []);

  const handleLogout = async () => {
    try {
      await doSignOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="container">
      <h2>Home</h2>
      <p>Welcome to the home page!</p>
      <button onClick={handleLogout}>Logout</button>
      <h3>Employee List</h3>
      <div className="table-outer">
        <table className="table">
          <thead>
            <tr>
              <th>Employee Id</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Region</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.employeeId}</td>
                <td>{employee.name}</td>
                <td>{employee.title}</td>
                <td>{employee.region}</td>
                <td>{employee.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
