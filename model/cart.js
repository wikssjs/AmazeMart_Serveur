import connectionPromise from "./connexion.js";

export const getCartModel = async (userId) =>{
    console.log(userId);
    let connection  = await connectionPromise;
    let results = await connection.all(`SELECT * FROM Products p INNER JOIN 
                                        cart c ON p.id = c.productId where c.user_id = ?`,userId);
    return results;
}

export const getCartProductById = async (id) => {
    let connection = await connectionPromise;
    console.log(id);
    let result = await connection.get(
      `SELECT c.quantity as cart_quantity, p.quantity as product_quantity FROM cart c 
      Inner Join Products p ON p.id = productId
      WHERE productId = ?`,
      id
    );
    console.log(result);
    return result;
  };

export const deleteCartProduct = async (id,userId) =>{
    let connection  = await connectionPromise;
    await connection.run("DELETE FROM cart WHERE productId = ? and user_id=?",id,userId);
    let result = await connection.all(`SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId 
                                        where user_id = ?`,userId);


    return result;
}

export const incrementCartModel = async (id,userId) =>{
    let connection  = await connectionPromise;
    await connection.run(`UPDATE cart SET quantity = quantity + 1 
                            WHERE productId = ? and user_id= ?`,id,userId);

    let result = await connection.all(`SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId
                                        where user_id = ?`,userId);
    return result;
}

export const decrementCartModel = async (id,userId) =>{
    let connection  = await connectionPromise;
    await connection.run(`UPDATE cart SET quantity = quantity - 1 
                            WHERE productId = ? and user_id = ?`,id,userId);

    let result = await connection.all(`SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId
                                        where user_id = ?`,userId);
    return result;
}

export const getSubTotal = async (userId) =>{
    let connection  = await connectionPromise;
    console.log(userId);
    let result = await connection.get(`SELECT SUM(CAST(SUBSTR(p.price, 2) AS DECIMAL) * c.quantity ) as subTotal 
                                            FROM Products p 
                                            INNER JOIN cart c 
                                            ON p.id = c.productId
                                            where user_id = ?`,userId);
                                            ;
                                          
    return result;
}

export const verifyCouponModel = async (coupon) =>{
    let connection  = await connectionPromise;
    let result = await connection.get(`SELECT * FROM coupons WHERE code = ?`,coupon);
    return result;
}
