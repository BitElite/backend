import { expressjwt, Request as JWTRequest } from 'express-jwt';
import { appConfig } from '../config'


/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 */
const getTokenFromHeader = (req: JWTRequest): any => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const isAuth = expressjwt({
  secret: appConfig.jwtSecret, // The _secret_ to sign the JWTs
  algorithms: [appConfig.jwtAlgorithm], // JWT Algorithm
  requestProperty: 'token', // Use req.token to store the JWT
  getToken: getTokenFromHeader, // How to extract the JWT from the request

});

export default isAuth;
