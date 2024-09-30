// utils/auth.ts

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
// import jwtDecode from 'jwt-decode';
// import { decode as jwtDecode } from 'jwt-decode';
// import * as jwtDecode from 'jwt-decode';
// import jwt_decode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string; // Subject (user ID)
  username: string;
  iat: number; // Issued at
  exp: number; // Expiry
}

export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};

export const isLoggedIn = (): boolean => {
    // Check for the presence of a session token in cookies
    // This assumes you have a way to access cookies on the client side
    console.log("here 22")
    const token = getCookie('token');
    console.log(token)
    return !!token;
};
// This function should be used in a server-side context only
export const getUserIdFromToken = (token: string | undefined): string | null => {
    console.log("token inside getUserIdToken");
    console.log(token);
    try {
        const decoded: DecodedToken = jwtDecode(token);
    //   const { default: jwt_decode } = require("jwt-decode");
    //   const tokenDecoded = jwt_decode(token);
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