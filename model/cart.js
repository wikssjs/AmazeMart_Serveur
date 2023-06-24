import connectionPromise from "./connexion.js";

export const getCartModel = async () =>{
    let connection  = await connectionPromise;
    let results = await connection.all(`SELECT * FROM Products p INNER JOIN 
                                        cart c ON p.id = c.productId`);
    return await results;
}