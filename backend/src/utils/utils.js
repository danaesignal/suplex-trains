import JWT from 'jsonwebtoken';
import Dotenv from 'dotenv';
import path from 'path';

Dotenv.config({ path: path.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`)});

let Utils = {};

Utils.generateToken = (user) => {
  const u = {
    _id: user._id,
    userName: user.userName,
    displayName: user.displayName,
    email: user.email,
    authLevel: user.authLevel
  };
  return JWT.sign(u, process.env.JWT_SECRET, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
};

Utils.cleanUser = (user) => {
  if(!user) return user;
  const u = {
    _id: user._id,
    userName: user.userName,
    displayName: user.displayName,
    email: user.email,
    authLevel: user.authLevel
  };
  return {... u};
}

export default Utils;