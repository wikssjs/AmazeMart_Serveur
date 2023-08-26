import { json } from "express";
import {
  getCartModel,
  deleteCartProduct,
  incrementCartModel,
  decrementCartModel,
  getCartProductById,
  getSubTotal,
  verifyCouponModel,
  addToCheckoutModel,
  getCheckoutProductsModel,
  getUserAdressModel,
  getCartCountModel,
} from "../model/cart.js";
import { getProductById } from "./product.js";

export const getCart = async (req, res) => {
    const userId = Number(req.headers['user-id']);
  res.status(200).json({
    cart: await getCartModel(userId),
    adress: await getUserAdressModel(userId),
    subTotal : await getSubTotal(userId)
  });
};

export const getCartCount = async (req, res) => {
  const userId = Number(req.headers['user-id']);
  console.log(userId + " user id");
  console.log((await getCartModel(userId)).length + " cart count");
  res.status(200).json({
    cartCount: (await getCartModel(userId)).length,
  });

};


export const deleteProductCart = async (req, res) => {
  let productId = req.params.id;
  let userId = req.headers['user-id'];
  let results = await deleteCartProduct(productId,userId);
  res.status(200).json({
    cart: results,
    subTotal : await getSubTotal()
  });
};

export const incrementCart = async (req, res) => {
  const productId = req.body.id;
  const cartProduct = await getCartProductById(productId);
const userId = req.headers['user-id'];
  if (cartProduct.cart_quantity < cartProduct.product_quantity) {
    let results = await incrementCartModel(productId,userId);
    res.status(201).json({
      cart: results,
      subTotal : await getSubTotal(userId)
    });
  }
};

export const decrementCart = async (req, res) => {
    const productId = req.body.id;
    const cartProduct = await getCartProductById(productId);
    const userId = req.headers['user-id'];
  if (cartProduct.cart_quantity > 1) {
    let productId = req.body.id;
    let results = await decrementCartModel(productId,userId);
    res.status(201).json({
      cart: results,
      subTotal : await getSubTotal(userId)
    });
  }
  else{
    res.status(400).json({
        message: "Quantity cannot be less than 1"
    })
  }
};

export const verifyCoupon = async (req,res) =>{
    let coupon = req.body.coupon;
    let subTotal = await getSubTotal( req.headers['user-id']);
    let discount = 0;
    console.log(subTotal, coupon);
    if(await verifyCouponModel(coupon)){
        discount = subTotal.subTotal * 0.1;
        res.status(200).json({
            subTotal: subTotal,
            discount: discount,
            total: subTotal.subTotal - discount
        })
        return;
    }

    res.status(400).json({
        message: "Coupon not valid"
    })
}


export const addToCheckout = async (req, res) => {
  const userId = Number(req.headers["user-id"]);
  const userInformation = req.body.userInformations;
  const products = req.body.products;

  const result = await addToCheckoutModel(
    userId,
    userInformation,
    products
  );

  if (result.success) {
    res.status(201).json({ message: result.message });
  } else {
    res.status(400).json({ message: result.message });
  }
}

export const getCheckoutProducts = async (req, res) => {
  const userId = Number(req.headers["user-id"]);
  let result;

  if(userId){

    result = await getCheckoutProductsModel(userId);
  }
  else{
    result = await getCheckoutProductsModel();
  }

  // Group the checkout products data by order_id
  const groupedData = groupDataByOrderId(result);
console.log(groupedData);
  res.status(200).json(groupedData);
};

const groupDataByOrderId = (data) => {
  // Create an object to hold the grouped data
  const groupedData = {};

  data.forEach((item) => {
    // If the order_id doesn't exist in the groupedData object, create a new entry
    if (!groupedData[item.order_id]) {
      groupedData[item.order_id] = {
        order_id: item.order_id,
        order_date: item.order_date,
        total_price: item.total_order_price,

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
    });
  });

  // Convert the object values back to an array to get the grouped data
  return Object.values(groupedData);
};
