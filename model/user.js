import connectionPromise from "./connexion.js";

export const registerUserModel = async (username, email, password) => {
    let connection = await connectionPromise;
    console.log(username, email, password);
    await connection.run(
        "INSERT INTO users (username,email,password) VALUES (?,?,?)",
        username,
        email,
        password
    );
    }
    
    export const getUserByEmailModel = async (email) => {
        let connection = await connectionPromise;
        let result = await connection.get(
            "SELECT * FROM users WHERE email = ?",
            email
        );
        return result;
    }

    export const getUserByUsernameModel = async (username) => {
        let connection = await connectionPromise;
        let result = await connection.get(
            "SELECT * FROM users WHERE username = ?",
            username
        );
        return result;
    }
