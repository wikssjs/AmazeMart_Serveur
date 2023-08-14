import { getSearchProductsModel } from "../model/search.js";

export const getSearchProducts = async (req,res) => {
    const search = req.query.search;
    const results = await getSearchProductsModel(search);

    res.status(200).json({
        products: results
    })
    };

