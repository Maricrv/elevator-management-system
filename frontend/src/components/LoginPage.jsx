import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Correct import
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

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

import "../App.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

  const handleLogin = async () => {
    if (!username || !password) {
      toast.warn("Please enter both username and password.");
      return;
    }

    setLoading(true); // Start loading state

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username,
        password,
      });

      toast.success("Login successful! Redirecting...");
      onLogin();
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Redirect after delay for smooth transition
      
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <MDBContainer className="login-page-container">
      <ToastContainer /> {/* Toast Notification Container */}

      <MDBCard className="login-card">
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
                  className="login-logo"
                />
              </div>

              {/* Form Title */}
              <h5 className="fw-normal mb-4 login-title">
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
                disabled={loading}
              />
              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Password"
                id="formPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              {/* Login Button with Spinner */}
              <MDBBtn
                className="fixed-button"
                color="dark"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <FaSpinner className="spinner" /> : "Login"}
              </MDBBtn>

              {/* Forgot Password */}
              <a className="small text-muted mb-3" href="#!">
                Forgot password?
              </a>

              {/* Registration Link */}
              <p className="mb-4">
                Don't have an account?{" "}
                <Link to="/register" className="register-link">
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
