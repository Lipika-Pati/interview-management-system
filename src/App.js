import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>

      {/* 🔥 TOASTER ADD HERE */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>

        {/* LOGIN FIRST */}
        <Route path="/" element={<Login />} />

        {/* AFTER LOGIN */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;