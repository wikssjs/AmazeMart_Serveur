import 'dotenv/config';
import express, { json } from 'express';
import { create } from 'express-handlebars';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import { getHomeData,addToCart} from './controllers/HomeData.js';
import { getProductById} from './controllers/product.js';
import './authentification.js';
import { getCart,deleteProduct } from './controllers/cart.js';
import { incrementCart,decrementCart,verifyCoupon } from './controllers/cart.js';

// Création du serveur
let app = express();

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

app.post('/addtocart',addToCart);

app.get('/cart',getCart);

app.delete('/cart/:id',deleteProduct);

app.put('/cart/increment',incrementCart);

app.put('/cart/decrement',decrementCart);

app.post('/cart/coupon',verifyCoupon);

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);
