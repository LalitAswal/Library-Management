import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'May_your_coffee_kick_in_before_reality_does';

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken.id;
    req.role = decodedToken.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
