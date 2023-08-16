import connectionPromise from "./connexion.js";


export const getAllUsersModel = async () => {
    let connection = await connectionPromise;
    let results = await connection.all(`SELECT * FROM Users`);
    return results;
}



export const getUserByIdModel = async (id) => {
    let connection = await connectionPromise;
    let results = await connection.get(`SELECT * FROM Users WHERE id = ?`, [id]);
    return results;
}


export const getUserCartModel = async (id) => {
    let connection = await connectionPromise;
    let results = await connection.all(`SELECT * FROM Cart WHERE user_id = ?`, [id]);
    return results;
}

export const getUserOrdersModel = async (id) => {
    let connection = await connectionPromise;
    let results = await connection.all(`  SELECT
    checkout.id as order_id,
    products.name as product_name,
    products.price,
    checkout_products.quantity,
    checkout.order_date,
      products.image,
      products.id as product_id,
    order_totals.total_order_price
  FROM
    checkout
  INNER JOIN
    checkout_products ON checkout.id = checkout_products.checkout_id
  INNER JOIN
    products ON products.id = checkout_products.product_id
  INNER JOIN (
    SELECT
      checkout_id,
      SUM(CAST(SUBSTR(products.price, 2) AS DECIMAL) * checkout_products.quantity) as total_order_price
    FROM
      checkout_products
    INNER JOIN
      products ON products.id = checkout_products.product_id
    GROUP BY
      checkout_id
  ) AS order_totals ON checkout.id = order_totals.checkout_id
  WHERE
    checkout.user_id = ?;`, [id]);
    return results;
}