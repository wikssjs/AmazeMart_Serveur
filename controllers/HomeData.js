import { getProducts,addToCartModel} from "../model/home.js"
import { getProductById } from "./product.js";
import { getCartModel } from "../model/cart.js";

export const getHomeData = async (req,res) =>{
    const userId = Number(req.headers['user-id']);
    res.status(200).json({
        products: await getProducts(userId),
    })
}


export const addToCart = async (req,res) =>{
    let productId = req.body.id;
    let quantity = req.body.quantity;
    let userId = Number(req.headers['user-id']);
    let results = await addToCartModel(productId,quantity,userId);
    console.log((await getCartModel(userId)).length + " cart count");
    res.status(201).json({
        cart: results,
    });
}
