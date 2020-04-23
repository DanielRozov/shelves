import { authentcateUser } from '../services/auth.service';
import httpStatus from 'http-status';
import asyncMiddleware from '../middleware/async'

const postUser = asyncMiddleware(async (req, res) => {
  try {
    const token = await authentcateUser(req, res);
    return res.status(httpStatus.ACCEPTED).json({token});
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({message: e.message });
  }
});

export { postUser };