import { Router } from "express";
import UsuarioModel from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../util/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import CartManager from '../dao/db/cart-manager-db.js';

const router = Router();
const cartManager = new CartManager();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existeUsuario = await UsuarioModel.findOne({ email });

        if (existeUsuario) {
            return res.status(400).send("Usuario ya en uso!");
        }


        const carrito = await cartManager.crearCarrito();

        const nuevoUsuario = new UsuarioModel({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role: "usuario",
            cart_id: carrito._id
        });

        await nuevoUsuario.save();

        const token = jwt.sign({ usuario: nuevoUsuario.email, rol: nuevoUsuario.role }, "passticket", { expiresIn: "2h" });

        res.cookie("passticketCookieToken", token, {
            maxAge: 7200000,
            httpOnly: true
        });

        res.redirect("/api/sessions/home");

    } catch (error) {
        res.status(500).send("Error interno del servidor 500 ;/");
        console.log(error);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const usuarioEnontrado = await UsuarioModel.findOne({ email })

        if (!usuarioEnontrado) {
            return res.status(401).send("Usuario incorrecto")


        }


        if (!isValidPassword(password, usuarioEnontrado)) {
            return res.status(401).send("Contraseña ingresada es incorrecta!")
        }
        const token = jwt.sign({ usuario: usuarioEnontrado.email, rol: usuarioEnontrado.role }, "passticket", { expiresIn: "2h" });


        res.cookie("passticketCookieToken", token, {
            maxAge: 7200000,
            httpOnly: true
        })

        res.redirect("/api/sessions/home");

    } catch (error) {
        console.log(error)
        res.send("Error")
    }

})

/// Mi ruta current la denomine home 
router.get("/home", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req.user);

    if (req.user) {
        res.render("home", { usuario: req.user.first_name });


    } else {

        res.status(401).send("No autorizado");
    }
})



router.post("/logout", (req, res) => {
    res.clearCookie("passticketCookieToken")

    res.redirect("/login")
})


router.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {

    if (req.user.role == "admin") {


        res.render("admin")


    } else {

        res.status(403).send("No autorizado");
    }
})

//Prometo para la entrega final meter mas css xd


export default router