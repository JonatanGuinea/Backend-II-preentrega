import { Router } from 'express';
import ProductManager from '../Dao/controllers/productManager.js';
import { __dirname } from '../utils.js';
import routerP from './products.router.js'
import routerC from './carts.router.js'
import routerU from "./users.router.js";


const pm=new ProductManager(__dirname+'/Dao/database/products.json')

const routerV = Router()


routerV.get("/",async(req,res)=>{
    const listadeproductos=await pm.getProducts(req.query)
    res.sendStatus(200).render("home",{listadeproductos})

})

routerV.get("/realtimeproducts",(req,res)=>{
res.status(200).render("realtimeproducts")
})

// src/routes/views.router.js



routerV.use('/api/products', routerP)
routerV.use('/api/carts', routerC)
routerV.use('/api/users', routerU)






export default routerV