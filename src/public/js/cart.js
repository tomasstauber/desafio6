const createCart = async () => {
    try {
        if (localStorage.getItem("cart")) {
            return JSON.parse(localStorage.getItem("cart"));
        } else {
            const response = await fetch("/api/carts/", {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            const data = await response.json();
            localStorage.setItem("cart", JSON.stringify({ id: data.id }));
            return { id: data.id };
        }
    } catch (error) {
        console.log("Ha ocurrido un error al crear el carrito! " + error);
    }
    /*   try {
          if (!localStorage.getItem("cart")) {
              const response = await fetch("/api/carts/", {
                  method: "POST",
                  headers: { "Content-type": "application/json; charset=UTF-8" }
              });
              const data = await response.json();
              localStorage.setItem("cart", JSON.stringify(data));
          }
      } catch (error) {
          console.log("Ha ocurrido un error al crear el cart! " + error);
      } */
};

const getCartId = async () => {
    try {
        let cart = await createCart();
        console.log("Carrito:", cart);
        return cart.id;
    } catch (error) {
        console.log("No se pudo obtener el Id! " + error);
    }
};

const addToCart = async (pid) => {
    try {
        let cid = await getCartId();
        const response = await fetch("/api/carts/" + cid + "/products/" + pid, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Producto agregado al carrito!", data);
        } else {
            console.log("Ha ocurrido un error al agregar al carrito!", response.status, data);
        }
    } catch (error) {
        console.log("Ha ocurrido un error al agregar al carrito! " + error);
    }
};