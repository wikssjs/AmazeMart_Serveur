import { getCategoriesModel,getProductsByCategoryModel } from "../model/categories.js";

export const getCategories = async (req,res) =>{
    let results = await getCategoriesModel();
    res.status(200).json({
        categories: results
    })
}

export const getProductsByCategory = async (req,res) =>{
    console.log(req.query.category)
    let results = await getProductsByCategoryModel(req.query.category);
    res.status(200).json({
        products: results
    })
}