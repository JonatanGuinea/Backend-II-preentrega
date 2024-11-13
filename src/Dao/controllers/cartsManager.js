import cartModel from '../models/cart.model.js';
import userModel from '../models/user.model.js';



class CartController {
    constructor() {}

    get = async () => {
        try {
            return await cartModel.find().populate({
                path: 'products.product',
                select: 'title description price'
            })
            .populate({path:'userId',model: userModel, select:'first_name last_name gender '})
            .lean();
        } catch (err) {
            return err.message;
        }
    }

    // Obtener un carrito por ID de usuario con productos poblados
    getOne = async (id) => {
        try {
            return await cartModel.findOne({ userId: id })
                .populate({
                    path: 'products.product',
                    select: 'title description price'
                })
                .populate({path:'userId',model: userModel, select:'first_name last_name '})
                .lean();
        } catch (err) {
            return 'No existe el carrito: ' + err.message;
        }
    }
    getOneByIdCart = async (id) => {
        try {
            return await cartModel.findOne({ _id: id })
                .populate({
                    path: 'products.product'
                })
                .populate({
                    path: 'userId'
                })
                .lean();
        } catch (err) {
            return 'No existe el carrito: ' + err.message;
        }
    };
    

    add = async (data) => {
        try {
            
            const createCart = await cartModel.create({userId:data, products:[]})
            return createCart
        } catch (err) {
            return err.message;
        }
    }
    
    
    
    update = async (filter, updated, options) => {
        try {
            return await cartModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

    delete = async (cart)=> {
    try {
        await cartModel.updateOne({_id:cart}, {products:[]})
    }catch(error){
        return err.message
    }
    }
    deleteCart = async (cart)=> {
    try {
        await cartModel.deleteOne({_id:cart})
    }catch(error){
        return err.message
    }
    }

    deleteProduct = async (cid, pid) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid }, // Buscar el carrito por ID
                { $pull: { products: { product: pid } } }, // Eliminar el producto con el ID especificado
                { new: true } // Opcional: para devolver el carrito actualizado
            );
        } catch (err) {
            return err.message;
        }
    };
    

    addProductToCart = async (cartId, productId, quantity) => {
        try {   
            
                const cart= await cartModel.findByIdAndUpdate(cartId,{$push: { products: { product: productId, quantity: quantity } }},{ new: true })
            

            // Guarda el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error.message);
            throw error;
        }
    };
}


export default CartController;