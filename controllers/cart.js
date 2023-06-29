import { json } from "express";
import {
  getCartModel,
  deleteCartProduct,
  incrementCartModel,
  decrementCartModel,
  getCartProductById,
  getSubTotal,
  verifyCouponModel
} from "../model/cart.js";
import { getProductById } from "./product.js";

export const getCart = async (req, res) => {
    console.log(await getSubTotal())
  res.status(200).json({
    cart: await getCartModel(),
    subTotal : await getSubTotal()
  });
};

export const deleteProduct = async (req, res) => {
  let productId = req.params.id;
  let results = await deleteCartProduct(productId);
  res.status(200).json({
    cart: results,
    subTotal : await getSubTotal()
  });
};

export const incrementCart = async (req, res) => {
  const productId = req.body.id;
  const cartProduct = await getCartProductById(productId);

  if (cartProduct.cart_quantity < cartProduct.product_quantity) {
    let results = await incrementCartModel(productId);
    res.status(201).json({
      cart: results,
      subTotal : await getSubTotal()
    });
  }
};

export const decrementCart = async (req, res) => {
    const productId = req.body.id;
    const cartProduct = await getCartProductById(productId);
  if (cartProduct.cart_quantity > 1) {
    let productId = req.body.id;
    let results = await decrementCartModel(productId);
    res.status(201).json({
      cart: results,
      subTotal : await getSubTotal()
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
    let subTotal = await getSubTotal();
    let discount = 0;
    console.log(await verifyCouponModel(coupon));
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
