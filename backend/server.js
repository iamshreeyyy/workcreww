// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const milestoneRoutes = require('./routes/milestones');
app.use('/api/milestones', milestoneRoutes);

const disputeRoutes = require('./routes/disputes');
app.use('/api/disputes', disputeRoutes);

const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

const submissionRoutes = require('./routes/submissions');
app.use('/api/submissions', submissionRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Freelancer Payments Platform API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
