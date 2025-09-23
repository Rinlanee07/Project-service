import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../generated/prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const status = await prisma.repair.findUnique({
        where: { id: String(id) },
        select: { status: true },
      });

      if (!status) {
        return res.status(404).json({ error: 'Repair not found' });
      }

      return res.status(200).json(status);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}