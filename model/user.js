import connectionPromise from "./connexion.js";
import pkg from "bcryptjs";

const { hash, compare } = pkg;
export const registerUserModel = async (fullName, email,phone, password) => {
    let connection = await connectionPromise;
    await connection.run(
        "INSERT INTO users (fullname,email,phone,password) VALUES (?,?,?,?)",
        fullName,
        email,
        phone,
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


export const changeUserInfosModel = async (fullName, email,phone,userId) => {
    let connection = await connectionPromise;
    await connection.run(
        "UPDATE users SET fullname = ?, email = ?, phone = ? WHERE id = ?",
        fullName,
        email,
        phone,
        userId
    );
    }


    export const changeUserPasswordModel = async (currentPassword, newPassword,userId) => {
        let connection = await connectionPromise;
        let user = await connection.get(
            "SELECT * FROM users WHERE id = ?",
            userId
        );
        if (await compare(currentPassword, user.password)) {
            let newPasswordHash = await hash(newPassword, 10);
            await connection.run(
                "UPDATE users SET password = ? WHERE id = ?",
                newPasswordHash,
                userId
            );
            return true;
        } else {
            return false;
        }
    }

    export const getUserAdressModel = async (userId) => {
        let connection = await connectionPromise;
        console.log(userId + "model");
        let result = await connection.get(
            "SELECT * FROM Adresses WHERE user_id = ?",
            userId
        );
        return result;
    }


    export const addUserAdressModel = async (adress,userId) => {
        let connection = await connectionPromise;
        console.log(adress);
        const{fullname,street,city,state,zip,country} = adress;
        await connection.run(
            "INSERT INTO Adresses (fullname,street,city,state,zip,country,user_id) VALUES (?,?,?,?,?,?,?)",
            fullname,
            street,
            city,
            state,
            zip,
            country,
            userId
        );
        }

       
        export const deleteUserAdressModel = async (userId) => {
            let connection = await connectionPromise;
            await connection.run(
                "DELETE FROM Adresses WHERE user_id = ?",
                userId
            );
            }
