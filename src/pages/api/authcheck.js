const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const MaskData = require('maskdata')

import Prisma from '../../../lib/prisma';
import logger from '../../../logger';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return await authcheck(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function authcheck(req, res) {
    const { email, password } = req.body;

    const user = await Prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!(user && await bcrypt.compare(password, user.password))) {
      logger.error(`Invalid email or password check for user with email: ${MaskData.maskEmail2(email)}`);
      return res.status(401).json({ error: 'Invalid email or password check' });
    }

    // return basic user details and token
    res.status(200).json({
      valid: true
    });
  }
}