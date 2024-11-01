import express  from "express";
import Cart from '../Dao/models/cart.model.js';
import CartController from '../Dao/controllers/cartsManager.js' 

const router = express.Router();

const cm = new CartController()

router.get('/', async (req, res) => {
    const cart = await cm.get()
    res.status(200).render('carts', { cart });
})

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    await Cart.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } });
    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body.products;
    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    res.json(cart);
});

// Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOneAndUpdate(
        { _id: cid, 'products.product': pid },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
    );
    res.json(cart);
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    await Cart.findByIdAndUpdate(cid, { products: [] });
    res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
});

// Obtener el carrito completo con productos poblados
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    res.json(cart);
});

export default router
