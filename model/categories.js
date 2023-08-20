import connectionPromise from "./connexion.js";

export const getCategoriesModel = async () => {
  let connection = await connectionPromise;
  let results = await connection.all(`SELECT DISTINCT category FROM Products`);
  return results;
};
export const getProductsByCategoryModel = async (category) => {
  let connection = await connectionPromise;
  console.log(category);
  let results = await connection.all(
    `select p.id,
    p.name,
    p.price,
    p.description,
    p.image,
    p.category,
    p.quantity,
    f.product_id,
    AVG(r.rating) as average_rating,
    COUNT(r.rating) as review_count
FROM 
    products p 
left JOIN 
    reviews r 
ON 
p.id = r.product_id
left JOIN favorite_products f
ON
p.id = f.product_id
where category = ?
GROUP BY 
p.id,
p.name,
p.price,
p.description,
p.image,
p.category,
p.quantity
`,
    category
  );
  return results;
};
