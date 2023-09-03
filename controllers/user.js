import { registerUserModel,getUserByEmailModel,
    changeUserInfosModel,changeUserPasswordModel,
addUserAdressModel, 
deleteUserAdressModel,
getUserAdressModel
} from "../model/user.js";
import pkg from "bcryptjs";
import Jwt from "jsonwebtoken";

const { hash, compare } = pkg;

export const registerUser = async (req, res) => {
    const { fullname, email,phone, password } = req.body;

    const hashedPassword = await hash(password, 10);
    const emailExist = await getUserByEmailModel(email);
    
    if(emailExist){
        res.status(400).json({
            message: "Email already exists"
        })
        return ;
    }

    const user = await registerUserModel(fullname, email,phone, hashedPassword);

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
            message: "Email or password incorrect"
        })
        return;
    }
    const match = await compare(password, user.password);
    if (!match) {
        res.status(400).json({
            message: "Email or password incorrect"
        })
        return;
    }
    const token = Jwt.sign({ id: user.id, email: user.email }, process.env.SESSION_SECRET, { expiresIn: "24h" });
    res.status(200).json({
        message: "User logged in successfully",
        token
    })
}

export const changeUserInfos = async (req, res) => {
    const { fullname, email,phone} = req.body;
    const userId = req.headers["user-id"];
    const user = await changeUserInfosModel(fullname, email,phone,userId);

    res.status(200).json({
        message: "User infos changed successfully",
        user
    })
}

export const changeUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.headers["user-id"];
    const user = await changeUserPasswordModel(currentPassword, newPassword,userId);
    if(user){
        res.status(200).json({
            message: "User password changed successfully",
            user
        })
    }
    else{
        res.status(400).json({
            message: "Incorrect password"
        })
    }
}
export const getUserAdress = async (req, res) => {
    const userId = req.headers["user-id"];
    const address = await getUserAdressModel(userId);

    res.status(200).json({
        message: "User adress fetched successfully",
        address
    })
}

export const addUserAdress = async (req, res) => {
    const userId = req.headers["user-id"];
    const adress = req.body;
    const user = await addUserAdressModel(adress,userId);

    res.status(200).json({
        message: "User adress added successfully",
        user
    })
}

export const deleteUserAdress = async (req, res) => {
    let userId = req.body.userId;
    const user = await deleteUserAdressModel(userId);

    res.status(200).json({
        message: "User adress deleted successfully",
        user
    })
}