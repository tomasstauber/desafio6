import cartServices from "../services/carts.services.js";
import ProductManager from "../dao/ProductManager.js";
import { cartModel } from "../dao/models/cart.model.js";
import ticketController from "./ticket.controller.js";

class cartsController {
    constructor() {
        this.cartServices = new cartServices();
    };

    async newCart(req, res) {
        try {
            const result = await this.cartServices.newCart();
            res.send(result);
        } catch (error) {
            res.status(400).send({ status: "Error", message: "Ha ocurrido un error al crear el carrito!" });
        }
    };

    async getCart(req, res) {
        try {
            const result = await this.cartServices.getCart(req.params.cid);
            res.send({ products: result.products })
        } catch (eror) {
            res.status(400).send({ status: "Error", message: "Ha ocurrido un error al obtener el carrito!" });
        }
    };

    async addToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const result = await this.cartServices.addToCart(cid, pid);
            res.send(result)
        } catch (error) {
            res.status(400).send({ status: "Error", message: "Ha ocurrido un error al agregar el producto al carrito!" });
        }
    };

    async updateQuantityProductCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity;
            const result = await this.cartServices.updateQuantityProductCart(cid, pid, quantity);
            res.send(result);
        } catch (error) {
            res.status(400).send({ status: "Error", message: "Ha ocurrido un error al agregar el producto al carrito!" });
        }
    };

    async updateCart(req, res) {
        try {
            const cid = req.params.cid;
            const products = req.body.products;
            await this.cartServices.updateCart(cid, products);
            res.send({ status: "ok", message: "El producto se agregó correctamente!" });
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message });
        }
    };

    async deleteProductCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const result = await this.cartServices.deleteProduct(cid, pid);
            res.send(result);
        } catch (error) {
            res.status(400).send({ status: "Error", message: "Ha ocurrido un error al eliminar el producto del carrito!" });
        }
    };

    async deleteProductsCart(req, res) {
        try {
            const cid = req.params.cid;
            const result = await this.cartServices.deleteProductsCart(cid);
            res.send(result);
        } catch (error) {
            res.status(400).send({ status: "Error", message: "Ha ocurrido un error al vaciar el carrito!" });
        }
    };

    async createPurchaseTicket(req, res) {
        console.log(`Ruta /carts/${req.params.cid}/purchase accedida`);
        try {
            if (!req.user || !req.user.id) {
                console.error("req.user no está definido");
                return res.status(400).json({ error: "Usuario no definido" });
            }

            const cart = await this.cartService.getCart(req.params.cid);

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            console.log("Productos en el carrito:", cart.products);

            const productManager = new ProductManager();
            const failedProducts = [];
            const successfulProducts = [];

            for (const item of cart.products) {
                const product = await productManager.getProductById(item.product);

                if (!product) {
                    console.error(`Producto ${item.product} no encontrado`);
                    failedProducts.push(item);
                    continue;
                }

                if (product.stock < item.quantity) {
                    console.error(
                        `Stock insuficiente para el producto ${JSON.stringify(item.product)}`
                    );
                    failedProducts.push(item);
                } else {
                    successfulProducts.push(item);
                    const newStock = product.stock - item.quantity;
                    await productManager.updateProduct(item.product, { stock: newStock });
                }
            }

            await cartModel.updateOne(
                { _id: req.params.cid },
                { products: failedProducts }
            );

            if (successfulProducts.length === 0) {
                return res.status(400).json({
                    error: "No se pudo comprar ningun producto",
                    failedProducts,
                });
            }

            const totalAmount = successfulProducts.reduce((total, product) => {
                return total + product.product.price * product.quantity;
            }, 0);

            const ticketData = {
                purchase_datetime: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
                amount: totalAmount,
                purchaser: req.user.email,
                products: cart.products
            };

            const ticketCreated = await ticketController.createTicket({
                body: ticketData,
            });
            res.json({
                status: "success",
                message: "Compra realizada con éxito",
                ticket: ticketCreated,
                failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
            });
        } catch (error) {
            console.error("Error específico al crear el ticket de compra:", error);
            res.status(500).json({ error: "Error al crear el ticket de compra" });
        }
    };

    async getPurchase(req, res) {
        try {
            const cid = req.params.cid;
            const purchase = await this.cartService.getCart(cid);

            if (purchase) {
                res.json({ status: "success", data: purchase });
            } else {
                res
                    .status(404)
                    .json({ status: "error", message: "Compra no encontrada" });
            }
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ status: "error", message: "Error interno del servidor" });
        }
    };

}

export default new cartsController();