// pages/api/protected.ts

// import { NextApiRequest, NextApiResponse } from 'next';
// import { withAuth, DecodedToken } from '../../utils/auth';

// const protectedRoute = async (req: NextApiRequest, res: NextApiResponse) => {
//   // At this point, the request has been authenticated by withAuth
//   const user = req.user as DecodedToken;
//   res.status(200).json({ message: `Hello ${user.username}, you are authenticated!` });
// };

// export default withAuth(protectedRoute);