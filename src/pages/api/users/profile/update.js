import { verify } from 'jsonwebtoken';
import Prisma from '../../../../../lib/prisma';
import checkAuth from '../../middleware/checkAuth'
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

const handler = async function handler(req, res) {
  switch (req.method) {
    case 'PUT':
      return await updateUser(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function updateUser(req, res) {
  const { email, firstName, lastName } = req.body;
  const authorization = req.headers["authorization"]
  const token = authorization.split(" ")[1]
  const decoded = verify(token, serverRuntimeConfig.secret);

  const udpatedUser = await Prisma.user.update({
    where : { id: Number(decoded.user) },
    data: {
      email,
      firstName,
      lastName
    }
  });

  res.send({
    id: udpatedUser.id,
    email: udpatedUser.email,
    firstName: udpatedUser.firstName,
    lastName: udpatedUser.lastName
  });
}

export default checkAuth(handler);