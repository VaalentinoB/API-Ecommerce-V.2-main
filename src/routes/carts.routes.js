import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();
// Crear carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un carrito", error);
        res.status(500).json({ error: "Error del servidor :(" });
    }
});

// Listar carrito
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } catch (error) {
        console.error("Error: no se pudo obtener el carrito :/", error);
        res.status(500).json({ error: "Error del servidor :(" });
    }
});

// Actualizar carrito 

router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const cantidad = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(carritoId, productoId, cantidad);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error del servidor :(" });
    }
});

//Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const actualizarCarrito = await cartManager.eliminarProductoDelCarrito(cartId, productId);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error del servidor :(" });
    }
});


router.put("/:cid", async (req, res) => {
    const productos = req.body.products;
    const cartId = req.params.cid;

    try {
        const actualizarCarrito = await cartManager.actualizarCarrito(cartId, productos);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error del servidor :(" });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const actualizarCarrito = await cartManager.actualizarCantidadProducto(cartId, productId, quantity);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error del servidor :(" });
    }
});

router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const actualizarCarrito = await cartManager.eliminarTodosLosProductos(cartId);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error del servidor :(" });
    }
});



export default router;
