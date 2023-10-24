import { productModel } from "./models/product.model.js";

class ProductManager {

    async addProduct(product) {
        try {
            if (await this.validateCode(product.code)) {
                console.log("Error! Ya existe un producto con este código!");
                return false
            } else {
                const product = {
                    title: product.title,
                    description: product.description,
                    code: product.code,
                    price: product.price,
                    status: product.status,
                    stock: product.stock,
                    category: product.category,
                    thumbnail: product.thumbnail
                };
                const productCreated = await productModel.create(product);
                console.log("Producto agregado correctamente!");
                return productCreated;
            }
        } catch (error) {
            console.log("Se ha producido un error al agregar el producto!", error);
            return false;
        }
    };

    async updateProduct(id, product) {
        try {
            const productUpdated = await productModel.findByIdAndUpdate(id, product, { new: true });
            if (productUpdated) {
                console.log("Producto actualizado correctamente!");
                return true;
            } else {
                console.log("Ningún producto coincide con la búsqueda!");
                return false;
            }
        } catch (error) {
            console.log("Ha ocurrido un error al actualizar el producto!", error);
            return false;
        }
    };

    async deleteProduct(id) {
        try {
            const productDeleted = await productModel.findByIdAndDelete(id);
            if (productDeleted) {
                console.log("Producto eliminado correctamente!");
                return true;
            } else {
                console.log("Ningún producto coincide con la búsqueda!");
                return false;
            }
        } catch (error) {
            console.log("Ha ocurrido un error al eliminar el producto!", error);
            return false;
        }
    };

    async getProducts(params = {}) {
        let { limit = 10, page = 1, query = {}, sort = {} } = params;
        sort = sort ? sort == "asc" ? 1 : -1 : 0;

        try {
            let products = await productModel.paginate(query, { limit: limit, page: page, sort: { price: sort }, lean: true });
            let status = products ? "succes" : "error";

            let prevLink = products.hasPrevPage ? "hhtp://localhost:8080/api/products?limit=" + limit + "&page=" + products.prevPage : null;
            let nextLink = products.hasNextPage ? "hhtp://localhost:8080/api/products?limit=" + limit + "&page=" + products.nextPage : null;

            products = { status: status, payload: products.docs, prevPage: products.prevPage, nextPage: products.nextPage, page: products.page, hasPrevPage: products.hasPrevPage, hasNextPage: products.hasNextPage, prevLink: prevLink, nextLink: nextLink };
            return products;
        } catch (error) {
            console.log("Ha ocurrido un error al obtener los productos!", error);
            return { status: "Error", payload: [] };
        }
    };

    async getProductById(id) {
        try {
            return await productModel.findById(id).lean();
        } catch (error) {
            console.log("Ha ocurrido un error al obtener el producto!", error);
            return null;
        }
    };

    async validateCode(code) {
        try {
            return await productModel.exists({ code: code })
        } catch (error) {
            console.log("Ha ocurrido un error al validar el código!", error);
            return false;
        }
    };
}

export default ProductManager;