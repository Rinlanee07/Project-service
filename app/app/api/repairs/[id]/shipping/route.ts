import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Handle GET request for shipping information
    try {
      // Fetch shipping information based on the repair ID
      // This is a placeholder for your data fetching logic
      const shippingInfo = await getShippingInfoById(id as string);
      res.status(200).json(shippingInfo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipping information' });
    }
  } else if (req.method === 'POST') {
    // Handle POST request to update shipping information
    try {
      const shippingData = req.body;
      // Update shipping information based on the repair ID
      // This is a placeholder for your data updating logic
      await updateShippingInfoById(id as string, shippingData);
      res.status(200).json({ message: 'Shipping information updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update shipping information' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Placeholder functions for data fetching and updating
async function getShippingInfoById(id: string) {
  // Implement your logic to fetch shipping information
  return { id, status: 'In Transit', estimatedDelivery: '2023-10-30' };
}

async function updateShippingInfoById(id: string, data: any) {
  // Implement your logic to update shipping information
  return true;
}