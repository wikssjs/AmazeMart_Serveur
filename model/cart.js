import connectionPromise from "./connexion.js";

export const getCartModel = async (userId) => {
  let connection = await connectionPromise;
  console.log(userId);
  let results = await connection.all(
    `SELECT * FROM Products p INNER JOIN 
                                        cart c ON p.id = c.productId where c.user_id = ?`,
    userId
  );

  return results;
};

export const getUserAdressModel = async (userId) => {
  let connection = await connectionPromise;
  let result = await connection.get(
    `SELECT * FROM Adresses 
    Join Users ON Users.id = Adresses.user_id
    WHERE user_id = ?`,
    userId
  );
  return result;
};


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

export const deleteCartProduct = async (id, userId) => {
  let connection = await connectionPromise;
  await connection.run(
    "DELETE FROM cart WHERE productId = ? and user_id=?",
    id,
    userId
  );
  let result = await connection.all(
    `SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId 
                                        where user_id = ?`,
    userId
  );

  return result;
};

export const incrementCartModel = async (id, userId) => {
  let connection = await connectionPromise;
  await connection.run(
    `UPDATE cart SET quantity = quantity + 1 
                            WHERE productId = ? and user_id= ?`,
    id,
    userId
  );

  let result = await connection.all(
    `SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId
                                        where user_id = ?`,
    userId
  );
  return result;
};

export const decrementCartModel = async (id, userId) => {
  let connection = await connectionPromise;
  await connection.run(
    `UPDATE cart SET quantity = quantity - 1 
                            WHERE productId = ? and user_id = ?`,
    id,
    userId
  );

  let result = await connection.all(
    `SELECT * FROM Products p INNER JOIN
                                        cart c ON p.id = c.productId
                                        where user_id = ?`,
    userId
  );
  return result;
};

export const getSubTotal = async (userId) => {
  let connection = await connectionPromise;
  let result = await connection.get(
    `SELECT SUM(CAST(SUBSTR(p.price, 2) AS DECIMAL) * c.quantity ) as subTotal 
                                            FROM Products p 
                                            INNER JOIN cart c 
                                            ON p.id = c.productId
                                            where user_id = ?`,
    userId
  );
  return result;
};

export const verifyCouponModel = async (coupon) => {
  let connection = await connectionPromise;
  let result = await connection.get(
    `SELECT * FROM coupons WHERE code = ?`,
    coupon
  );
  return result;
};

export const addToCheckoutModel = async (userId, userInformation, products) => {
    try {
      let connection = await connectionPromise;
      const { email, cardHolderName, cardNumber, expirationDate, cvv } = userInformation;
      const orderDate = new Date().toISOString(); // Get the current date in ISO format
  
      // Begin a transaction to ensure all inserts succeed or fail together
      await connection.run('BEGIN TRANSACTION');
  
      // Insert user-specific information and order date into the checkout table
      const result = await connection.run(`
        INSERT INTO checkout (user_id, email, cardHolderName, cardNumber, expirationDate, cvv, order_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, userId, email, cardHolderName, cardNumber, expirationDate, cvv, orderDate);
  
      const checkoutId = result.lastID; // Get the last inserted row ID (checkout ID)
  
      // Loop through the products and insert each one into the checkout_products table
      for (const product of products) {
        const { productId, quantity } = product;
        await connection.run(`
          INSERT INTO checkout_products (checkout_id, product_id, quantity)
          VALUES (?, ?, ?)
        `, checkoutId, productId, quantity);
      }
  
      // Commit the transaction since all inserts succeeded
      await connection.run('COMMIT');
      await connection.run('DELETE FROM cart WHERE user_id = ?', userId);
  
      return { success: true, message: 'Checkout completed successfully!' };
    } catch (error) {
      // Rollback the transaction in case of an error
      connection.run('ROLLBACK');
      console.error('Error adding to checkout:', error);
      return { success: false, message: 'Failed to add to checkout. Please try again later.' };
    }
  };
  

export const getCheckoutProductsModel = async (userId) => {
  let connection = await connectionPromise;
  let results = await connection.all(
    `
    SELECT
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
  checkout.user_id = ?;`, userId);


  console.log(results);
  return results;
};
