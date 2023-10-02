import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.send({products})
});

productsRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const products = await PM.getProductById(pid);
    res.send({products});
});

productsRouter.post("/", async (req, res) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Title!"});
        return false;
    }

    if (!description) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Description!"});
        return false;
    }

    if (!code) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Code!"});
        return false;
    }

    if (!price) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Price!"});
        return false;
    }

    status = !status && true;

    if (!stock) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Stock!"});
        return false;
    }

    if (!category) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Category!"});
        return false;
    }

    if (!thumbnails) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Thumbnails!"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"Atención! Debe agregar al menos una imagen!"});
        return false;
    }

    const resultado = await PM.addProduct({title, description, code, price, status, stock, category, thumbnails});

    if (resultado) {
        res.send({status:"OK", message:"Producto agregado correctamente!"})
    } else {
        res.status(500).send({status:"error", message:"Error! Hubo un problema al cargar el producto!"});
    }
});

productsRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title) {
        res.status(400).send({status:"error", message:"EAtención! Debe completar el campo Title!"});
        return false;
    }

    if (!description) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Description!"});
        return false;
    }

    if (!code) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Code!"});
        return false;
    }

    if (!price) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Price!"});
        return false;
    }

    status = !status && true;

    if (!stock) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Stock!"});
        return false;
    }

    if (!category) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Category!"});
        return false;
    }

    if (!thumbnails) {
        res.status(400).send({status:"error", message:"Atención! Debe completar el campo Thumbnails!"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"Atención! Debe agregar al menos una imagen!"});
        return false;
    }

    const resultado = await PM.updateProduct(pid, {title, description, code, price, status, stock, category, thumbnails});

    if (resultado) {
        res.send({status:"OK", message:"Producto actualizado correctamente!"})
    } else {
        res.status(500).send({status:"error", message:"Error! Hubo un problema al actualizar el producto!"});
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const resultado = await PM.deleteProduct(pid);

    if (resultado) {
        res.send({status:"OK", message:"Producto eliminado correctamente!"})
    } else {
        res.status(500).send({status:"error", message:"Error! Hubo un problema al eliminar el producto!"});
    }
});

export default productsRouter;