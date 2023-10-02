const createCart = async () => {
    try {
        if (!localStorage.getItem("cart")) {
            const response = await fetch("/api/carts/", {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            const data = await response.json();
            localStorage.setItem("cart", JSON.stringify(data));
        }
    } catch (error) {
        console.log("Ha ocurrido un error al crear el carrito! " + error);
    }
};

createCart();