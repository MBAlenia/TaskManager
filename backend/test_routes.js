const express = require('express');
const app = express();

// Mock the middleware and controller functions
const mockMiddleware = (req, res, next) => next();
const mockController = (req, res) => res.send('Route matched');

// Test route ordering
app.use(express.json());

// Define routes in the same order as authRoutes.js
app.post('/api/auth/register', mockController);
app.post('/api/auth/login', mockController);
app.get('/api/auth/users', mockMiddleware, mockMiddleware, mockController);
app.post('/api/auth/users', mockMiddleware, mockMiddleware, mockController);
app.put('/api/auth/users/:id', mockMiddleware, mockMiddleware, mockController);
app.delete('/api/auth/users/:id', mockMiddleware, mockMiddleware, mockController);
app.put('/api/auth/users/:userId/password', mockMiddleware, mockMiddleware, mockController);
app.get('/api/auth/me', mockMiddleware, mockController);
app.put('/api/auth/me/password', mockMiddleware, mockController);

// Test if routes are accessible
app.get('/test-routes', (req, res) => {
  res.send(`
    <h1>Testing Routes</h1>
    <p>Try these endpoints:</p>
    <ul>
      <li>POST /api/auth/register</li>
      <li>POST /api/auth/login</li>
      <li>GET /api/auth/users</li>
      <li>POST /api/auth/users</li>
      <li>PUT /api/auth/users/1</li>
      <li>DELETE /api/auth/users/1</li>
      <li>PUT /api/auth/users/1/password</li>
      <li>GET /api/auth/me</li>
      <li>PUT /api/auth/me/password</li>
    </ul>
  `);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});