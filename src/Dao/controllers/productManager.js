import productModel from "../models/product.model.js";

export default class ProductManager {
  // GET - Obtener todos los productos con límite opcional
  getProducts = async (info) => {

    const {limit=10, page = 1, sort, query} = info

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
      lean:true
    };

    const filters =query ? { $or: [{ category: query }] } : {}

    try {
      const result = await productModel.paginate(filters, options);
      const dataPaginate = {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.page - 1 : null,
        nextPage: result.hasNextPage ? result.page + 1 : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/?limit=${limit}&page=${result.page - 1}` : null,
        nextLink: result.hasNextPage ? `/?limit=${limit}&page=${result.page + 1}` : null
      }
    return dataPaginate
    }
      catch (error) {
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

getProductsAggregate = async()=>{

    const filtered = await productModel.aggregate([
      {$match : {title: 'Samsung'}},
      {$group: {_id:'$category'}}
    ])

}
}
