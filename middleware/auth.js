

import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "May_your_coffee_kick_in_before_reality_does";

export const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log("Token verification successful:", decodedToken);

    // Optionally, attach the decoded token to the request for use in subsequent middleware/routes
    req.user = decodedToken.id;
    req.role = decodedToken.role;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
