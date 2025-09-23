const express = require('express');
const app = express();

app.use(express.json());

// Simple test route
app.put('/api/auth/me/password', (req, res) => {
  console.log('Route matched!');
  res.json({ message: 'Route matched successfully' });
});

const port = 3003;
app.listen(port, () => {
  console.log(`Minimal test server running on port ${port}`);
});