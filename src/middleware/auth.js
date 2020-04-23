import jwt from 'jsonwebtoken';
import config from 'config';
import httpStatus from 'http-status'

export default function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (ex) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'The token is expired or invalid.' });
  }
}