import { Router } from "express";
import CartManager from '../dao/CartManager.js'

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", async (req, res) => {
    const newCart = await CM.newCart();
    if (newCart) {
        res.send({ status: "ok", message: "Carrito creado exitosamente!" });
    } else {
        res.status(500).send({ status: "error", message: "Error! Hubo un problema al crear el carrito!" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);

    if (cart) {
        res.send({ products: cart.products });
    } else {
        res.status(400).send({ status: "error", message: "Error! No existe ningun carrito con ese ID!" });
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resultado = await CM.addToCart(cid, pid);

    if (resultado) {
        res.send({ status: "ok", message: "Producto agregado al carrito!" });

    } else {
        res.status(400).send({ status: "error", message: "Error! Hubo un problema al agregar el producto al carrito!" });
    }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const result = await CM.updateQuantityProductCart(cid, pid, quantity);

    if (result) {
        res.send({ status: "ok", message: "Producto actualizado correctamente!" });
    } else {
        res.status(400).send({ status: "error", message: "Error! Hubo un problema actualizar el Producto del Carrito!" });
    }
});

cartsRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body.products;
    const result = await CM.updateProducts(cid, products);

    if (result) {
        res.send({status:"ok", message:"El producto se agregó correctamente!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se pudo agregar el Producto al Carrito!"});
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await CM.deleteProductCart(cid, pid);

    if (result) {
        res.send({ status: "ok", message: "Producto eliminado del carrito!" });
    } else {
        res.status(400).send({ status: "error", message: "Error! Hubo un problema al eliminar el producto del carrito!" });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const result = await CM.deleteProductsCart(cid);

    if (result) {
        res.send({ status: "ok", message: "El carrito se vació correctamente!" });
    } else {
        res.status(400).send({ status: "error", message: "Error! No se pudo vaciar el Carrito!" });
    }
});

export default cartsRouter;