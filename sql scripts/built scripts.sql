-- Drop existing tables if they exist to start clean
DROP TABLE IF EXISTS UserMeals;
DROP TABLE IF EXISTS favoriterecipes;
DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;
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

-- Create Recipes Table
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255),
    readyInMinutes INT,
    popularity INT,
    vegetarian BOOLEAN,
    vegan BOOLEAN,
    glutenFree BOOLEAN,
    summary TEXT,
    servings INT
);

-- Create Instructions Table
CREATE TABLE instructions (
    instructionid INT AUTO_INCREMENT PRIMARY KEY,
    recipeid INT,
    stepnumber INT,
    description TEXT,
    FOREIGN KEY (recipeid) REFERENCES recipes(id)
);

-- Create Ingredients Table
CREATE TABLE ingredients (
    ingredientid INT AUTO_INCREMENT PRIMARY KEY,
    recipeid INT,
    aisle VARCHAR(255),
    image VARCHAR(255),
    consistency VARCHAR(50),
    name VARCHAR(255),
    originaldescription TEXT,
    amount DECIMAL(10,2),
    unit VARCHAR(50),
    FOREIGN KEY (recipeid) REFERENCES recipes(id)
);

-- Create Favorite Recipes Table
CREATE TABLE favoriterecipes (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- Create User Meals Table
CREATE TABLE UserMeals (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
