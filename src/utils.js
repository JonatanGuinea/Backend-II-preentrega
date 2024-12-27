import {dirname} from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"


export  const __dirname=dirname(fileURLToPath(import.meta.url))


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const config = {
   PORT: process.env.PORT|| 3000,
   MONGODB_URI: 'mongodb+srv://jonatanguinea7:642859Jj642859@cluster0.mesld.mongodb.net/products',

      
      USERS_COLLECTION: 'users',
      CARTS_COLLECTION: 'carts',
      PRODUCTS_COLLECTION: 'products',

      SECRET : 'secretcode'
} 