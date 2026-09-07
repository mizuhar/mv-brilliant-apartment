export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const response = await fetch(url);
    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/calendar');
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch calendar' });
  }
}