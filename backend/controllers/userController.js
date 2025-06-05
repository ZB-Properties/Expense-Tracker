const pool = require('../model/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: newUser.rows[0], token });
  } catch (error) {
    console.error('❌ Error in registerUser:', error.stack || error.message); 
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '20d' });
    const { id, name } = user.rows[0];
    res.status(200).json({ user: { id, name, email }, token });
  } catch (error) {
    console.error('❌ Error in loginUser:', error.stack || error.message); 
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { registerUser, loginUser };
