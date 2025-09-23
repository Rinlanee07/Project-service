import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../generated/prisma/client';

export default async function closeRepair(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const repair = await prisma.repair.update({
        where: { id: String(id) },
        data: { status: 'closed' },
      });

      return res.status(200).json(repair);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to close repair' });
    }
  } else {
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}