const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const createLink = async (req, res) => {
  try {
    const { destinationUrl, referralCode } = req.body;
    const userId = req.user.userId;

    if (!destinationUrl || !referralCode) {
      return res.status(400).json({ error: 'Destination URL and referral code required' });
    }

    // Check if referral code is unique
    const existingCode = await pool.query(
      'SELECT * FROM links WHERE referral_code = $1',
      [referralCode]
    );

    if (existingCode.rows.length > 0) {
      return res.status(409).json({ error: 'Referral code already exists' });
    }

    const linkId = uuidv4();
    const shortCode = uuidv4().substring(0, 8);

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${referralCode}`,
      { errorCorrectionLevel: 'M', width: parseInt(process.env.QR_CODE_SIZE || 300) }
    );

    const result = await pool.query(
      `INSERT INTO links (id, user_id, destination_url, short_code, referral_code, qr_image, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [linkId, userId, destinationUrl, shortCode, referralCode, qrDataUrl]
    );

    res.status(201).json({
      message: 'Link created successfully',
      link: result.rows[0]
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ error: 'Failed to create link' });
  }
};

const getLinks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT l.*, COUNT(c.id) as total_clicks, COUNT(DISTINCT c.ip_address) as unique_visitors
       FROM links l
       LEFT JOIN clicks c ON l.id = c.link_id
       WHERE l.user_id = $1
       GROUP BY l.id
       ORDER BY l.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
};

const getLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT l.*, COUNT(c.id) as total_clicks, COUNT(DISTINCT c.ip_address) as unique_visitors
       FROM links l
       LEFT JOIN clicks c ON l.id = c.link_id
       WHERE l.id = $1 AND l.user_id = $2
       GROUP BY l.id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get link error:', error);
    res.status(500).json({ error: 'Failed to fetch link' });
  }
};

const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { destinationUrl } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      'UPDATE links SET destination_url = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [destinationUrl, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link updated successfully', link: result.rows[0] });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({ error: 'Failed to update link' });
  }
};

const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Delete clicks first
    await pool.query('DELETE FROM clicks WHERE link_id = $1', [id]);

    // Delete link
    const result = await pool.query(
      'DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
};

module.exports = {
  createLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink
};
