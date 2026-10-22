import express from 'express';
import { buildContactEmailHtml, sendAdminContactNotification } from '../src/lib/email';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kalyansetu' });
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\n');
});

app.post('/api/contact/notify', async (req, res) => {
  try {
    const { id, fullName, email, phone, reason, message, isSignedIn, profileEmail, createdAt } =
      req.body || {};

    if (!fullName || !email || !reason || !message) {
      return res.status(400).json({ error: 'Missing required notification fields.' });
    }

    const result = await sendAdminContactNotification({
      id: id || 'msg',
      fullName: String(fullName),
      email: String(email),
      phone: phone ? String(phone) : null,
      reason: String(reason),
      message: String(message),
      isSignedIn: Boolean(isSignedIn),
      profileEmail: profileEmail ? String(profileEmail) : null,
      createdAt: createdAt || new Date().toISOString(),
    });

    return res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send admin notification email';
    console.error('Failed to send contact notification:', error);
    return res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/contact/email-preview', (req, res) => {
  try {
    const { id, fullName, email, phone, reason, message, isSignedIn, profileEmail, createdAt } =
      req.body || {};

    const siteUrl = process.env.SITE_URL || process.env.APP_URL || 'https://kalyansetu.in';
    const html = buildContactEmailHtml(
      {
        id: id || 'msg',
        fullName: String(fullName || ''),
        email: String(email || ''),
        phone: phone ? String(phone) : null,
        reason: String(reason || 'General Inquiry'),
        message: String(message || ''),
        isSignedIn: Boolean(isSignedIn),
        profileEmail: profileEmail ? String(profileEmail) : null,
        createdAt: createdAt || new Date().toISOString(),
      },
      siteUrl
    );

    return res.json({ html });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to build email preview';
    return res.status(500).json({ error: message });
  }
});

export default app;
