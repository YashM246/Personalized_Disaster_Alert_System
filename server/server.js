/**
 * Express Server Entry Point
 * Natural Disaster Alert System Backend
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const alertRoutes = require('./routes/alert');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', alertRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Natural Disaster Alert System API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      generateAlert: 'POST /api/generate-alert'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.path} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚨 Natural Disaster Alert System API`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - POST http://localhost:${PORT}/api/generate-alert`);
  console.log(`\n⚠️  Make sure ANTHROPIC_API_KEY is set in .env file\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server gracefully...');
  process.exit(0);
});
