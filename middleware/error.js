
export default function (req, res, next) {
  return res.status(500).send('Something failed');
}