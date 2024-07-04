-- Drop existing tables if they exist to start clean
DROP TABLE IF EXISTS UserMeals;
DROP TABLE IF EXISTS favoriterecipes;
DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(8) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL
);

-- Create Favorite Recipes Table
CREATE TABLE favoriterecipes (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create User Meals Table
CREATE TABLE UserMeals (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create User Last View Table
CREATE TABLE userlastview (
    user_id INT NOT NULL,
    lastView1 INT,
    lastView2 INT,
    lastView3 INT,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
