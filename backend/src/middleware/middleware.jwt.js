import JWT from "jsonwebtoken";
import Dotenv from "dotenv";
import path from 'path';

Dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`)});

const JWTMiddleware = {};

JWTMiddleware.checkAuthorization = (req, res, next) => {
  let token = req.headers['authorization'];

  // If there's no token then we're done here
  if (!token) return next();

  token = token.replace('Bearer','');

  JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) {
      return res.status(401).json({
        "success": false,
        "message": "An error has occurred. Please verify your credentials and try loggin in again."
      });
    } else {
      req.userFromToken = user;
      next();
    }
  });
};

export default JWTMiddleware;