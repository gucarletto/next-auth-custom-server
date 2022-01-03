import { verify } from 'jsonwebtoken';
import Prisma from '../../../../lib/prisma';
import checkAuth from '../middleware/checkAuth'
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

const handler = async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return await getUser(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function getUser(req, res) {
  const authorization = req.headers["authorization"]
  const token = authorization.split(" ")[1]
  const decoded = verify(token, serverRuntimeConfig.secret);

  const user = await Prisma.user.findUnique({
    where: { id: Number(decoded.user) },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  });

  res.send(user);
}

export default checkAuth(handler);