import 'dotenv/config';
import express, { json } from 'express';
import multer from 'multer';
import { create } from 'express-handlebars';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import { getHomeData,addToCart} from './controllers/HomeData.js';
import { addToFavorite, getProductById} from './controllers/product.js';
import './authentification.js';
import { getCart,deleteProductCart, addToCheckout, getCheckoutProducts,getCartCount } from './controllers/cart.js';
import { incrementCart,decrementCart,verifyCoupon } from './controllers/cart.js';
import { getCategories, getProductsByCategory } from './controllers/categories.js';
import { getSearchProducts } from './controllers/search.js';
import { registerUser,loginUser, changeUserInfos, changeUserPassword, addUserAdress, deleteUserAdress, getUserAdress } from './controllers/user.js';
import { getFavoritesProducts, getUserProfile,deleteFavoriteProduct, addCreditCard, deleteCreditCard, getCreditCard, updateCreditCard } from './controllers/account.js';
import { addProduct, getAllUsers, getDashboard, getUserById, getProductReviews ,updateReview, deleteReview, updateProduct, deleteProduct} from './controllers/admin.js';

// Création du serveur
let app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Initialisation de handlebars
app.engine('handlebars', engine({
    helpers: {
        afficheArgent: (nombre) => nombre && nombre.toFixed(2),
        afficheEtoil: (nombre) => nombre && nombre.toFixed(1),
        // afficheEtoil: (tab) => tab && tab.length.toFixed(1)
    }
}));

// app.engine('handlebars', handlebars.engine);

// Mettre l'engin handlebars comme engin de rendu
app.set('view engine', 'handlebars');
// Configuration de handlebars
app.set('views', './views');

// Création du constructeur de la base de données de session
const MemoryStore = memorystore(session);

// Ajout de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(json());
app.use(
	session({
		cookie: { maxAge: 1800000 },
		name: process.env.npm_package_name,
		store: new MemoryStore({ checkPeriod: 1800000 }),
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
	}),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


// Programmation de routes


app.get('/',getHomeData)
app.get('/product/:id',getProductById)
app.get('/getProductReviews',getProductReviews);
app.put('/admin/updateReview',updateReview)
app.delete('/admin/deleteReview',deleteReview)
app.post('/addProduct',upload.single('image'),addProduct)
app.put('/product/:id',updateProduct)
app.delete('/product',deleteProduct)
app.post('/addtocart',addToCart);

app.get('/cart',getCart);
app.get('/cartCount',getCartCount)

app.delete('/cart/:id',deleteProductCart);

app.put('/cart/increment',incrementCart);

app.put('/cart/decrement',decrementCart);

app.post('/cart/coupon',verifyCoupon);

app.get('/categories',getCategories);

app.get('/products',getProductsByCategory);

app.post('/product/addtofavorite',addToFavorite);

app.get('/searchproducts',getSearchProducts);

app.post('/user/register',registerUser);

app.post('/user/login',loginUser);

app.get('/profile',getUserProfile);

app.put('/profile',changeUserInfos);

app.put('/profile/password',changeUserPassword);

app.get('/address',getUserAdress);
app.post("/address",addUserAdress);

app.delete("/address",deleteUserAdress);

app.get('/user/favorites',getFavoritesProducts);

app.delete('/user/favorites',deleteFavoriteProduct);

app.post('/user/checkout', addToCheckout);
app.get('/user/orders', getCheckoutProducts);

app.get('/user/getCreditCard', getCreditCard);
app.post('/user/addCreditCard', addCreditCard);

app.delete('/user/deleteCreditCard', deleteCreditCard);

app.put('/user/updateCreditCard', updateCreditCard);

app.get('/admin/dashboard',getDashboard);

//admin part
app.get('/getUsers', getAllUsers);
app.get('/getUsers/:id', getUserById);
// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);
