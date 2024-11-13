

import { Router } from "express";
import CartController from '../Dao/controllers/cartsManager.js' 

const router = Router();

const cm = new CartController()



//obetener carrito por id de usuario
router.get('/', async (req, res) => {
    const data = await cm.get()
    res.status(200).json({data : data});
})
router.get('/:cid', async (req, res) => {
    const data = await cm.getOneByIdCart(req.params.cid)
    // res.status(200).render('carts', { carts })
    res.status(200).json({data : data});
})

//Agregar nuevo carrito
router.post('/:uid?', async (req, res) => {
    const newCart = await cm.add(req.params.uid)
    res.status(200).json({data : newCart});
})



router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    
    try {
        const updatedCart = await cm.deleteProduct(cid, pid); // Llamada a la función delete
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
        }
        res.json({ status: 'success', message: 'Producto eliminado del carrito', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body.products;
    const cart = await cm.update(cid, { products }, { new: true });
    res.json(cart);
});

// Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cm.update(
        { _id: cid, 'products.product': pid },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
    );
    res.json(cart);
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const cart = req.params.cid;
    await cm.delete(cart);
    res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
});
router.delete('/delete/:cid', async (req, res) => {
    const cart = req.params.cid;
    await cm.deleteCart(cart);
    res.json({ status: 'success', message: 'Carrito eliminado' });
});

// Obtener el carrito completo con productos poblados
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cm.getOneByIdCart(cid).populate('products.product');
    res.json(cart);
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { qty } = req.body;  // Cantidad de producto pasada en el cuerpo de la solicitud

    try {
        const cart = await cm.addProductToCart(cid, pid, qty || 1); 
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(505).json({ status: 'error', message: 'Carrito inexistente' });
    }
});

router.post('/:uid', async(req, res)=>{
    const createCart = await cm.add(req.params.uid)
    res.status(200).json({error:null, data: createCart })
})
export default router
