const jwt = require('jsonwebtoken');

const isCustomerAuth = (req, res, next) => {
  try {
    // Token can come from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Customer login is required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure this is a customer token, not an admin token
    if (decoded.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - customer token required',
      });
    }

    req.customerId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = isCustomerAuth;
