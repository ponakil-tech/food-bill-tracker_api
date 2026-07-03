require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const billsRouter = require('./routes/bills');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'food-bill-tracker' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/bills', billsRouter);
app.use('/api/users', usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`food-bill-tracker API listening on port ${PORT}`);
});


const selfUrl = process.env.RENDER_EXTERNAL_URL;
if (selfUrl) {
  const PING_INTERVAL_MS = 10 * 60 * 1000;
  setInterval(() => {
    fetch(`${selfUrl}/health`).catch((err) => console.error('Keep-alive ping failed:', err.message));
  }, PING_INTERVAL_MS);
}
