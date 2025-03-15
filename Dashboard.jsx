import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage(response.data.message);
      } catch (error) {
        alert("Session expired, please login again.");
        navigate("/");
      }
    };

    fetchDashboard();
  }, [navigate]);

  return (
    <div className="auth-container">
      <h2>Dashboard</h2>
      <p>{message}</p>
      <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
