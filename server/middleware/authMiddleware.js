import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
  Protect middleware
  - reads JWT from Authorization header
  - verifies token
  - attaches user to req.user
*/
const protect = async (req, res, next) => {
  try {
    let token;

    // Authorization: Bearer TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // no token sent
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // find user and attach to request
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    // continue to next middleware/controller
    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    return res.status(401).json({
      message: "Not authorized",
    });
  }
};

export default protect;