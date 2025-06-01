const express = require('express');
const cors = require('cors');
require('dotenv').config();


const userRoute = require('./routes/userRoute');
const transactionRoute = require('./routes/transactionRoute');
const budgetRoute = require('./routes/budgetRoute');
const analyticsRoute = require('./routes/analyticsRoute');

const app = express();

const allowedOrigins = [
  'https://expense-tracker-fbro.vercel.app',
  'http://localhost:5173' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());

app.use('/api/auth', userRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/budgets', budgetRoute);
app.use('/api/analytics', analyticsRoute);


const PORT = process.env.PORT || 2800;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
