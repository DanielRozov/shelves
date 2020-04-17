import httpStatus from 'http-status'

export default function (req, res, next) {
  if (!req.user.isAdmin) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ status: httpStatus.FORBIDDEN, message: 'Access denied.' });
  }

  next();
}