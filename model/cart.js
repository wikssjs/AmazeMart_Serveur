import connectionPromise from "./connexion.js";

export const getCartModel = async () =>{
    let connection  = await connectionPromise;
    let results = await connection.all(`SELECT * FROM Products p INNER JOIN 
                                        cart c ON p.id = c.productId`);
    return results;
}

export const getCartProductById = async (id) => {
    let connection = await connectionPromise;
    let result = await connection.get(
      `SELECT c.quantity as cart_quantity, p.quantity as product_quantity FROM cart c 
      Inner Join Products p ON p.id = productId
      WHERE productId = ?`,
      id
    );
    return result;
  };

export const deleteCartProduct = async (id) =>{
    console.log(id);
    let connection  = await connectionPromise;
    await connection.run("DELETE FROM cart WHERE productId = ?",id);
    let result = await connection.all(`SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId`);

    return result;
}

export const incrementCartModel = async (id) =>{
    let connection  = await connectionPromise;
    await connection.run("UPDATE cart SET quantity = quantity + 1 WHERE productId = ?",id);

    let result = await connection.all(`SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId`);
    return result;
}

export const decrementCartModel = async (id) =>{
    let connection  = await connectionPromise;
    await connection.run("UPDATE cart SET quantity = quantity - 1 WHERE productId = ?",id);

    let result = await connection.all(`SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId`);
    return result;
}

export const getSubTotal = async () =>{
    let connection  = await connectionPromise;
    let result = await connection.get(`SELECT SUM(CAST(SUBSTR(p.price, 2) AS DECIMAL) * c.quantity ) as subTotal 
                                            FROM Products p 
                                            INNER JOIN cart c 
                                            ON p.id = c.productId;
                                            `);
    return result;
}

export const verifyCouponModel = async (coupon) =>{
    let connection  = await connectionPromise;
    let result = await connection.get(`SELECT * FROM coupons WHERE code = ?`,coupon);
    return result;
}