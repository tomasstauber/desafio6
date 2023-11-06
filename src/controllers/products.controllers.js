import productsServices from "../services/products.services.js";

class productsController {
    constructor() {
        this.productsServices = new productsServices();
    }

    async getProducts(req, res) {
        try {
            const products = await this.productsServices.getProducts(req.query);
            res.send(products);
        } catch (error) {
            res.status(500).send({ status: "Error", message: "Ha ocurrido un error al obtener los productos!" });
            console.log(error);
        }
    }

    async getProductById(req, res) {
        try {
            const pid = req.params.pid;
            const product = await this.productsServices.getProductById(pid);
            if (product) {
                res.json(product);
                return;
            } else {
                res.status(404).send({ status: "Error", message: "Ningún producto coincide con ese Id!" });
                return;
            }
        } catch (error) {
            res.status(500).send({ status: "Error", message: "Ha ocurrido un error al obtener el producto!" });
            console.log(error);
            return;
        }
    }

    async addProduct(req, res) {
        let { title, description, code, price, status, stock, category, thumbnails } = req.body;

        if (!title) {
            res.status(400).send({ status: "error", message: "Atención! Debe completar el campo Title!" });
            return false;
        }

        if (!description) {
            res.status(400).send({ status: "error", message: "Atención! Debe completar el campo Description!" });
            return false;
        }

        if (!code) {
            res.status(400).send({ status: "error", message: "Atención! Debe completar el campo Code!" });
            return false;
        }

        if (!price) {
            res.status(400).send({ status: "error", message: "Atención! Debe completar el campo Price!" });
            return false;
        }

        status = !status && true;

        if (!stock) {
            res.status(400).send({ status: "error", message: "Atención! Debe completar el campo Stock!" });
            return false;
        }

        if (!category) {
            res.status(400).send({ status: "error", message: "Atención! Debe completar el campo Category!" });
            return false;
        }

        if (!thumbnails) {
            res.status(400).send({ status: "error", message: "Atención! Debe completar el campo Thumbnails!" });
            return false;
        }
        try {
            const addProduct = await this.productsServices.addProduct({ title, description, code, price, status, stock, category, thumbnails });
            if (addProduct && addProduct._id) {
                console.log("Producto agregado correctamente!", addProduct);
                res.send({ status: "Ok", message: "Producto agregado correctamente!" });
                socketServer.emit("addProduct", { _id: addProduct._id, title, description, stock, thumbnails, category, price, code });
                return;
            } else {
                console.log("Ha ocurrido un error al agregar el producto!");
                res.status(500).send({ status: "Error", message: "Ha ocurrido un error al agregar el producto!" });
                return;
            }
        } catch (error) {
            console.log("Ha ocurrido un error al agregar el producto!", error);
            res.status(500).send({ status: "Error", message: "Internal Server Error" });
            return;
        }
    }

    async deleteProduct(req, res) {
        try {
            const pid = req.params.pid;
            const deleteProduct = await this.productsServices.deleteProduct(pid);
            if (deleteProduct) {
                console.log("Producto eliminado correctamente!");
                res.send({ status: "Ok", message: "Producto eliminado correctamente!" });
                socketServer.emit("deleteProduct", { _id: pid });
                return true;
            } else {
                res.status(500).send({ status: "Error", message: "Ha ocurrido un error al eliminar el producto!" });
            }
        } catch (error) {
            res.status(500).send({ status: "Error", message: "Internal Server Error" });
        }
    }

    async updateProduct(req, res) {
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;
            const pid = req.params.pid;
            const updateProduct = await this.productsServices.updateProduct(pid, {
                title, description, code, price, status, stock, category, thumbnails
            });
            if (updateProduct) {
                res.send({ status: "Ok", message: "Producto actualizado correctamente!" });
            } else {
                res.status(500).send({ status: "Error", message: "Ha ocurrido un error al actualizar el producto!" });
            }
        } catch (error) {
            res.status(500).send({ status: "Error", message: "Internal Server Error" });
            console.log(error);
        }
    }
}

export default new productsController();