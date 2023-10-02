import { productModel } from "./models/product.model.js";

class ProductManager {

    async addProduct(product) {
        try {
            if (await this.validateCode(product.code)) {
                console.log("Error! Ya existe un producto con este código!");
                return false
            } else {
                await productModel.create(product);
                console.log("Producto agregado correctamente!");
                return true;
            }
        } catch (error) {
            console.log("Se ha producido un error al agregar el producto!");
            return false;
        }
    }

    async updateProduct(id, product) {
        try {
            if (this.validateId(id)) {
                if (await this.getProductById(id)) {
                    await productModel.updateOne({ _id: id }, product);
                    console.log("Producto actualizado correctamente!");
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log("Se ha producido un error al actualizar el producto!");
            return false;
        }
    }

    async deleteProduct(id) {
        try {
            if (this.validateId(id)) {
                if (await this.getProductById(id)) {
                    await productModel.deleteOne({ _id: id });
                    console.log("Producto eliminado correctamente!");
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log("No se encontró ningún producto con este Id!");
            return false;
        }
    }

    async getProducts(params) {
        let { limit, page, query, sort } = params;
        limit = limit ? limit : 10;
        page = page ? page : 1;
        query = query || {};
        sort = sort ? sort == "asc" ? 1 : -1 : 0;

        let products = await productModel.paginate(query, { limit: limit, page: page, sort: { price: sort } });

        let status = products ? "succes" : "error";

        let prevLink = products.hasPrevPage ? "hhtp://localhost:8080/api/products?limit=" + limit + "&page=" + products.prevPage : null;
        let nextLink = products.hasNextPage ? "hhtp://localhost:8080/api/products?limit=" + limit + "&page=" + products.nextPage : null;


        products = { status: status, payload: products.docs, prevPage: products.prevPage, nextPage: products.nextPage, page: products.page, hasPrevPage: products.hasPrevPage, hasNextPage: products.hasNextPage, prevLink: prevLink, nextLink: nextLink };

        return products;
    }

    async getProductById(id) {
        if (this.validateId(id)) {
            return await productModel.findOne({ _id: id }).lean() || null;
        } else {
            console.log("No se encontró ningún producto con este Id!");
            return null;
        }
    }

    async validateCode(code) {
        return await productModel.findOne({ code: code }) || false;
    }

    validateId(id) {
        return id.length === 24 ? true : false;
    }

}

export default ProductManager;