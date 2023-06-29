import { getProducts,addToCartModel} from "../model/home.js"
import { getProductById } from "./product.js";

export const getHomeData = async (req,res) =>{
    res.status(200).json({
        products: await getProducts(),
    })
}


export const addToCart = async (req,res) =>{
    let productId = req.body.id;
    let quantity = req.body.quantity;
    let results = await addToCartModel(productId,quantity);
    res.status(201).json({
        cart: results
    });
}
