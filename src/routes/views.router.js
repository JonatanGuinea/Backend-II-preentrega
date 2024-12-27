import { Router } from 'express';
import ProductManager from '../Dao/controllers/productManager.js';
import CartsManager from '../Dao/controllers/cartsManager.js';
import UserManager from '../Dao/controllers/usersManager.js'
import { __dirname } from '../utils.js';



const pm=new ProductManager(__dirname+'/Dao/database/products.json')
const cm = new CartsManager(__dirname)
const um = new UserManager(__dirname)

const routerV = Router()



routerV.get("/",async(req,res)=>{
    const listadeproductos=await pm.getProducts(req.query)
    res.status(200).render("home",{listadeproductos})
    
})
routerV.get('/carts/:cid', async (req, res) => {
    const cart = await cm.getOneByIdCart(req.params.cid);
    res.status(200).render('onecart', { cart });
    
    });
routerV.get('/carts', async (req, res) => {
    const carts = await cm.get()
    res.status(200).render('carts', { carts: carts })
    // res.status(200).json(carts)

})
routerV.get('/users', async (req, res) => {
    const users = await um.get()
    res.status(200).render('users',{users});
})
routerV.get('/login', async (req, res) => {
    res.status(200).render('login')
})


routerV.get("/realtimeproducts",(req,res)=>{
    
res.status(200).render("realtimeproducts")
})

// src/routes/views.router.js










export default routerV