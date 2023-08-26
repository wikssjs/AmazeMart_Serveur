import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Constante indiquant si la base de données existe au démarrage du serveur 
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE)

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
    let connection = await connectionPromise;
    await connection.exec(
        `
        CREATE TABLE products (
              id INTEGER PRIMARY KEY,
              name TEXT,
              price Numeric,
              description TEXT,
              image TEXT,
              category TEXT,
              quantity INTEGER
            );

            CREATE TABLE users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT NOT NULL UNIQUE,
              fullname TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              phone TEXT,
              member_since TEXT DEFAULT CURRENT_TIMESTAMP
            );

            Create Table Adresses(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              fullname TEXT,
              street TEXT,
              city TEXT,
              state TEXT,
              zip TEXT,
              country TEXT,
              FOREIGN KEY (user_id) REFERENCES users (id)
            );


            CREATE TABLE favorite_products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              product_id INTEGER,
              FOREIGN KEY (user_id) REFERENCES users (id),
              FOREIGN KEY (product_id) REFERENCES products (id),
              UNIQUE(user_id, product_id)
            );
            
            

            CREATE TABLE product_images (
              id INTEGER PRIMARY KEY,
              product_id INTEGER,
              image_url TEXT,
              FOREIGN KEY (product_id) REFERENCES products (id)
          );
          

            CREATE TABLE reviews (
              id INTEGER PRIMARY KEY,
              product_id INTEGER,
              title TEXT,
              reviewer_name TEXT,
              rating INTEGER,
              comment TEXT,
              FOREIGN KEY (product_id) REFERENCES products(id)
            );
            
            
            CREATE TABLE cart (
              id INTEGER PRIMARY KEY,
              user_id INTEGER,
              productId INTEGER,
              quantity INTEGER,
              FOREIGN KEY (user_id) REFERENCES users (id),
              FOREIGN KEY (productId) REFERENCES products (id)
            );

            CREATE TABLE checkout (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              email TEXT,
              cardHolderName TEXT,
              cardNumber TEXT,
              expirationDate TEXT,
              cvv TEXT,
              order_date DATETIME DEFAULT CURRENT_TIMESTAMP , -- New column for storing the order date
              FOREIGN KEY (user_id) REFERENCES users(id)
            );
            
            

            CREATE TABLE checkout_products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              checkout_id INTEGER,
              product_id INTEGER,
              quantity INTEGER,
              total Numeric,
              FOREIGN KEY (checkout_id) REFERENCES checkout(id),
              FOREIGN KEY (product_id) REFERENCES products(id)
            );
            

            CREATE TABLE coupons (
              id INTEGER PRIMARY KEY,
              code TEXT UNIQUE,
              discount NUMERIC,
              expiration_date TEXT,
              description TEXT
            );

            CREATE TABLE cart_coupons (
              cart_id INTEGER,
              coupon_id INTEGER,
              PRIMARY KEY (cart_id, coupon_id),
              FOREIGN KEY (cart_id) REFERENCES cart(id),
              FOREIGN KEY (coupon_id) REFERENCES coupons(id)
            );
            

            CREATE TABLE CARDS (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER UNIQUE,
              cardType TEXT,
              cardHolderName TEXT,
              cardNumber TEXT,
              expirationDate TEXT,
              cvv TEXT,
              FOREIGN KEY (user_id) REFERENCES users(id)
            );


            CREATE TRIGGER on_delete_product
                AFTER DELETE ON products
                BEGIN
                    DELETE FROM cart WHERE productId = OLD.id;
                    DELETE FROM favorite_products WHERE product_id = OLD.id;
                    DELETE FROM product_images WHERE product_id = OLD.id;
                    DELETE FROM reviews WHERE product_id = OLD.id;
                END;

            

            -- Electronics
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Apple AirPods Pro', '249', 'Wireless earbuds with active noise cancellation.', 'airpod.png', 'Electronics', 10);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Samsung 4K Smart TV', '899', 'Ultra HD LED TV with smart features.', 'samsungTv.png', 'Electronics', 5);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Sony PlayStation 5', '499', 'Next-generation gaming console with immersive experiences.', 'play5.png', 'Electronics', 3);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Canon EOS Rebel T7i', '799', 'Entry-level DSLR camera with high-quality imaging.', 'canon.png', 'Electronics', 8);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Dyson V11 Absolute', '599', 'Powerful cordless vacuum cleaner with advanced features.', 'dyson.png', 'Electronics', 12);

-- Books
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('The Great Gatsby', '10.99', 'Classic novel by F. Scott Fitzgerald.', 'gasby.png', 'Books', 20);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Becoming', '14.99', 'Memoir by Michelle Obama.', 'becoming.png', 'Books', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('The Alchemist', '9.99', 'Bestselling novel by Paulo Coelho.', 'alchemist.png', 'Books', 25);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Educated', '12.99', 'Memoir by Tara Westover.', 'educated.png', 'Books', 18);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('To Kill a Mockingbird', '8.99', 'Classic novel by Harper Lee.', 'kill.png', 'Books', 30);

-- Clothing
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mens Leather Jacket', '149', 'Stylish leather jacket for men.', 'jacket.png', 'Clothing', 7);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Womens Floral Dress', '79', 'Elegant floral print dress for women.', 'floraldress.png', 'Clothing', 10);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mens Casual T-Shirt', '29', 'Comfortable and versatile t-shirt for men.', 'casual.png', 'Clothing', 20);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Womens Workout Leggings', '49', 'Stretchy and moisture-wicking leggings for active women.', 'workout.png', 'Clothing', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mens Formal Suit', '299', 'Classic formal suit for men.', 'suit.png', 'Clothing', 5);

-- Home & Kitchen
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Instant Pot Duo', '99', 'Multi-functional electric pressure cooker.', 'pot.png', 'Home & Kitchen', 8);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('KitchenAid Stand Mixer', '299', 'Powerful stand mixer for baking and cooking.', 'mixer.png', 'Home & Kitchen', 6);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Shark Navigator Vacuum', '199', 'Upright vacuum cleaner with strong suction power.', 'vacuum.png', 'Home & Kitchen', 10);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Cuisinart Coffee Maker', '89', 'Programmable coffee maker for brewing delicious coffee.', 'cofee.png', 'Home & Kitchen', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Nespresso VertuoPlus', '179', 'Single-serve coffee machine for espresso and coffee.', 'nepreso.png', 'Home & Kitchen', 12);

-- Sports & Outdoors
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Yoga Mat', '29.99', 'Non-slip exercise mat for yoga and fitness.', 'yogamat.png', 'Sports & Outdoors', 20);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Outdoor Camping Tent', '149', 'Spacious tent for outdoor camping adventures.', 'tent.png', 'Sports & Outdoors', 5);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Running Shoes', '99', 'Lightweight and cushioned shoes for running.', 'running.png', 'Sports & Outdoors', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mountain Bike', '499', 'Durable and versatile bike for off-road cycling.', 'bike.png', 'Sports & Outdoors', 3);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Waterproof Hiking Backpack', '79', 'Spacious backpack for hiking and outdoor adventures.', 'backpack.png', 'Sports & Outdoors', 8);

INSERT INTO reviews (product_id, title, reviewer_name, rating, comment)
VALUES (1, 'Impressive Product', 'John Doe', 4, 'Great product, highly recommended.');

INSERT INTO reviews (product_id, title, reviewer_name, rating, comment)
VALUES (1, 'Excellent Quality', 'Jane Smith', 5, 'Excellent quality, worth the price.');

INSERT INTO reviews (product_id, title, reviewer_name, rating, comment)
VALUES (1, 'Decent Product', 'David Johnson', 3, 'Good product, but could be better.');

INSERT INTO reviews (product_id, title, reviewer_name, rating, comment)
VALUES (1, 'Highly Recommended', 'Emily Wilson', 5, 'Amazing features and performance.');

INSERT INTO reviews (product_id, title, reviewer_name, rating, comment)
VALUES (1, 'Not Durable', 'Michael Brown', 2, 'Not satisfied with the durability.');

INSERT INTO coupons (code, discount, expiration_date, description)
VALUES ('COUPON1', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON2', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON3', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON4', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON5', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON6', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON7', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON8', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON9', 0.10, '2024-06-29', '10% off your order!'),
       ('COUPON10', 0.10, '2024-06-29', '10% off your order!');

            
        `
    );

    return connection;
}
// CREATE TABLE categories (
//     id INTEGER PRIMARY KEY,
//     nom_categorie TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );
// Base de données dans un fichier
let connectionPromise = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
    connectionPromise = createDatabase(connectionPromise);
}

export default connectionPromise;

// INSERT INTO orders (id_client, id_menu, quantite) VALUES 
//         (1, 1, 2),
//         (2, 3, 2),
//         (1, 3, 1);


// INSERT INTO orders (id_client, id_menu, quantite) VALUES 
// (1, 1, 2),
// (1, 3, 1),
// (1, 2, 2),
// (4, 4, 1),
// (5, 5, 3),
// (1, 8, 1),
// (2, 2, 3),
// (3, 4, 2),
// (4, 1, 1),
// (5, 5, 2);