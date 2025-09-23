const express = require('express');
const app = express();

app.use(express.json());

// Import the auth routes
const authRoutes = require('./routes/authRoutes');

// Log the routes to see what's being imported
console.log('Auth routes:', authRoutes);

// Use the auth routes
app.use('/api/auth', authRoutes);

const port = 3004;
app.listen(port, () => {
  console.log(`Auth routes test server running on port ${port}`);
});