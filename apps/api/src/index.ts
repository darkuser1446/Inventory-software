import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import FifozoneClient from './fifozoneClient';

dotenv.config({ path: '.env' });

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FIFO_BASE = process.env.FIFOZONE_URL || process.env.WORDPRESS_URL || '';

const app = express();
app.use(express.json());
app.use(cors());

if (!FIFO_BASE) {
  console.warn('FIF0ZONE_URL / WORDPRESS_URL not set; /api/fifozone will return 400');
}

// Proxy endpoint: GET /api/fifozone?path=/wp/v2/posts
app.get('/api/fifozone', async (req, res) => {
  if (!FIFO_BASE) return res.status(400).json({ error: 'FIF0ZONE_URL not configured' });
  const path = String(req.query.path || '/wp-json');
  const client = new FifozoneClient(FIFO_BASE);

  try {
    const data = await client.fetch(path, 2);
    // Minimal sanitization: only return JSON-serializable data
    return res.json({ ok: true, data });
  } catch (err: any) {
    const status = err?.response?.status || 502;
    const message = err?.message || 'Upstream fetch failed';
    return res.status(status).json({ ok: false, error: message });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${PORT}`);
});
