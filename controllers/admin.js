import { getAllUsersModel,getUserByIdModel,getUserCartModel,getUserOrdersModel } from '../model/admin.js';
import { getCartModel } from '../model/cart.js';

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

const groupDataByOrderId = (data) => {
    // Create an object to hold the grouped data
    const groupedData = {};
  
    data.forEach((item) => {
      // If the order_id doesn't exist in the groupedData object, create a new entry
      if (!groupedData[item.order_id]) {
        groupedData[item.order_id] = {
          order_id: item.order_id,
          order_date: item.order_date,
          products: [],
        };
      }
  
      // Add the product to the corresponding order_id
      groupedData[item.order_id].products.push({
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        total_price: item.total_order_price,
      });
    });
  
    // Convert the object values back to an array to get the grouped data
    return Object.values(groupedData);
  };