// pages/api/signup.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword }])
      .select();

    // For now, we'll just return a success response
    if (error) {
        // Check for unique constraint violation on username
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Username already taken' });
        }
        throw error;
    }
  
      if (!data) {
        throw new Error('No data returned from insert operation.');
      }
    const token = jwt.sign(
        { sub: data[0].id, username: data[0].username },
        process.env.JWT_SECRET as string,
        { expiresIn: '8h' }
      );
  
      // Set the token in an HTTP-only cookie
      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8, // 8 hours in seconds
        path: '/',
      }));
  
      res.status(201).json({ username: data[0].username, id: data[0].id });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "Sign up error" });
  }
}