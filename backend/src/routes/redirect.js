const express = require('express');
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const UAParser = require('ua-parser-js');

const router = express.Router();

router.get('/:referralCode', async (req, res) => {
  try {
    const { referralCode } = req.params;

    // Find link
    const linkResult = await pool.query(
      'SELECT * FROM links WHERE referral_code = $1',
      [referralCode]
    );

    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const link = linkResult.rows[0];
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Parse user agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const device = result.device.type || 'desktop';
    const browser = result.browser.name || 'unknown';

    // Record click
    await pool.query(
      `INSERT INTO clicks (id, link_id, ip_address, user_agent, device, browser, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [uuidv4(), link.id, ipAddress, userAgent, device, browser]
    );

    // Redirect
    res.redirect(link.destination_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Redirect failed' });
  }
});

module.exports = router;
