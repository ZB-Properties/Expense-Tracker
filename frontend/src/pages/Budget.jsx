import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import './trans-budget.css'


const Budget = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: '', amount: '', period: 'Monthly' });
  const [editingBudget, setEditingBudget] = useState(null);
  const [editData, setEditData] = useState({ category: '', amount: '', period: '' });


  const token = localStorage.getItem('token');

 
  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await authAxios.get('/budgets');
        setBudgets(res.data);
      } catch (err) {
        console.error('Failed to fetch budgets:', err);
        if (err.response && err.response.status === 401) {
          // Token expired or unauthorized, redirect to login
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchBudgets();
  }, [navigate]); 

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const res = await authAxios.post('/budgets', newBudget);
      setBudgets([...budgets, res.data]);
      setNewBudget({ category: '', amount: '', period: 'Monthly' });
    } catch (err) {
      console.error('Failed to add budget:', err);
    }
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    setEditData({ category: budget.category, amount: budget.amount, period: budget.period });
  };

  const closeEdit = () => setEditingBudget(null);

  const handleUpdate = async () => {
    try {
      const res = await authAxios.put(`/budgets/${editingBudget.id}`, editData);
      setBudgets(budgets.map(b => b.id === editingBudget.id ? res.data : b));
      closeEdit();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await authAxios.delete(`/budgets/${id}`);
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="page-container">
      <button className="btn btn-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      <h2>Budgets</h2>

      <form onSubmit={handleAddBudget} className="budget-form">
        <input
          type="text"
          placeholder="Category"
          value={newBudget.category}
          onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newBudget.amount}
          onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
          required
          min="0"
        />
        <select
          value={newBudget.period}
          onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
          className='budget-select'
        >
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
        </select>
        <button className="btn" type="submit">Add Budget</button>
      </form>

      <div className="card-grid-b">
        {budgets.map(budget => (
          <div className="card" key={budget.id}>
            <h3>{budget.category}</h3>
            <p>Amount: ${budget.amount}</p>
            <p>Period: {budget.period}</p>
            <div className="card-actions">
              <button className="btn" onClick={() => openEdit(budget)}>Edit</button>
              <button className="btn btn-delete" onClick={() => handleDelete(budget.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingBudget && (
        <div className="modal-overlay">
          <div className="modal-b">
            <h3>Edit Budget</h3>
            <input
              type="text"
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              className="modal-edit"
            />
            <input
              type="number"
              value={editData.amount}
              onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
              min="0"
              className="modal-edit"
            />
            <select
              value={editData.period}
              onChange={(e) => setEditData({ ...editData, period: e.target.value })}
              className="modal-edit1"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>

            <div className="modal-actions">
              <button className="btn" onClick={handleUpdate}>Save</button>
              <button className="btn" onClick={closeEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
