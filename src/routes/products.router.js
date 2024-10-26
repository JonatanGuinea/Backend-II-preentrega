// import {Router} from "express"
// import ProductManager from "../Dao/controllers/productManager.js"
// import { __dirname } from "../utils.js"
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

//   routerP.post("/products", async (req, res) => {
//     const newproduct = await manager.addProduct(req.body) ;
//       res.status(200).json({error:null, data: newproduct });
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
import productModel from "../Dao/models/product.model.js";

const routerP = Router();

// GET - Obtener todos los productos (con opción de límite)
routerP.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = limit
      ? await productModel.find().limit(parseInt(limit)).lean()
      : await productModel.find().lean();
      
    res.status(200).json({ error: null, data: products });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos", data: null });
  }
});

// GET - Obtener producto por ID
routerP.get("/products/:pid", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).lean();
    if (product) {
      res.status(200).json({ error: null, data: product });
    } else {
      res.status(404).json({ error: "Producto no encontrado", data: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto", data: null });
  }
});

routerP.post("/products", async (req, res) => {
  try {
    const { title, description, price, category, status = true, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !category || !code || !stock) {
      return res.status(400).json({ error: "Todos los campos son obligatorios", data: null });
    }

    const productExists = await productModel.findOne({ code });
    if (productExists) {
      return res.status(400).json({ error: "El código del producto ya existe", data: null });
    }

    const newProduct = new productModel({
      title,
      description,
      price,
      category,
      status,
      thumbnail,
      code,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ error: null, data: savedProduct });
  } catch (error) {
    console.error("Error al agregar el producto:", error); // Agrega esta línea para registrar el error
    res.status(500).json({ error: "Error al agregar el producto", data: null });
  }
});


// PUT - Actualizar un producto por ID
routerP.put("/products/:pid", async (req, res) => {
  try {


    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedProduct) {
      res.status(200).json({ error: null, data: updatedProduct });
    } else {
      res.status(404).json({ error: "Producto no encontrado", data: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto", data: null });
  }
});

// DELETE - Eliminar un producto por ID
routerP.delete("/products/:pid", async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
    if (deletedProduct) {
      res.status(200).json({ error: null, data: "Producto eliminado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado", data: null });
    }
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado", data: null });
    // res.status(500).json({ error: "Error al eliminar el producto", data: null });
  }
});

export default routerP;
