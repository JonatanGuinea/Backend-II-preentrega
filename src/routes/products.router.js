
import { Router } from "express";
import ProductManager from "../Dao/controllers/productManager.js";


const routerP = Router();
const manager = new ProductManager();

// GET - Obtener todos los productos con paginación y filtros
routerP.get("/", async (req, res) => {
  

  try {
    const result = await manager.getProducts(req.query)
    res.status(200).json({error: null, data : result})
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET - Obtener producto por ID
routerP.get("/:pid", async (req, res) => {
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
routerP.post("/", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json({ error: null, data: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message, data: null });
  }
});

// PUT - Actualizar producto por ID
routerP.put("/:pid", async (req, res) => {
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
routerP.delete("/:pid", async (req, res) => {
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
