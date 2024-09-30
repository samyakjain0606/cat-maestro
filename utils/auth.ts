// utils/auth.ts

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string; // Subject (user ID)
  username: string;
  iat: number; // Issued at
  exp: number; // Expiry
}

// Extend NextApiRequest to include user property
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      username: string;
    };
  }
}

export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};

export const isLoggedIn = (): boolean => {
    const token = getCookie('token');
    return !!token;
};

export const getUserIdFromToken = (token: string | undefined): string | null => {
    if (!token) {
        return null;
    }
    try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded.sub);
        return decoded.sub;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Middleware to protect API routes
export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      // Add the user's ID and username to the request object
      req.user = { id: decoded.sub, username: decoded.username };
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}