import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Technician",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true); // Start loading
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Redirect after success
    } catch (error) {
      toast.error("Registration failed: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer /> {/* Toast notifications container */}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src="/img1 logo.jpg" alt="Logo" style={styles.logo} />
        </div>

        <h2 style={styles.header}>Create an Account</h2>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          style={styles.input}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          placeholder="Confirm Password"
          style={styles.input}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />

        {/* Role Selection */}
        <select
          style={styles.select}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="Technician">Technician</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Submit Button with Spinner */}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? <FaSpinner className="spinner" /> : "Register"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f7f7f7, #eaeaea)",
    padding: "20px",
  },
  form: {
    width: "400px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: "20px",
    textAlign: "center",
  },
  logo: {
    width: "200px",
    height: "auto",
    objectFit: "contain",
  },
  header: {
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
    transition: "border 0.3s",
  },
  select: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    background: "#fff",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#319ed6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default RegisterForm;
