// backend/proxy/adminProxy.js

const adminProxy = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Please log in first.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only administrators can perform this action.",
    });
  }

  next();
};

module.exports = adminProxy;