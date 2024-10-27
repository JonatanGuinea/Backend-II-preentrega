// import {Router} from "express"
// import { __dirname } from "../utils.js"
// import ProductManager from "../Dao/controllers/productManager.js"
// import productModel from '../Dao/models/product.model.js'


// const manager=new ProductManager(__dirname+'/Dao/database/products.json')

// const routerP =Router()

// routerP.get("/products",async(req,res)=>{
  
  //   const data = await productModel.find().lean()
  //   // const products= await manager.getProducts(req.query)
  //     res.status(200).json({error : null, data: data})
  
  // })
  
  
  
  // routerP.get("/products/:pid", async (req, res) => {
    //     const productfind = await manager.getProductbyId(req.params);
    //     res.status(200).json({error:null, data : productfind });
    //   });
    
    //     const newproduct = await manager.addProduct(req.body) ;
    //       res.status(200).json({error:null, data: newproduct });
    //   routerP.post("/products", async (req, res) => {
      //   });
      
      //   routerP.put("/products/:pid", async (req, res) => {
        //     const updatedproduct = await manager.updateProduct(req.params,req.body);
        //       res.status(200).json({error:null, data: updatedproduct });
        //   });
        
        
        //   routerP.delete("/products/:pid", async (req, res) => {
          //     const id=parseInt(req.params.pid)
          //     const deleteproduct = await manager.deleteProduct(id);
          //       res.status(200).json({error:null,data :deleteproduct });
          //   });
          
          
          
          // export default routerP
          
          
          import { Router } from "express";
          import ProductManager from "../Dao/controllers/productManager.js";
          
          const routerP = Router();
          const manager = new ProductManager();
          
          // GET - Obtener todos los productos (con opción de límite)
          routerP.get("/products", async (req, res) => {
            try {
              const products = await manager.getProducts(req.query);
              res.status(200).json({ error: null, data: products });
            } catch (error) {
              res.status(500).json({ error: error.message, data: null });
            }
          });
          
          // GET - Obtener producto por ID
          routerP.get("/products/:pid", async (req, res) => {
            try {
              const product = await manager.getProductbyId(req.params.pid);
              if (product) {
                res.status(200).json({ error: null, data: product });
              } else {
                res.status(404).json({ error: "Producto no encontrado", data: null });
              }
            } catch (error) {
              res.status(500).json({ error: error.message, data: null });
            }
          });
          
          // POST - Agregar producto
          routerP.post("/products", async (req, res) => {
            try {
              const newProduct = await manager.addProduct(req.body);
              res.status(201).json({ error: null, data: newProduct });
            } catch (error) {
              res.status(400).json({ error: error.message, data: null });
            }
          });
          
          // PUT - Actualizar producto por ID
          routerP.put("/products/:pid", async (req, res) => {
            try {
              const updatedProduct = await manager.updateProduct(req.params.pid, req.body);
              if (updatedProduct) {
                res.status(200).json({ error: null, data: updatedProduct });
              } else {
                res.status(404).json({ error: "Producto no encontrado", data: null });
              }
            } catch (error) {
              res.status(500).json({ error: error.message, data: null });
            }
          });
          
          // DELETE - Eliminar producto por ID
          routerP.delete("/products/:pid", async (req, res) => {
            try {
              const result = await manager.deleteProduct(req.params.pid);
              if (result) {
                res.status(200).json({ error: null, data: result });
              } else {
                res.status(404).json({ error: "Producto no encontrado", data: null });
              }
            } catch (error) {
              res.status(500).json({ error: error.message, data: null });
            }
          });
          
          export default routerP;
          