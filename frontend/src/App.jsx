import { useEffect, useState } from "react";

function App() {
  // -----------------------------
  // Employee State
  // -----------------------------
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  // -----------------------------
  // Attendance State
  // -----------------------------
  const [attendanceData, setAttendanceData] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  const [attendanceList, setAttendanceList] = useState([]);

  // -----------------------------
  // Fetch Employees
  // -----------------------------
  const fetchEmployees = () => {
  fetch("https://hrms-lite-backend-waw4.onrender.com/employees")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch employees");
      }
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    })
    .catch((err) => {
      console.error(err);
      setEmployees([]); // Prevent crash
    });
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  // -----------------------------
  // Employee Handlers
  // -----------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://hrms-lite-backend-waw4.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error adding employee");
        return res.json();
      })
      .then(() => {
        setFormData({
          employee_id: "",
          full_name: "",
          email: "",
          department: "",
        });
        fetchEmployees();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    fetch(`https://hrms-lite-backend-waw4.onrender.com`, {
      method: "DELETE",
    })
      .then(() => fetchEmployees())
      .catch((err) => console.error(err));
  };

  // -----------------------------
  // Attendance Handlers
  // -----------------------------
  const handleAttendanceChange = (e) => {
    setAttendanceData({
      ...attendanceData,
      [e.target.name]: e.target.value,
    });
  };

  const submitAttendance = (e) => {
    e.preventDefault();

    fetch("https://hrms-lite-backend-waw4.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...attendanceData,
        employee_id: Number(attendanceData.employee_id),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error marking attendance");
        return res.json();
      })
      .then(() => {
        alert("Attendance marked");
      })
      .catch((err) => alert(err.message));
  };

  const fetchAttendance = (employeeId) => {
    if (!employeeId) return;

    fetch(`http://127.0.0.1:8000/attendance/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setAttendanceList(data))
      .catch((err) => console.error(err));
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="container">
      <h1>HRMS Lite</h1>

      {/* ---------------- Employee Section ---------------- */}
      <h2>Add Employee</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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

      {Array.isArray(employees) && employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul>
          {Array.isArray(employees) &&
             employees.map((emp) => (
            <li key={emp.id}>
              {emp.full_name} - {emp.department}{" "}
              <button onClick={() => handleDelete(emp.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------- Attendance Section ---------------- */}
      <hr style={{ margin: "40px 0" }} />

      <h2>Mark Attendance</h2>

      <form onSubmit={submitAttendance} style={{ marginBottom: "20px" }}>
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