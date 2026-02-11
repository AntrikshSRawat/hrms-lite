import { useEffect, useState } from "react";

const API_BASE = "https://hrms-lite-backend-waw4.onrender.com";

function App() {
  // ===============================
  // Employee State
  // ===============================
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  // ===============================
  // Attendance State
  // ===============================
  const [attendanceData, setAttendanceData] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  const [attendanceList, setAttendanceList] = useState([]);

  // ===============================
  // Fetch Employees
  // ===============================
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ===============================
  // Employee Handlers
  // ===============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error adding employee");

      setFormData({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });

      fetchEmployees();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/employees/${id}`, {
        method: "DELETE",
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // Attendance Handlers
  // ===============================
  const handleAttendanceChange = (e) => {
    setAttendanceData({
      ...attendanceData,
      [e.target.name]: e.target.value,
    });
  };

  const submitAttendance = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...attendanceData,
          employee_id: Number(attendanceData.employee_id),
        }),
      });

      if (!res.ok) throw new Error("Error marking attendance");

      alert("Attendance marked successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchAttendance = async (employeeId) => {
    if (!employeeId) return;

    try {
      const res = await fetch(`${API_BASE}/attendance/${employeeId}`);
      const data = await res.json();
      setAttendanceList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="container">
      <h1>HRMS Lite</h1>

      {/* Employee Section */}
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="employee_id"
          placeholder="Employee ID"
          value={formData.employee_id}
          onChange={handleChange}
          required
        />
        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>

      <h2>Employee List</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul>
          {employees.map((emp) => (
            <li key={emp.id}>
              {emp.full_name} - {emp.department}{" "}
              <button onClick={() => handleDelete(emp.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "40px 0" }} />

      {/* Attendance Section */}
      <h2>Mark Attendance</h2>
      <form onSubmit={submitAttendance}>
        <select
          name="employee_id"
          value={attendanceData.employee_id}
          onChange={handleAttendanceChange}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={attendanceData.date}
          onChange={handleAttendanceChange}
          required
        />

        <select
          name="status"
          value={attendanceData.status}
          onChange={handleAttendanceChange}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button type="submit">Mark</button>
      </form>

      <h3>View Attendance</h3>
      <select onChange={(e) => fetchAttendance(e.target.value)}>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.full_name}
          </option>
        ))}
      </select>

      <ul>
        {attendanceList.map((record) => (
          <li key={record.id}>
            {record.date} - {record.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;