import Prisma from '../../../../lib/prisma';
import checkAuth from '../middleware/checkAuth'

const handler = async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return await getUser(req, res);
    case 'PUT':
      return await updateUser(req, res);
    case 'DELETE':
      return await deleteUser(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function getUser(req, res) {
  const user = await Prisma.user.findUnique({
    where: { id: Number(req.query.id) },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  });

  res.send(user);
}

async function updateUser(req, res) {
  const { email, firstName, lastName } = req.body;

  const udpatedUser = await Prisma.user.update({
    where : { id: Number(req.query.id) },
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

async function deleteUser(req, res) {
  await Prisma.user.delete({
    where : { id: Number(req.query.id) }
  });

  res.status(200).send({});
}

export default checkAuth(handler);