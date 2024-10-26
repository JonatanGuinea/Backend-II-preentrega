import {dirname} from "path"
import { fileURLToPath } from "url"

export  const __dirname=dirname(fileURLToPath(import.meta.url))


export const config = {
   PORT: 3000,
   MONGODB_URI: 'mongodb+srv://jonatanguinea7:642859Jj642859@cluster0.mesld.mongodb.net/products'
    
} 