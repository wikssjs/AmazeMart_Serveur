import {
  getUserProfileModel,
  getFavoritesProductsModel,
  deleteFavoriteProductModel,
  getCreditCardModel,
  addCreditCardModel,
  deleteCreditCardModel,
  updateCreditCardModel
} from "../model/account.js";

export const getUserProfile = async (req, res) => {
  const userId = req.headers["user-id"];
  res.status(200).json({
    user: await getUserProfileModel(userId),
  });

};

export const getFavoritesProducts = async (req, res) => {
  const userId = req.headers["user-id"];
 res.status(200).json({
    products: await getFavoritesProductsModel(userId),
  });
};

export const deleteFavoriteProduct = async (req, res) => {
    const userId = req.headers["user-id"];
    const productId = req.body.productId;
    res.status(200).json({
        products: await deleteFavoriteProductModel(productId,userId),
        message: "product deleted",
    });
    }

    export const addCreditCard = async (req, res) => {
        const userId = req.headers["user-id"];
        const cardType = req.body.cardType;
        const cardHolderName = req.body.cardHolderName;
        const cardNumber = req.body.cardNumber;
        const expirationDate = req.body.expirationDate;
        const cvv = req.body.cvv;

        try{

          await addCreditCardModel(cardType,cardHolderName,cardNumber, expirationDate, cvv, userId);
        }
        catch(error){
          if(error === 'Unique Constraint Violation'){
            res.status(400).json({
              message: "card already exists",
          });
          }
          else{
            res.status(500).json({
              message: "error",
          });
          }
      }


        res.status(200).json({
            message: "card added",
        });
    }


    export const deleteCreditCard = async (req, res) => {
        const userId = req.headers["user-id"];
        await deleteCreditCardModel(userId);
        res.status(200).json({
            message: "card deleted",
        });
    }

    export const getCreditCard = async (req, res) => {
        const userId = req.headers["user-id"];
        res.status(200).json({
            card: await getCreditCardModel(userId),
        });
    }

    export const updateCreditCard = async (req, res) => {
        const userId = req.headers["user-id"];
        const cardType = req.body.cardType;
        const cardHolderName = req.body.cardHolderName;
        const cardNumber = req.body.cardNumber;
        const expirationDate = req.body.expirationDate;
        const cvv = req.body.cvv;

        await updateCreditCardModel(cardType,cardHolderName,cardNumber, expirationDate, cvv, userId);
        res.status(200).json({
            message: "card updated",
        });
    }

