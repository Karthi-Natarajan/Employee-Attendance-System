const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  console.log('Auth middleware - Headers:', req.headers.authorization ? 'Token present' : 'No token');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('Token found, verifying...');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, user id:', decoded.id);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log('User not found in database for id:', decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log('User authenticated:', req.user._id);
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    console.log('No authorization header');
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;
