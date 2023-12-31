import {addTofavoriteModel, getProduct,getReviews } from '../model/home.js';

export const getProductById = async (req,res) =>{
    console.log(req.params.id)
    res.status(200).json({
        product: await getProduct(req.params.id),
        reviews: await getReviews(req.params.id)
    })
}

export const addToFavorite = async (req,res) =>{
    let productId = req.body.productId;
    let userId = req.headers['user-id'];
    let result;

    try{

        result = await addTofavoriteModel(productId,userId);
        console.log(result)
        res.status(200).json({
            message: "added to favorite",
            product: await result
        })
    }

    catch(e){
        console.log(e)
        res.status(400).json({
            message: "already added to favorite"
        })
}
}