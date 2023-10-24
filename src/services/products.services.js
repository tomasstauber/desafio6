import ProductManager from "../dao/ProductManager.js";

class productsServices {
    constructor() {
        this.ProductManager = new ProductManager(); 
    }

    async addProduct(product) {
        if (await this.ProductManager.validateCode(product.code)) {
            console.log("Ya existe un producto con este código!");
            return null
        }
        return await this.ProductManager.addProduct(product);
    };

    async updateProduct(id, product) {
        return await this.ProductManager.updateProduct(id, product);
    };

    async deleteProduct(id) {
        return await this.ProductManager.deleteProduct(id);
    };

    async getProducts(params) {
        return await this.ProductManager.getProducts(params)    
    };

    async getProductById(id) {
        return await this.ProductManager.getProductById(id);
    };
}

export default productsServices;