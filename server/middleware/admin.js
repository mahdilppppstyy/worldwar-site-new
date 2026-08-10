const User = require('../models/User');

async function checkAdmin(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(req.userId);
    if (!user || !user.tags || !user.tags.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden: admin access only' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error checking admin access' });
  }
}

module.exports = { checkAdmin };
