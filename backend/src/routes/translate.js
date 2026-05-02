const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      q,
      source = 'auto',
      target = 'en',
      format = 'text',
      alternatives = 3,
      api_key,
    } = req.body || {};

    if (typeof q !== 'string') {
      return res.status(400).json({ error: '`q` must be a string' });
    }

    if (typeof fetch !== 'function') {
      return res.status(500).json({
        error:
          'Global fetch is not available in this Node runtime. Upgrade Node to v18+.',
      });
    }

    const payload = {
      q,
      source,
      target,
      format,
      alternatives,
      api_key:
        typeof api_key === 'string'
          ? api_key
          : process.env.LIBRETRANSLATE_API_KEY || '',
    };

    const upstreamRes = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!upstreamRes.ok) {
      const text = await upstreamRes.text();
      return res.status(upstreamRes.status).send(text);
    }

    const data = await upstreamRes.json();
    return res.json(data);
  } catch (err) {
    console.error('Translate failed:', err);
    return res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;

