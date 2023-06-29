import {getProduct,getReviews } from '../model/home.js';

export const getProductById = async (req,res) =>{
    res.status(200).json({
        product: await getProduct(req.params.id),
        reviews: await getReviews(req.params.id)
    })
}