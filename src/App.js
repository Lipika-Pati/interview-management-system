import React, { useState } from "react";
import "./App.css";

// ✅ FIXED IMPORTS
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");

  const [interviews, setInterviews] = useState([]);
  const [show, setShow] = useState(false);

  const addInterview = async () => {

    if (name === "" || email === "" || position === "" || status === "") {
      alert("Please enter all details");
      return;
    }

    const interview = {
      candidateName: name,
      candidateEmail: email,
      interviewerName: "HR Manager",
      interviewerEmail: "abc123@gmail.com",
      position: position,
      date: "2026-03-20",
      status: status
    };

    try {
      const response = await fetch("http://localhost:8081/api/interviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(interview)
      });

      if (response.ok) {

        const newInterview = { name, email, position, status };
        setInterviews([...interviews, newInterview]);

        setName("");
        setEmail("");
        setPosition("");
        setStatus("");

        alert("Interview Added Successfully");

      } else {
        alert("Backend Error");
      }

    } catch (error) {
      alert("Server error");
    }
  };

  // ✅ CSV DOWNLOAD
  const downloadCSV = () => {

    if (interviews.length === 0) {
      alert("No data to download");
      return;
    }

    let csv = "Name,Email,Position,Status\n";

    interviews.forEach(i => {
      csv += `${i.name},${i.email},${i.position},${i.status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "interviews.csv";
    link.click();
  };

  // ✅ FIXED PDF DOWNLOAD
  const downloadPDF = () => {

    if (interviews.length === 0) {
      alert("No data to download");
      return;
    }

    const doc = new jsPDF();

    const tableColumn = ["Name", "Email", "Position", "Status"];
    const tableRows = [];

    interviews.forEach(i => {
      tableRows.push([i.name, i.email, i.position, i.status]);
    });

    // ✅ FIXED LINE
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows
    });

    doc.save("interviews.pdf");
  };

  return (
    <div className="App">
      <div className="App-header">

        <h1>Interview Management System</h1>

        {/* ADD FORM */}
        <div className="card">
          <h3>Add Interview</h3>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e)=>setPosition(e.target.value)}
          />

          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
          />

          <button onClick={addInterview}>Add</button>
        </div>

        {/* TABLE */}
        <div className="card">
          <h3>Interview List</h3>

          <button onClick={()=>setShow(true)}>View</button>
          <button onClick={downloadCSV}>Download CSV</button>
          <button onClick={downloadPDF}>Download PDF</button>

          {show && (
            <table border="1" style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.position}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;