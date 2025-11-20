const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Không có token, truy cập bị từ chối' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token đã hết hạn' 
      });
    }
    res.status(401).json({ 
      success: false,
      message: 'Token không hợp lệ' 
    });
  }
};

module.exports = auth;