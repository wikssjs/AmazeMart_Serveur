import connectionPromise from "./connexion.js";

export const getProducts = async () =>{

    let connection  = await connectionPromise;

    let results = await connection.all("SELECT * FROM products");
    return results;
}

export const getProduct = async (id) =>{
    let connection  = await connectionPromise;

    let result = await connection.get("SELECT * FROM products WHERE id = ?",id);

    return  result;
}

export const addToCartModel = async (id,quantity) =>{
    let connection  = await connectionPromise;
    console.log(id,quantity);
    try{
        let result = await connection.run("INSERT INTO cart (productId,quantity) VALUES (?,?)",id,quantity);
        console.log(result);
    }catch(e){
        if(e.code === 'SQLITE_CONSTRAINT'){
            await connection.run("UPDATE cart SET quantity = quantity + ? WHERE productId = ?",quantity,id);
        }else{
            throw e;
        }
    }
    // let result = await connection.run("INSERT INTO cart (productId,quantity) VALUES (?,?)",id,quantity);
}