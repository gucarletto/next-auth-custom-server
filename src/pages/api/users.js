import { verify } from 'jsonwebtoken';
import Prisma from '../../../lib/prisma';
import checkAuth from './middleware/checkAuth'
import getConfig from 'next/config';
import logger from '../../../logger';
const { serverRuntimeConfig } = getConfig();
const bcrypt = require('bcrypt');
const MaskData = require('maskdata')

const handler = async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return await getUsers(req, res);
    case 'POST':
      return await postUser(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function getUsers(req, res) {
  const authorization = req.headers["authorization"]
  const token = authorization.split(" ")[1]
  const decoded = verify(token, serverRuntimeConfig.secret);

  const users = await Prisma.user.findMany({
    where : {
      id : {
        not: Number(decoded.user)
      }
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true
    }
  });

  res.send(users);
}

async function postUser(req, res) {
  const { email, password, firstName, lastName } = req.body;

  const user = await Prisma.user.findUnique({
    where: {
      email
    }
  });

  if (user) {
    logger.error(`Trying to intert a user with email alteray used ${MaskData.maskEmail2(email)}`);
    return res.status(500).json({ error: 'Trying to intert a user with email already used' });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = await Prisma.user.create({
    data: {
      email,
      password: encryptedPassword,
      firstName,
      lastName
    }
  });

  // return basic user details
  return res.status(200).json({
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
  });
}

export default checkAuth(handler);