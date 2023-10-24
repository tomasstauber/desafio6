import { cartModel } from "./models/cart.model.js";
import mongoose from "mongoose";

class cartManager {

    async newCart() {
        let cart = await cartModel.create({ products: [] });
        return { status: "Ok", message: "Carrito creado correctamente!", id: cart._id };
    }

    async getCart(id) {
        return (await cartModel.findOne({ _id: id }).lean()) || null;
    }

    async getCarts() {
        return await cartModel.find().lean();
    }
    async addToCart(cid, pid) {
        try {
            if (mongoose.Types.ObjectId.isValid(cid) && mongoose.Types.ObjectId.isValid(pid)) {
                const result = await cartModel.updateOne(
                    { _id: cid, "products.product": pid },
                    { $inc: { "products.$.quantity": 1 } }
                );
                console.log(result);
                if (result.matchedCount === 0) {
                    const result = await cartModel.updateOne(
                        { _id: cid },
                        { $push: { products: { product: pid, quantity: 1 } } }
                    );
                    console.log(result);
                }
                return { status: "Ok", message: "Producto agregado correctamente!" };
            } else {
                return { status: "Error", message: "Ningún producto coincide con ese Id!" };
            }
        } catch (error) {
            console.log(error);
            return { status: "Error", message: "Ha ocurrido un error al agregar el producto!" };
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
            return { status: "Error", message: "Ha ocurrido un error al agregar al carrtio!" };
        }
    }

    /*     async updateProducts(cid, products) {
            try {
                await cartModel.updateOne({ _id: cid }, { products: products }, { new: true, upsert: true });
                console.log("Producto actualizado correctamente!");
    
                return true;
            } catch (error) {
                console.log("No se encontró ningún producto con ese Id!");
    
                return false;
            }
        } */

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