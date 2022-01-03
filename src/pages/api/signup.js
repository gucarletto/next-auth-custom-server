const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
const MaskData = require('maskdata')

import Prisma from '../../../lib/prisma';
import logger from '../../../logger';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return await signUp(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function signUp(req, res) {
    const { email, password, firstName, lastName } = req.body;

    const user = await Prisma.user.findUnique({
      where: {
        email
      }
    });

    if (user) {
      logger.error(`There is already an account with email ${MaskData.maskEmail2(email)}`);
      return res.status(500).json({ error: 'There is already an account with this email' });
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

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ user: newUser.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });
    // return basic user details and token
    return res.status(200).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      }
    });
  }
}