import productModel from "../models/product.model.js";

export default class ProductManager {
  // GET - Obtener todos los productos con límite opcional
  getProducts = async (info) => {
    try {

      const products = info
        ? await productModel.find().limit(parseInt(info)).lean()
        : await productModel.find().lean();
      return products;
    } catch (error) {
      throw new Error("Error al obtener productos: " + error.message);
    }
  };

  // GET - Obtener producto por ID
  getProductbyId = async (id) => {
    try {
      const product = await productModel.findById(id).lean();
      return product || null;
    } catch (error) {
      throw new Error("Error al obtener el producto: " + error.message);
    }
  };

  // POST - Agregar un producto
  addProduct = async (obj) => {
    const { title, description, price, category, status = true, thumbnail, code, stock } = obj;
    if (!title || !description || !price || !category || !code || stock === undefined) {
      throw new Error("Todos los campos son obligatorios");
    }
    
    const productExists = await productModel.findOne({ code });
    if (productExists) throw new Error("El código del producto ya existe");

    const newProduct = new productModel({ title, description, price, category, status, thumbnail, code, stock });
    return await newProduct.save();
  };

  // PUT - Actualizar un producto por ID
  updateProduct = async (id, updates) => {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      return updatedProduct || null;
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  };

  // DELETE - Eliminar un producto por ID
  deleteProduct = async (id) => {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(id);
      return deletedProduct ? "Producto Eliminado" : null;
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  };

  getProductsView = async () => {
    try {
     

        const productlist = await productModel.find().lean();
          return productlist;
     
    } catch (error) {
      throw new Error(error);
    }
};
}
