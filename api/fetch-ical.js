export default async function handler(req, res) {
  // Настройки за CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Безопасно извличане на параметъра url
  const targetUrl = req.query.url;

  if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
    console.error('Invalid or missing URL parameter:', targetUrl);
    return res.status(400).json({ error: 'Missing or invalid URL parameter' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/calendar, text/plain, */*'
      }
    });

    if (!response.ok) {
      console.error(`Upstream iCal error. Status: ${response.status}`);
      return res.status(response.status).json({ error: `iCal source returned status ${response.status}` });
    }

    const data = await response.text();

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    return res.status(200).send(data);
  } catch (error) {
    console.error('Fetch Exception:', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}