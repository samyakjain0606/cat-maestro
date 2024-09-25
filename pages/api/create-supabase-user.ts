import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({ id, email }, { onConflict: 'id' });

    if (error) throw error;

    return res.status(200).json({ message: 'User created or updated in Supabase' });
  } catch (error) {
    console.error('Error creating user in Supabase:', error);
    return res.status(500).json({ error: 'Failed to create user in Supabase' });
  }
}