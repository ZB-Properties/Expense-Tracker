import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {

 const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='dash-body'>

      <section className="dashboard-container">

      <h1>Welcome to your Dashboard</h1>
      <div className="cgrid">
        <Link to="/transaction" className='grid-card'>💸 Transactions
        <span>View and track your income and expenses</span>
        </Link>
        <Link to="/budget" className='grid-card'>📊 Budgets
        <span>Set monthly spending limits</span>
        </Link>
        <Link to="/analytics" className='grid-card'>📈 Analytics
        <span>Visualize your financial data</span>
        </Link>
        <button onClick={handleLogout} className="logout-button">🔐 Logout</button>
      </div>

      </section>
    </div>
  );
};

export default Dashboard;