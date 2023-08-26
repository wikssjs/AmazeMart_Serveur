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

export const addToCartModel = async (id, quantity, userId) => {
  let connection = await connectionPromise;
  console.log(id, quantity, userId);
  
  try {
    // Check if the product already exists in the cart
    let existingProduct = await connection.get(
      "SELECT * FROM cart WHERE productId = ? AND user_id = ?",
      id,
      userId
    );

    if (existingProduct) {
      // If the product exists, update the quantity
      await connection.run(
        "UPDATE cart SET quantity = quantity + ? WHERE productId = ? AND user_id = ?",
        quantity,
        id,
        userId
      );
    } else {
      // If the product doesn't exist, insert a new row
      await connection.run(
        "INSERT INTO cart (productId, quantity, user_id) VALUES (?, ?, ?)",
        id,
        quantity,
        userId
      );
    }
  } catch (e) {
    throw e;
  }

  // Fetch the updated cart data
  let results = await connection.all(
    `SELECT * FROM Products p INNER JOIN cart c ON p.id = c.productId WHERE c.user_id = ?`,
    userId
  );

  return results;
};


export const getReviews = async (id) => {
  let connection = await connectionPromise;

  let results = await connection.all(
  `SELECT r.*,p.name FROM reviews r
  INNER JOIN products p ON p.id = r.product_id
  WHERE product_id = ?`,
    id
  );
  return results;
};

export const addTofavoriteModel = async (id,userId) => {
  let connection = await connectionPromise;
  try{

    await connection.run(
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
  let result = await connection.get(
    `SELECT 
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
    where p.id =?

  GROUP BY 
    p.id,
    p.name,
    p.price,
    p.description,
    p.image,
    p.category,
    p.quantity;`,
    userId
    ,id
  );
  return result;
}
