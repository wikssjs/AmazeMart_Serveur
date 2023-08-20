import { getAllUsersModel,getUserByIdModel,getUserCartModel,getUserOrdersModel,addProductModel,getGlobalDashboardDataModel,getMonthlyDataModel,getRecentOrdersModel,updateReviewModel,deleteReviewModel,updateProductModel,deleteProductModel } from '../model/admin.js';
import { getCartModel } from '../model/cart.js';
import { getReviews } from '../model/home.js';

export const getAllUsers = async (req, res) => {
    let results = await getAllUsersModel();
    res.status(200).json({
        users: results
    });
 }
    

 export const getUserById = async (req, res) => {
    let id = req.params.id;
    console.log(id);
    let user = await getUserByIdModel(id);
    let cart = await getCartModel(id);
    console.log(cart);
    let orders = groupDataByOrderId(await getUserOrdersModel(id));
    res.status(200).json({
        user,
        cart,
        orders
    });
}


export const addProduct = async (req, res) => {
  let  {name, price, description, category,quantity} = req.body;
  const {originalname} = req.file;
  let results = await addProductModel(name, price, originalname, description, category,quantity);
  res.status(201).json({
    product: results
  });
}
export const updateProduct = async (req, res) => {
  console.log(req.body);
    let id = req.params.id;
    let {name, price,image, description, category, quantity} = req.body;
    let result = await updateProductModel(id, name, price,image, description, category, quantity);
    res.status(200).json({
        message: "product updated",
        product:  result
    });
}

export const deleteProduct = async (req, res) => {
    let {id} = req.body;
    await deleteProductModel(id);
    res.status(204).end();
}
        
    


export const getDashboard = async (req, res) => {
    const globalData = await getGlobalDashboardDataModel();
    const monthlyData = await getMonthlyDataModel();
    const recentOrders = await getRecentOrdersModel();

    res.status(200).json({
        globalData,
        monthlyData,
        recentOrders
    });
}

const groupDataByOrderId = (data) => {

    let orders = [];
    let orderIds = [];
    data.forEach((item) => {
        if (!orderIds.includes(item.order_id)) {
            orders.push({
                id: item.order_id,
                order_date: item.order_date,
                total_order_price: item.total_order_price,
                products: []
            });
            orderIds.push(item.order_id);
        }
    });

    data.forEach((item) => {
        orders.forEach((order) => {
            if (order.id === item.order_id) {
                order.products.push({
                    id: item.product_id,
                    name: item.product_name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                });
            }
        });
    });

    return orders;
}

export const getProductReviews = async (req, res) => {
    let id = req.query.id;
    console.log(id)
    let reviews = await getReviews(id);
    res.status(200).json({
        reviews
    });
}

export const updateReview = async (req, res) => {
    let {id, comment} = req.body;
    let result = await updateReviewModel(id, comment);
    res.status(200).json({
        message: "review updated",
        review:  result
    });
}

export const deleteReview = async (req, res) => {
    let {id} = req.body;
    let result = await deleteReviewModel(id);
    res.status(200).json({
        message: "review deleted",
        review:  result
    });
}
