import axios from '../utils/axiosInstance'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-container">
      <form onSubmit={handleSubmit} className="user-form">
        <h2>Sign In</h2>
        <input type="email" name="email" placeholder="Email" className="input" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} required />
        <button type="submit" className="user-btn">signin</button>
      </form>
    </div>
  );
};

export default Login;