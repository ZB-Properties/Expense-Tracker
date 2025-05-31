import axios from '../utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Transaction = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, transaction: null, mode: 'edit' });
  const [form, setForm] = useState({ category: '', amount: '', type: 'income', note: '' });

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const openModal = (tx = null, mode = 'edit') => {
    setForm(tx ? {
      type: tx.type.toLowerCase(),
      category: tx.category,
      amount: tx.amount,
      note: tx.note || ''
    } : { category: '', amount: '', type: 'income', note: '' });

    setModal({ isOpen: true, transaction: tx, mode });
  };

  const closeModal = () => {
    setModal({ isOpen: false, transaction: null, mode: 'edit' });
    setForm({ category: '', amount: '', type: 'income', note: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const data = {
      type: form.type.toLowerCase(),
      category: form.category,
      amount: parseFloat(form.amount),
      note: form.note || ''
    };

    try {
      if (modal.transaction) {
        await axios.put(`/transactions/${modal.transaction.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/transactions', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTransactions();
      closeModal();
    } catch (err) {
      console.error('Submit failed:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'An error occurred');
      }
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/transactions/${modal.transaction.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTransactions();
      closeModal();
    } catch (err) {
      console.error('Delete failed:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div className="page-container">
      <button className="btn btn-back" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
      <h2>Transactions</h2>
      <button className="add-btn" onClick={() => openModal(null, 'create')}>+ Add Transaction</button>

      <div className="card-grid">
        {transactions.map(tx => (
          <div className="card" key={tx.id}>
            <h3>{tx.category} ({tx.type})</h3>
            <p>Amount: ${tx.amount}</p>
            {tx.note && <p>Note: {tx.note}</p>}
            <div className="card-actions">
              <button className="btn" onClick={() => openModal(tx, 'edit')}>Edit</button>
              <button className="btn btn-delete" onClick={() => openModal(tx, 'delete')}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-trans">
            <h3>
              {modal.mode === 'delete'
                ? 'Confirm Delete'
                : modal.transaction ? 'Edit Transaction' : 'New Transaction'}
            </h3>

            {modal.mode !== 'delete' ? (
              <>
                <input
                  name="category"
                  className="modal-input"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                />
                <input
                  name="amount"
                  type="number"
                  className="modal-input"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={handleChange}
                />
                <input
                  name="note"
                  className="modal-input"
                  placeholder="Note"
                  value={form.note}
                  onChange={handleChange}
                />
                <select
                  name="type"
                  className="modal-select"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </>
            ) : (
              <p>Are you sure you want to delete <strong>{modal.transaction?.category}</strong>?</p>
            )}

            <div className="modal-actions">
              {modal.mode === 'delete' ? (
                <button className="btn btn-delete" onClick={handleDelete}>Confirm Delete</button>
              ) : (
                <button className="btn" onClick={handleSubmit}>Save</button>
              )}
              <button className="btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
