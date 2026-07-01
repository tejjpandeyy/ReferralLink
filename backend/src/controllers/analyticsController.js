const pool = require('../config/database');

const getLinkAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify link ownership
    const linkCheck = await pool.query(
      'SELECT * FROM links WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (linkCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Get total clicks and unique visitors
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_clicks,
        COUNT(DISTINCT ip_address) as unique_visitors,
        MAX(created_at) as last_visited
       FROM clicks WHERE link_id = $1`,
      [id]
    );

    // Get clicks by day (last 30 days)
    const dailyClicksResult = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as clicks
       FROM clicks
       WHERE link_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [id]
    );

    // Get device information
    const deviceResult = await pool.query(
      `SELECT 
        device,
        COUNT(*) as count
       FROM clicks
       WHERE link_id = $1 AND device IS NOT NULL
       GROUP BY device`,
      [id]
    );

    // Get browser information
    const browserResult = await pool.query(
      `SELECT 
        browser,
        COUNT(*) as count
       FROM clicks
       WHERE link_id = $1 AND browser IS NOT NULL
       GROUP BY browser
       LIMIT 10`,
      [id]
    );

    // Get recent visits
    const recentVisitsResult = await pool.query(
      `SELECT id, ip_address, device, browser, created_at
       FROM clicks
       WHERE link_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [id]
    );

    res.json({
      stats: statsResult.rows[0],
      dailyClicks: dailyClicksResult.rows,
      devices: deviceResult.rows,
      browsers: browserResult.rows,
      recentVisits: recentVisitsResult.rows
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

const getOverallAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total clicks across all links
    const totalClicksResult = await pool.query(
      `SELECT COUNT(*) as total_clicks, COUNT(DISTINCT ip_address) as unique_visitors
       FROM clicks c
       JOIN links l ON c.link_id = l.id
       WHERE l.user_id = $1`,
      [userId]
    );

    // Get top performing links
    const topLinksResult = await pool.query(
      `SELECT 
        l.id,
        l.referral_code,
        COUNT(c.id) as clicks,
        COUNT(DISTINCT c.ip_address) as unique_visitors
       FROM links l
       LEFT JOIN clicks c ON l.id = c.link_id
       WHERE l.user_id = $1
       GROUP BY l.id, l.referral_code
       ORDER BY clicks DESC
       LIMIT 10`,
      [userId]
    );

    // Get total links
    const totalLinksResult = await pool.query(
      'SELECT COUNT(*) as total FROM links WHERE user_id = $1',
      [userId]
    );

    res.json({
      overall: totalClicksResult.rows[0],
      topLinks: topLinksResult.rows,
      totalLinks: totalLinksResult.rows[0].total
    });
  } catch (error) {
    console.error('Get overall analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch overall analytics' });
  }
};

module.exports = { getLinkAnalytics, getOverallAnalytics };
