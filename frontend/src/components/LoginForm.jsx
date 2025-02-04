import React, { useState, useContext } from "react";
import { login } from "../services/authService";
import AuthContext from "../context/AuthContext";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login: loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials);
      loginUser(data.user);
      localStorage.setItem("token", data.access);
      alert("Login successful!");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
