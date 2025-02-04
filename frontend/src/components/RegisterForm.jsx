import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { register } from "../services/authService";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Technician", // Default role
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }); // Call the register function
      alert("Registration successful! Redirecting to login...");
      navigate("/"); // Redirect to login page
    } catch (error) {
      alert("Registration failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img
            src="/img1 logo.jpg" // Replace with the actual path to your logo
            alt="Logo"
            style={styles.logo}
          />
        </div>

        {/* Form Header */}
        <h2 style={styles.header}>Register</h2>

        {/* Username Field */}
        <input
          type="text"
          placeholder="Username"
          style={styles.input}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        {/* Email Field */}
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        {/* Confirm Password Field */}
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

        {/* Submit Button */}
        <button type="submit" style={styles.button}>
          Register
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
    background: "linear-gradient(135deg, #f7f7f7, #eaeaea)", // Light gray gradient
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
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
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
