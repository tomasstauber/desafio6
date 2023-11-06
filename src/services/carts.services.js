import cartManager from "../dao/CartManager.js";

class cartServices {
    constructor() {
        this.cartManager = new cartManager();
    }

    async newCart() {
        return await this.cartManager.newCart();
    }

    async getCart(id) {
        return await this.cartManager.getCart(id);
    }

    async addToCart(cid, pid) {
        const result = await this.cartManager.addToCart(cid, pid);
        if (result) {
            return { status: "Ok", message: "Producto agregado correctamente!" };
        } else {
            return { status: "Error", message: "Ha ocurrido un error al agregar el producto!" };
        }
    }

    async updateQuantityProductCart(cid, pid, quantity) {
        const result = await this.cartManager.updateQuantityProductCart(cid, pid, quantity);
        if (result) {
            return { status: "Ok", message: "Producto actualizado correctamente!" };
        } else {
            result.status(400).send({ status: "Error", message: "Ha ocurrido un error al actualizar el producto!" });
        }
        return await this.cartManager.updateQuantityProductCart(cis, pid, quantity);
    }

    async updateCart(cartId, products) {
        const result = await this.cartManager.updateProducts(cartId, products);
        if (result) {
            return { status: "ok", message: "El carrito se actualizó correctamente" };
        } else {
            throw new Error("Error: No se pudo actualizar el carrito");
        }
    }

    async deleteProductCart(cis, pid) {
        const result = await this.cartManager.deleteProductCart(cid, pid);
        if (result) {
            res.send({ status: "Ok", message: "Producto eliminado correctamente!" });
        } else {
            result.status(400).send({ status: "Error", message: "Ha ocurrido un error al eliminar el producto!" });
        }
        return await this.cartManager.deleteProductCart(cid, pid);
    }

    async deleteProductsCart(cid) {
        const result = await this.cartManager.deleteProductsCart(cid);
        if (result) {
            res.send({ status: "Ok", message: "El carrito se vació correctamentente!" });
        } else {
            result.status(400).send({ status: "Error", message: "Ha ocurrido un error al vaciar el carrito!" });
        }
        return await this.cartManager.deleteProductsCart(cid);
    }

}

export default cartServices;