require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loginapp';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB database.'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date }
});

const User = mongoose.model('User', userSchema);

// Cart schema and model
const cartItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  username: { type: String, required: true },
  items: [cartItemSchema],
  created_at: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);

// Payment schema and model
const paymentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  nameOnCard: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  amount: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Order schema and model
const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  status: { type: String, default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password.' });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Save cart endpoint
app.post('/api/cart', async (req, res) => {
  const { username, items } = req.body;
  if (!username || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid cart data.' });
  }
  try {
    const cart = new Cart({ username, items });
    await cart.save();
    return res.status(201).json({ message: 'Cart saved successfully.', cartId: cart._id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Save payment endpoint
app.post('/api/payment', async (req, res) => {
  const { username, nameOnCard, cardNumber, expiryDate, cvv, amount } = req.body;
  if (!username || !nameOnCard || !cardNumber || !expiryDate || !cvv || !amount) {
    return res.status(400).json({ message: 'Invalid payment data.' });
  }
  try {
    const payment = new Payment({ username, nameOnCard, cardNumber, expiryDate, cvv, amount });
    await payment.save();
    return res.status(201).json({ message: 'Payment saved successfully.', paymentId: payment._id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Save order endpoint
app.post('/api/order', async (req, res) => {
  const { username, cartId, paymentId } = req.body;
  if (!username || !cartId || !paymentId) {
    return res.status(400).json({ message: 'Invalid order data.' });
  }
  try {
    const order = new Order({ username, cart: cartId, payment: paymentId });
    await order.save();
    return res.status(201).json({ message: 'Order placed successfully.', orderId: order._id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      user.last_login = new Date();
      await user.save();
      return res.status(200).json({ message: 'Login successful.', email: user.email });
    } else {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// User profile endpoint (advanced query) - returns user info excluding password
app.get('/api/user/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }, 'username email created_at last_login');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Explicit route to serve login.html
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Fallback route to serve index.html for SPA routing or unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
