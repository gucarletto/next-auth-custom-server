const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
const MaskData = require('maskdata')

import Prisma from '../../../lib/prisma';
import logger from '../../../logger';

const handler = async(req, res) => {
  switch (req.method) {
    case 'POST':
      return await authenticate(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function authenticate(req, res) {
    const { email, password } = req.body;

    const user = await Prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!(user && await bcrypt.compare(password, user.password))) {
      logger.error(`Invalid email or password for user with email: ${MaskData.maskEmail2(email)}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ user: user.id }, serverRuntimeConfig.secret, { expiresIn: '1d' });

    // return basic user details and token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  }
}

export default handler;