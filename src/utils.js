import {dirname} from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


export  const __dirname=dirname(fileURLToPath(import.meta.url))

export const config = {
   PORT: process.env.PORT|| 3000,
   MONGODB_URI: 'mongodb+srv://jonatanguinea7:642859Jj642859@cluster0.mesld.mongodb.net/products',

      APP_NAME: 'appGithubBackend',
      USERS_COLLECTION: 'users',
      CARTS_COLLECTION: 'carts',
      PRODUCTS_COLLECTION: 'products',

      SECRET : 'secretcode',

      GITHUB_CLIENT_ID: "Iv23lifxh3zbGdyUZLNJ",
      GITHUB_APP_ID: "1097625",
      GITHUB_SECRET: "4e6058727fd0338a8772d460e953462273dedce5",
      GITHUB_CALLBACK_URL: "http://localhost:3000/api/users/ghcallback"
} 

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const createToken = (payload, duration)=>{jwt.sign(payload, config.SECRET, {expiresIn: duration})};

export const verifyToken = (req, res, next) => {
   const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
   const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`] ? req.cookies[`${config.APP_NAME}_cookie`] : undefined;
   const queryToken = req.query.access_token ? req.query.access_token : undefined;
   const receivedToken = headerToken || cookieToken || queryToken;

   if (!receivedToken) return res.status(401).send({ error: 'Se requiere token', data: [] });

   jwt.verify(receivedToken, config.SECRET, (err, payload) => {
       if (err) return res.status(403).send({ error: 'Token no válido', data: [] });
       
       req.user = payload;
       next();
   });
};