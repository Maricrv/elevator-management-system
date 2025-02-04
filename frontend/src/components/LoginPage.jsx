import React, { useState } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import "../App.css"; // Ensure correct relative path to App.css
import { Link } from "react-router-dom";


function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login/", {
        username,
        password,
      });

      // Assuming the login is successful
      alert("Login successful!");
      onLogin(); // Call the login handler to update the state in App
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <MDBContainer className="login-page-container">
      <MDBCard
        style={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          background: "#fff", // Ensure the card stays white
        }}
      >
        <MDBRow className="g-0">
          {/* Left Section with Image */}
          <MDBCol md="5" className="d-none d-md-block">
            <MDBCardImage
              src="/cologne.jpg"
              alt="login form"
              className="rounded-start w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </MDBCol>

          {/* Right Section with Form */}
          <MDBCol md="7" xs="12">
            <MDBCardBody className="d-flex flex-column justify-content-center align-items-center">
              {/* Logo */}
              <div className="text-center mb-4">
                <img
                  src="/img1 logo.jpg"
                  alt="Logo"
                  style={{
                    width: "250px",
                    height: "80px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Form Title */}
              <h5 className="fw-normal mb-4" style={{ letterSpacing: "1px", color: "#333" }}>
                Sign into your account
              </h5>

              {/* Form Inputs */}
              <MDBInput
                wrapperClass="mb-3 w-100"
                label="Username"
                id="formUsername"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Password"
                id="formPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Login Button */}
              <MDBBtn
                className="mb-3 w-100"
                color="dark"
                onClick={handleLogin}
                style={{ padding: "10px 0", fontSize: "16px" }}
              >
                Login
              </MDBBtn>

              {/* Forgot Password */}
              <a className="small text-muted mb-3" href="#!">
                Forgot password?
              </a>

              {/* Registration Link */}
              <p className="mb-4" style={{ color: "#393f81" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#319ed6", fontWeight: "500" }}>
                  Register here
                </Link>
              </p>

              {/* Terms and Policy */}
              <div className="d-flex flex-row justify-content-center w-100">
                <a href="#!" className="small text-muted me-3">
                  Terms of Use
                </a>
                <a href="#!" className="small text-muted">
                  Privacy Policy
                </a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default LoginPage;
