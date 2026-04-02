import React, { useState } from "react";
import "./App.css";
import toast from "react-hot-toast"; // ✅ ADD THIS

function Dashboard() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");

  const [interviews, setInterviews] = useState([]);
  const [show, setShow] = useState(false);

  // ADD INTERVIEW
  const addInterview = async () => {

    if (!name || !email || !position || !status) {
      toast("Please fill all fields ⚠️"); // ✅ CHANGED
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

        setInterviews([...interviews, { name, email, position, status }]);

        setName("");
        setEmail("");
        setPosition("");
        setStatus("");

        toast.success("Interview Added Successfully ✅"); 

      } else {
        toast.error("Backend error ❌"); // 
      }

    } catch (error) {
      toast.error("Server error ❌"); // 
    }
  };

  // CSV
  const downloadCSV = () => {

    if (interviews.length === 0) {
      toast("No data ⚠️"); // 
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

    toast.success("CSV Downloaded ✅"); // 
  };

  // PDF
  const downloadPDF = () => {

    if (interviews.length === 0) {
      toast("No data ⚠️"); // ✅ CHANGED
      return;
    }

    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then((autoTable) => {

        const doc = new jsPDF.default();

        const tableColumn = ["Name", "Email", "Position", "Status"];
        const tableRows = [];

        interviews.forEach(i => {
          tableRows.push([i.name, i.email, i.position, i.status]);
        });

        autoTable.default(doc, {
          head: [tableColumn],
          body: tableRows
        });

        doc.save("interviews.pdf");

        toast.success("PDF Downloaded ✅"); // ✅ EXTRA
      });
    });
  };

  return (
    <div className="App">
      <div className="App-header">

        <h1 className="title">Interview Management System</h1>

        {/* ADD INTERVIEW */}
        <div className="card">
          <h3>Add Interview</h3>

          <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} /><br/><br/>
          <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><br/><br/>
          <input placeholder="Position" value={position} onChange={(e)=>setPosition(e.target.value)} /><br/><br/>
          <input placeholder="Status" value={status} onChange={(e)=>setStatus(e.target.value)} /><br/><br/>

          <button className="btn" onClick={addInterview}>Add</button>
        </div>

        {/* LIST */}
        <div className="card">
          <h3>Interview List</h3>

          <button className="btn" onClick={()=>setShow(true)}>View</button>
          <button className="btn" onClick={downloadCSV}>CSV</button>
          <button className="btn" onClick={downloadPDF}>PDF</button>

          {show && (
            <ul>
              {interviews.map((item, index) => (
                <li key={index}>
                  {item.name} | {item.email} | {item.position} | {item.status}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;