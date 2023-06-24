import {getCartModel} from '../model/cart.js';

export const getCart = async (req,res) =>{
    res.status(200).json({
        cart: await getCartModel()
    })
}