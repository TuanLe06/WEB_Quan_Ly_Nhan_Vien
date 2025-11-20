const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Người dùng chưa xác thực' 
      });
    }

    if (!allowedRoles.includes(req.user.vai_tro)) {
      return res.status(403).json({ 
        success: false,
        message: `Chỉ ${allowedRoles.join(', ')} mới có quyền truy cập chức năng này` 
      });
    }
    
    next();
  };
};

module.exports = roleCheck;