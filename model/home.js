import connectionPromise from "./connexion.js";

export const getProducts = async (userId) => {
  let connection = await connectionPromise;

  let results = await connection.all(`SELECT 
  p.id,
  p.name,
  p.price,
  p.description,
  p.image,
  p.category,
  p.quantity,
  fp.product_id,
  AVG(r.rating) as average_rating,
  COUNT(r.rating) as review_count
FROM 
  products p 
left JOIN 
  reviews r 
ON 
  p.id = r.product_id
  left join 
  favorite_products fp 
  ON
  fp.product_id = p.id
  and fp.user_id=?
GROUP BY 
  p.id,
  p.name,
  p.price,
  p.description,
  p.image,
  p.category,
  p.quantity;
`,userId);
  return results;
};

export const getProduct = async (id) => {
  let connection = await connectionPromise;

  let result = await connection.get("SELECT * FROM products WHERE id = ?", id);

  return result;
};

export const addToCartModel = async (id, quantity,userId) => {
  let connection = await connectionPromise;
  try {
    let result = await connection.run(
      "INSERT INTO cart (productId,quantity,user_id) VALUES (?,?,?)",
      id,
      quantity,
      userId
    );
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      await connection.run(
        "UPDATE cart SET quantity = quantity + ? WHERE productId = ? and user_id = ?",
        quantity,
        id,
        userId
      );
    } else {
      throw e;
    }
  }
  let results = await connection.all(`SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId`);

    return results;
};

export const getReviews = async (id) => {
  let connection = await connectionPromise;

  let results = await connection.all(
    "SELECT * FROM reviews WHERE product_id = ?",
    id
  );
  return results;
};

export const addTofavoriteModel = async (id,userId) => {
  let connection = await connectionPromise;
  try{

    let result = await connection.run(
      "INSERT INTO favorite_products (product_id,user_id) VALUES (?,?)",
      id,
      userId
    );
  }
  catch(e){
    if(e.code === "SQLITE_CONSTRAINT"){
      await connection.run(
        "DELETE FROM favorite_products WHERE product_id = ? and user_id = ?",
        id,
        userId
      );
    }
  }
}
