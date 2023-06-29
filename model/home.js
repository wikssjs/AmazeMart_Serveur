import connectionPromise from "./connexion.js";

export const getProducts = async () => {
  let connection = await connectionPromise;

  let results = await connection.all(`SELECT 
    p.id,
    p.name,
    p.price,
    p.description,
    p.image,
    p.category,
    p.quantity,
    AVG(r.rating) as average_rating,
    COUNT(r.rating) as review_count
FROM 
    products p 
left JOIN 
    reviews r 
ON 
    p.id = r.product_id
GROUP BY 
    p.id,
    p.name,
    p.price,
    p.description,
    p.image,
    p.category,
    p.quantity;
`);
  return results;
};

export const getProduct = async (id) => {
  let connection = await connectionPromise;

  let result = await connection.get("SELECT * FROM products WHERE id = ?", id);

  return result;
};

export const addToCartModel = async (id, quantity) => {
  let connection = await connectionPromise;
  console.log(id, quantity);
  try {
    let result = await connection.run(
      "INSERT INTO cart (productId,quantity) VALUES (?,?)",
      id,
      quantity
    );
    console.log(result);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      await connection.run(
        "UPDATE cart SET quantity = quantity + ? WHERE productId = ?",
        quantity,
        id
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
