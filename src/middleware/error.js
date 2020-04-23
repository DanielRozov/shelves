import httpStatus from 'http-status'

export default function (req, res, next) {
  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: 'Something failed.' });
}