const express = require('express');
const cors = require('cors');
require('dotenv').config();


const userRoute = require('./routes/userRoute');
const transactionRoute = require('./routes/transactionRoute');
const budgetRoute = require('./routes/budgetRoute');
const analyticsRoute = require('./routes/analyticsRoute');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://expense-tracker-fbro.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use('/auth', userRoute);
app.use('/transactions', transactionRoute);
app.use('/budgets', budgetRoute);
app.use('/analytics', analyticsRoute);


const PORT = process.env.PORT || 2800;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
