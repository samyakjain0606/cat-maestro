import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    // Here, implement your logic to register the user in your database
    // This is just a placeholder
    console.log(`Registering user with ID: ${userId}`);

    // Simulating a successful registration
    res.status(200).json({ message: 'User registered successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}