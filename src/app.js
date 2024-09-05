import express from "express"
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.routes.js';
import displayRoutes from 'express-routemap';
import viewsRouter from "./routes/views.routes.js"
import ProductManager from './dao/fs/controllers/productmanager.js';
import sessionsRouter from './routes/sessions.routes.js';
import cookieParser from "cookie-parser";
import passport from 'passport';
import "./database.js"
import initializePassport from './config/passport.config.js';
const app = express();
const puerto = 8080;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"));
app.use("/", viewsRouter)
app.use(cookieParser())
app.use(passport.initialize());
initializePassport()

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");




app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter)






const http = app.listen(puerto, () => {
    displayRoutes(app)
    console.log(`Servidor activo en el puerto ${puerto}`);
});



const productManager = new ProductManager("./src/data/products.json")

const io = new Server(http);

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto!");

    socket.emit("products", await productManager.getProducts())

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id)
        io.sockets.emit("products", await productManager.getProducts())
    })

    socket.on("updateProduct", async (product) => {
        await productManager.addProduct(product)
        io.sockets.emit("products", await productManager.getProducts())
    })
});




