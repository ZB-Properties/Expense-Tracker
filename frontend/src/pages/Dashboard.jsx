import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {

 const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard</h1>
      <nav className="pages-nav">
        <Link to="/transaction">Transactions</Link>
        <Link to="/budget">Budgets</Link>
        <Link to="/analytics">Analytics</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
    </div>
  );
};

export default Dashboard;