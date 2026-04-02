import { useState } from "react";
import { TextField, Button, Paper, Typography, Box, Checkbox, FormControlLabel, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import toast from "react-hot-toast";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ VALIDATION
  const validate = () => {

    if(username.trim() === "" || password.trim() === "") {
      toast("All fields required ⚠️");
      return false;
    }

    if(password.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return false;
    }

    if(!/\d/.test(password)) {
      toast.error("Password must contain a number ❌");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {

    if(!validate()) return;

    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.text();

      if(data === "ADMIN" || data === "HR") {

        localStorage.setItem("role", data);

        toast.success(`Welcome ${data} ✅`);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);

      } else {
        toast.error("Wrong username or password ❌");
      }

    } catch (error) {
      toast.error("Server error ❌");
    }
  };

  return (
    <Box sx={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#667eea,#764ba2,#ff758c)"
    }}>

      <Paper elevation={8} sx={{
        padding: 4,
        width: 380,
        textAlign: "center",
        borderRadius: "15px"
      }}>

        <Typography variant="h5" gutterBottom>
          Interview Management System
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Login to continue
        </Typography>

        {/* USERNAME */}
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          onChange={(e)=>setUsername(e.target.value)}
        />

        {/* PASSWORD WITH SHOW/HIDE 👁️ */}
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Password"
          margin="normal"
          onChange={(e)=>setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={()=>setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* REMEMBER ME */}
        <FormControlLabel
          control={<Checkbox />}
          label="Remember Me"
        />

        {/* LOGIN BUTTON */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* EXTRA */}
        <Typography sx={{ mt: 2, cursor: "pointer", fontSize: "14px" }}>
          Forgot Password?
        </Typography>

      </Paper>

    </Box>
  );
}

export default Login;