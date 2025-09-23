const express = require('express');
const app = express();

// Mock middleware
const mockProtect = (req, res, next) => {
  console.log('Protect middleware called');
  next();
};

const mockAdmin = (req, res, next) => {
  console.log('Admin middleware called');
  next();
};

// Mock controller
const mockController = (req, res) => {
  console.log('Controller called for:', req.method, req.path);
  res.json({ message: 'Route matched successfully' });
};

app.use(express.json());

// Import the actual routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.send(`
    <h1>Test Endpoints</h1>
    <p>Try these endpoints:</p>
    <ul>
      <li>POST /api/auth/register</li>
      <li>POST /api/auth/login</li>
      <li>GET /api/auth/users</li>
      <li>POST /api/auth/users</li>
      <li>PUT /api/auth/users/1/password</li>
      <li>PUT /api/auth/users/1</li>
      <li>DELETE /api/auth/users/1</li>
      <li>GET /api/auth/me</li>
      <li>PUT /api/auth/me/password</li>
    </ul>
  `);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});