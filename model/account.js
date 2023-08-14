import connectionPromise from "./connexion.js";

export const getUserProfileModel = async (id) => {
    let connection = await connectionPromise;
    let results = await connection.get(
        `SELECT * FROM users WHERE id = ?`,
        id
    );
    return results;
};


export const getFavoritesProductsModel = async (id) => {
    let connection = await connectionPromise;
    let results = await connection.all(
        `SELECT * FROM products WHERE id IN (SELECT product_id FROM favorite_products WHERE user_id = ?)`,
        id
    );
    console.log(results);
    return results;
}

export const deleteFavoriteProductModel = async (productId,userId) => {
    let connection = await connectionPromise;
    await connection.run(
        `DELETE FROM favorite_products WHERE product_id = ? AND user_id = ?`,
        productId,
        userId
    );

    const results = await connection.all(
        `SELECT * FROM products WHERE id IN (SELECT product_id FROM favorite_products WHERE user_id = ?)`,
        userId
    );
    
    return results;
}

export const getCreditCardModel = async (userId) => {
    let connection = await connectionPromise;
    let results = await connection.get(
        `SELECT * FROM cards WHERE user_id = ?`,
        userId
    );
    return results;
};

export const addCreditCardModel = async (cardType, cardHolderName, cardNumber, expirationDate, cvv, userId) => {
    let connection = await connectionPromise;
  
    try {
      await connection.run(
        `INSERT INTO cards (cardType, cardHolderName, cardNumber, expirationDate, cvv, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
        cardType,
        cardHolderName,
        cardNumber,
        expirationDate,
        cvv,
        userId
      );
    } catch (error) {
      console.log(error);
      // You can check error.message or error.code depending on your database
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') { // This code may vary based on your DB
        return Promise.reject('Unique Constraint Violation');
      } else {
        return Promise.reject(error);
      }
    }
  };
  

  export const deleteCreditCardModel = async (userId) => {
    let connection = await connectionPromise;
    await connection.run(
        `DELETE FROM cards WHERE user_id = ?`,
        userId
    );
  }

  export const updateCreditCardModel = async (cardType, cardHolderName, cardNumber, expirationDate, cvv, userId) => {
    let connection = await connectionPromise;
    await connection.run(
        `UPDATE cards SET cardType = ?, cardHolderName = ?, cardNumber = ?, expirationDate = ?, cvv = ? WHERE user_id = ?`,
        cardType,
        cardHolderName,
        cardNumber,
        expirationDate,
        cvv,
        userId
    );
  }