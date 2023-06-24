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
              price TEXT,
              description TEXT,
              image TEXT,
              category TEXT,
              quantity INTEGER
            );
            
            CREATE TABLE cart (
              id INTEGER PRIMARY KEY,
              productId INTEGER Unique,
              quantity INTEGER,
              FOREIGN KEY (productId) REFERENCES products (id)
            );

            -- Electronics
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Apple AirPods Pro', '$249', 'Wireless earbuds with active noise cancellation.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Electronics', 10);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Samsung 4K Smart TV', '$899', 'Ultra HD LED TV with smart features.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Electronics', 5);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Sony PlayStation 5', '$499', 'Next-generation gaming console with immersive experiences.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Electronics', 3);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Canon EOS Rebel T7i', '$799', 'Entry-level DSLR camera with high-quality imaging.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Electronics', 8);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Dyson V11 Absolute', '$599', 'Powerful cordless vacuum cleaner with advanced features.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Electronics', 12);

-- Books
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('The Great Gatsby', '$10.99', 'Classic novel by F. Scott Fitzgerald.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Books', 20);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Becoming', '$14.99', 'Memoir by Michelle Obama.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Books', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('The Alchemist', '$9.99', 'Bestselling novel by Paulo Coelho.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Books', 25);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Educated', '$12.99', 'Memoir by Tara Westover.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Books', 18);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('To Kill a Mockingbird', '$8.99', 'Classic novel by Harper Lee.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Books', 30);

-- Clothing
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mens Leather Jacket', '$149', 'Stylish leather jacket for men.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Clothing', 7);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Womens Floral Dress', '$79', 'Elegant floral print dress for women.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Clothing', 10);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mens Casual T-Shirt', '$29', 'Comfortable and versatile t-shirt for men.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Clothing', 20);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Womens Workout Leggings', '$49', 'Stretchy and moisture-wicking leggings for active women.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Clothing', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mens Formal Suit', '$299', 'Classic formal suit for men.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Clothing', 5);

-- Home & Kitchen
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Instant Pot Duo', '$99', 'Multi-functional electric pressure cooker.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Home & Kitchen', 8);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('KitchenAid Stand Mixer', '$299', 'Powerful stand mixer for baking and cooking.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Home & Kitchen', 6);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Shark Navigator Vacuum', '$199', 'Upright vacuum cleaner with strong suction power.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Home & Kitchen', 10);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Cuisinart Coffee Maker', '$89', 'Programmable coffee maker for brewing delicious coffee.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Home & Kitchen', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Nespresso VertuoPlus', '$179', 'Single-serve coffee machine for espresso and coffee.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Home & Kitchen', 12);

-- Sports & Outdoors
INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Yoga Mat', '$29.99', 'Non-slip exercise mat for yoga and fitness.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Sports & Outdoors', 20);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Outdoor Camping Tent', '$149', 'Spacious tent for outdoor camping adventures.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Sports & Outdoors', 5);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Running Shoes', '$99', 'Lightweight and cushioned shoes for running.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Sports & Outdoors', 15);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Mountain Bike', '$499', 'Durable and versatile bike for off-road cycling.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Sports & Outdoors', 3);

INSERT INTO products (name, price, description, image, category, quantity)
VALUES ('Waterproof Hiking Backpack', '$79', 'Spacious backpack for hiking and outdoor adventures.', 'https://i5.walmartimages.com/asr/0a4daa53-2aea-46b4-b5d5-9b04c7a416e9.7bd167d319855b52f0bd56ff7dc2544b.jpeg', 'Sports & Outdoors', 8);


            
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