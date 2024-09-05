import ProductManager from '../dao/db/product-manager-db.js';
import CartManager from '../dao/db/cart-manager-db.js';
import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.error("Error al mostrar los productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const productos = await productManager.getProducts({}, {
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArray = productos.docs.map(producto => {

            const { _id, ...rest } = producto;
            return rest;
        });


        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});
router.get("/carts/:cid", async (req, res) => {
    const cartID = req.params.cid;

    // Validar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(cartID)) {
        return res.status(400).json({ error: "ID de carrito no válido" });
    }

    try {
        const carrito = await cartManager.getCarritoById(cartID);
        console.log(carrito);
        if (!carrito) {
            console.log("No existe el carrito que intentas buscar");
            return res.status(404).json({ error: "Carrito no encontrado :/" });
        }

        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));

        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register")
})




export default router;
