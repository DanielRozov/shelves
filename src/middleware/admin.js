import httpStatus from 'http-status'

export default function (req, res, next) {
  if (!req.user.isAdmin) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ message: 'Access denied.' });
  }
  next();
}