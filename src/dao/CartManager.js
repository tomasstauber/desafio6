import { cartModel } from "./models/cart.model.js";

class cartManager {

    async newCart() {
        await cartModel.create({ products: [] });
        console.log("Carrito creado correctamente!");
        return true;
    }

    async getCart(id) {
        if (this.validateId(id)) {
            return await cartModel.findOne({ _id: id }).lean() || null;
        } else {
            console.log("No se encontró nigún carrito con este Id!");
            return null;
        }
    }

    async getCarts() {
        return await cartModel.find().lean();
    }
    async addToCart(cid, pid) {
        try {
            if (await cartModel.exists({ _id: cid, products: { $elemMatch: { product: pid } } })) {
                await cartModel.updateOne({ _id: cid, products: { $elemMatch: { product: pid } } }, { $inc: { "products.$.quantity": 1 } }, { new: true, upsert: true });
            } else {
                await cartModel.updateOne({ _id: cid }, { $push: { products: { "product": pid, "quantity": 1 } } }, { new: true, upsert: true });
            }
            console.log("Producto agregado al carrito!");
            return true;
        } catch (error) {
            console.log("Ningún producto coincide con ese Id!");
            return false;
        }
    }

    async updateQuantityProductCart(cid, pid, quantity) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);
                const product = cart.products.find(item => item.product === pid);
                product.quantity = quantity;

                await cartModel.updateOne({ _id: cid }, { products: cart.products });
                console.log("Producto actualizado correctamente!");

                return true;
            } else {
                console.log("Ningún producto coincide con ese Id!");

                return false;
            }
        } catch (error) {
            return false
        }
    }

    async updateProducts(cid, products) {
        try {
            await cartModel.updateOne({ _id: cid }, { products: products }, { new: true, upsert: true });
            console.log("Producto actualizado correctamente!");

            return true;
        } catch (error) {
            console.log("No se encontró ningún producto con ese Id!");

            return false;
        }
    }

    async deleteProductCart(cid, pid) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);
                const products = cart.products.filter(item => item.product !== pid);
                await cartModel.updateOne({ _id: cid }, { products: products });
                console.log("Producto eliminado del carrito!");
                return true;
            } else {
                console.log("No existe un producto con ese Id!");
                return false;
            }
        } catch (error) {
            console.log("Ha ocurrido un error al eliminar el producto del carrito!");
            return false;
        }
    }

    async deleteProductsCart(cid) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);

                await cartModel.updateOne({ _id: cid }, { products: [] });
                console.log("Productos eliminados correctamente!");

                return true;
            } else {
                console.log("No existe ningún p4roducto con ese Id!");

                return false;
            }
        } catch (error) {
            return false
        }
    }

    validateId(id) {
        return id.length === 24 ? true : false;
    }
}

export default cartManager;