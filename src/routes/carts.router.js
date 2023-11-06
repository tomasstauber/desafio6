import { Router } from "express";
import CartManager from '../dao/CartManager.js'
import cartsController from "../controllers/carts.controller.js";
import { passportCall } from "../utils.js"

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", cartsController.newCart.bind(cartsController));

cartsRouter.get("/:cid", cartsController.getCart.bind(cartsController));

cartsRouter.post("/:cid/products/:pid", cartsController.addToCart.bind(cartsController));

cartsRouter.put("/:cid", cartsController.updateCart.bind(cartsController));

cartsRouter.put("/:cid/products/:pid", cartsController.updateQuantityProductCart.bind(cartsController));

cartsRouter.delete("/:cid/products/:pid", cartsController.deleteProductCart.bind(cartsController));

cartsRouter.delete("/:cid", cartsController.deleteProductsCart.bind(cartsController));

cartsRouter.post("/:cid/purchase", (req, res, next) => {
    console.log('Ruta de compra accedida');
    next();
}, passportCall("jwt"), cartsController.createPurchaseTicket.bind(cartsController));

export default cartsRouter;