import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import productsController from "../controllers/products.controllers.js";

const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", productsController.getProducts.bind(productsController));

productsRouter.get("/:pid", productsController.getProductById.bind(productsController));

productsRouter.post("/", productsController.addProduct.bind(productsController));

productsRouter.put("/:pid", productsController.updateProduct.bind(productsController));

productsRouter.delete("/:pid", productsController.deleteProduct.bind(productsController));

export default productsRouter;