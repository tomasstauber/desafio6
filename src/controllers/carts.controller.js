import cartServices from "../services/carts.services.js";

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

}

export default new cartsController();