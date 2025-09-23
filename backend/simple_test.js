const express = require('express');
const app = express();

// Import only auth routes
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);

// Simple test endpoint
app.get('/test', (req, res) => {
  res.send('Test server running');
});

const port = 3002;
app.listen(port, () => {
  console.log(`Simple test server running on port ${port}`);
});