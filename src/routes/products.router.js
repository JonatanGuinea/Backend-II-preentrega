import {Router} from "express"
import ProductManager from "../Dao/controllers/productManager.js"
import { __dirname } from "../utils.js"


const manager=new ProductManager(__dirname+'/Dao/database/products.json')

const routerP =Router()

routerP.get("/products",async(req,res)=>{
    const products= await manager.getProducts(req.query)
    res.status(200).json({products})
})

 


routerP.get("/products/:pid", async (req, res) => {
    const productfind = await manager.getProductbyId(req.params);
    res.status(200).json({error:null, productfind });
  });

  routerP.post("/products", async (req, res) => {
    const newproduct = await manager.addProduct(req.body);
     res.status(200).json({error:null, newproduct });
  });

  routerP.put("/products/:pid", async (req, res) => {
    const updatedproduct = await manager.updateProduct(req.params,req.body);
     res.status(200).json({error:null, updatedproduct });
  });

  
  routerP.delete("/products/:pid", async (req, res) => {
    const id=parseInt(req.params.pid)
    const deleteproduct = await manager.deleteProduct(id);
     res.status(200).json({error:null,deleteproduct });
  });



export default routerP