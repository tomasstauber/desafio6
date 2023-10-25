import express from "express";
import __dirname from "./utils.js";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import { Server } from "socket.io";
import mongoose from "mongoose";
import ProductManager from "./dao/ProductManager.js";
import ChatManager from "./dao/ChatManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.routes.js";
import viewsRouter from "./routes/views.routes.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./middlewares/passport.js";
import initializeGitHubPassport from "./middlewares/github.js";
import { MONGODB_CONNECT, PORT, SECRET_SESSIONS} from "./config/config.js"

const app = express();

//Para iniciar el proyecto: node ./src/app.js

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGODB_CONNECT,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10000
    }),
    secret: SECRET_SESSIONS,
    resave: false,
    saveUninitialized: false
}));

const dbConection = mongoose.connect(MONGODB_CONNECT,({
    useNewUrlParser: true,
    useUnifiedTopology: true
  }))
  

app.use(cookieParser());
initializePassport();
initializeGitHubPassport();
app.use(passport.initialize());

const httpServer = app.listen(PORT, () => {
    console.log("Servidor Activo en el puerto: " + PORT);
});
const socketServer = new Server(httpServer);
const PM = new ProductManager();
const CM = new ChatManager();

app.set("views", __dirname + "/views");
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/", viewsRouter);

socketServer.on("connection", (socket) => {
    console.log("Nueva Conexión!");

    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);

    socket.on("nuevoProducto", (data) => {
        const product = {title:data.title, description:"", code:"", price:data.price, status:"", stock:10, category:"", thumbnails:data.thumbnails};
        PM.addProduct(product);
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("eliminarProducto", (data) => {
        PM.deleteProduct(parseInt(data));
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("newMessage", async (data) => {
        CM.createMessage(data);
        const messages = await CM.getMessages();
        socket.emit("messages", messages);
    });
});