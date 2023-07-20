import { registerUserModel,getUserByEmailModel,getUserByUsernameModel } from "../model/user.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailExist = await getUserByEmailModel(email);
    const userExist = await getUserByUsernameModel(username);
    
    if(emailExist || userExist){
        res.status(400).json({
            message: "User already exists"
        })
        return ;
    }

    const user = await registerUserModel(username, email, hashedPassword);

    res.status(201).json({
        message: "User created successfully",
        user
    })
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmailModel(email);
    if (!user) {
        res.status(404).json({
            message: "User not found"
        })
        return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(400).json({
            message: "Incorrect password"
        })
        return;
    }
    const token = Jwt.sign({ id: user.id, email: user.email }, process.env.SESSION_SECRET, { expiresIn: "24h" });
    res.status(200).json({
        message: "User logged in successfully",
        token
    })
}