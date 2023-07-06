import connectionPromise from "./connexion.js";

export const getSearchProductsModel = async (search) => {
  let connection = await connectionPromise;
  let results = await connection.all(
    `SELECT * FROM Products Where name LIKE '%${search}%'`
  );
  return results;
};
