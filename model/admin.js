import connectionPromise from "./connexion.js";

export const getAllUsersModel = async () => {
  let connection = await connectionPromise;
  let results = await connection.all(`SELECT * FROM Users`);
  return results;
};

export const getUserByIdModel = async (id) => {
  let connection = await connectionPromise;
  let results = await connection.get(
    `SELECT 
    u.id AS user_id,
    u.email,
    u.fullname,
    -- Format the membersince date
    CASE strftime('%m', u.member_since)
        WHEN '01' THEN 'January'
        WHEN '02' THEN 'February'
        WHEN '03' THEN 'March'
        WHEN '04' THEN 'April'
        WHEN '05' THEN 'May'
        WHEN '06' THEN 'June'
        WHEN '07' THEN 'July'
        WHEN '08' THEN 'August'
        WHEN '09' THEN 'September'
        WHEN '10' THEN 'October'
        WHEN '11' THEN 'November'
        WHEN '12' THEN 'December'
    END || ' ' || 
    strftime('%d', u.member_since) || ' ' || 
    strftime('%Y', u.member_since) AS member_since,
    
    COALESCE(SUM(cp.total), 0) AS total_checkout_amount,
    COALESCE(SUM(cp.quantity), 0) AS total_items_checked_out
FROM 
    users u
LEFT JOIN 
    checkout co ON u.id = co.user_id
LEFT JOIN 
    checkout_products cp ON co.id = cp.checkout_id
WHERE 
    u.id = ?  -- replace '?' with the specific user_id or bind it in your programming environment
GROUP BY 
    u.id, u.email, u.fullname;


`,
    [id]
  );
  return results;
};

export const getUserCartModel = async (id) => {
  let connection = await connectionPromise;
  let results = await connection.all(`SELECT * FROM Cart WHERE user_id = ?`, [
    id,
  ]);
  return results;
};

export const getUserOrdersModel = async (id) => {
  let connection = await connectionPromise;
  let results = await connection.all(
    `  SELECT
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
    checkout.user_id = ?;`,
    [id]
  );
  return results;
};


export const addProductModel = async (name, price, image, description, category,quantity) => {
  let connection = await connectionPromise;
  await connection.run(
    `INSERT INTO products (name, price, image, description, category,quantity) VALUES (?, ?, ?, ?, ?,?)`,
    name,
    price,
    image,
    description,
    category,
    quantity
  );
}

export const updateProductModel = async (id, name, price, image, description, category,quantity) => {
  let connection = await connectionPromise;
  await connection.run(
    `UPDATE products SET name = ?, price = ?, image = ?, description = ?, category = ?, quantity = ? WHERE id = ?`,
    name,
    price,
    image,
    description,
    category,
    quantity,
    id
  );
}

export const deleteProductModel = async (id) => {
  let connection = await connectionPromise;
  await connection.run(
    `DELETE FROM products WHERE id = ?`,
    id
  );
}



export const getGlobalDashboardDataModel = async () => {
  let connection = await connectionPromise;
  let results = await connection.get(`SELECT
  (SELECT COUNT(*) FROM products) as products_count,
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM checkout c WHERE date(c.order_date) = date('now')) as orders_count,
  (SELECT SUM(cp.total) 
   FROM checkout c
   JOIN checkout_products cp ON c.id = cp.checkout_id
   WHERE date(c.order_date) = date('now')) as total_money_for_today
`);
  return results;
}

export const getMonthlyDataModel = async () => {
  let connection = await connectionPromise;
  let results = await connection.all(`WITH 
  months(month_num, month_name) AS (
      VALUES (1, 'January'),
             (2, 'February'),
             (3, 'March'),
             (4, 'April'),
             (5, 'May'),
             (6, 'June'),
             (7, 'July'),
             (8, 'August'),
             (9, 'September'),
             (10, 'October'),
             (11, 'November'),
             (12, 'December')
  )
  
  SELECT 
      COALESCE(SUM(cp.total), 0) as monthly_total
  FROM months m
  LEFT JOIN checkout c ON strftime('%Y-%m', c.order_date) = strftime('%Y', 'now') || '-' || (CASE WHEN m.month_num < 10 THEN '0' || CAST(m.month_num AS TEXT) ELSE CAST(m.month_num AS TEXT) END)
  LEFT JOIN checkout_products cp ON c.id = cp.checkout_id
  GROUP BY m.month_name, m.month_num
  ORDER BY m.month_num;
`);
  return results;
}


export const getRecentOrdersModel = async () => {
  let connection = await connectionPromise;
  let results = await connection.all(`SELECT
  checkout.id as order_id,
  products.name as product_name,
  products.price,
  checkout_products.quantity,
  checkout.order_date,
  products.image,
  products.id as product_id,
  order_totals.total_order_price,
  users.fullname
FROM
  checkout
INNER JOIN
  checkout_products ON checkout.id = checkout_products.checkout_id
INNER JOIN
  products ON products.id = checkout_products.product_id
INNER JOIN (
  SELECT
    checkout_id,
    SUM(checkout_products.total) as total_order_price  -- Use the total column from checkout_products
  FROM
    checkout_products
  GROUP BY
    checkout_id
) AS order_totals ON checkout.id = order_totals.checkout_id
INNER JOIN users on users.id = checkout.user_id
ORDER BY
  checkout.order_date DESC
LIMIT 5;
`);
  return results;
}


export const updateReviewModel = async (id, comment) => {
  let connection = await connectionPromise;
  await connection.run(
    `UPDATE reviews SET comment = ? WHERE id = ?`,
    comment,
    id
  );
}

export const deleteReviewModel = async (id) => {
  let connection = await connectionPromise;
  await connection.run(
    `DELETE FROM reviews WHERE id = ?`,
    id
  );
}
