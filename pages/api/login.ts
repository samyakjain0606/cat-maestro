// pages/api/login.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { username, password } = req.body;

  try {
    // Retrieve the user from the database
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, username, password')
      .eq('username', username)
      .single();

    if (error) throw error;

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: userData.id, username: userData.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    // Set the token in an HTTP-only cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 8, // 8 hours in seconds
      path: '/',
      sameSite: 'lax'
    }));

    res.status(200).json({ username: userData.username, id: userData.id });
  } catch (error) {
    res.status(500).json({ error: "Error in 55th line" });
  }
}