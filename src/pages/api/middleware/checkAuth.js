import { verify } from 'jsonwebtoken'
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

const checkAuth = (handler) => {
  return async (req, res) => {
    try {
      const authorization = req.headers["authorization"]
      if (!authorization) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const token = authorization.split(" ")[1]
      verify(token, serverRuntimeConfig.secret);

      return handler(req, res)
    } catch (e) {
      console.log(e)
      res.status(401).send()
    }
  }
}

export default checkAuth