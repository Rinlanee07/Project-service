import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../generated/prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const repair = await prisma.repair.findUnique({
        where: { id: String(id) },
      });

      if (!repair) {
        return res.status(404).json({ error: 'Repair not found' });
      }

      return res.status(200).json(repair);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'PUT') {
    const { status, details } = req.body;

    try {
      const updatedRepair = await prisma.repair.update({
        where: { id: String(id) },
        data: { status, details },
      });

      return res.status(200).json(updatedRepair);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.repair.delete({
        where: { id: String(id) },
      });

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.setHeader('Allow', ['GET', 'PUT', 'DELETE']).status(405).end(`Method ${req.method} Not Allowed`);
}