-- user table:
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(8) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(10) NOT NULL
);

-- recipe tables:

-- Creating the main 'Recipes' table
CREATE TABLE Recipes (
    RecipeID INT PRIMARY KEY,
    Image VARCHAR(255),
    Title VARCHAR(255),
    ReadyInMinutes INT,
    AggregateLikes INT,
    Vegetarian BOOLEAN,
    Vegan BOOLEAN,
    GlutenFree BOOLEAN,
    Summary TEXT,
    Servings INT
);

-- Creating the 'Instructions' table
CREATE TABLE Instructions (
    InstructionID INT AUTO_INCREMENT PRIMARY KEY,
    RecipeID INT,
    StepNumber INT,
    Description TEXT,
    FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID)
);

-- Creating the 'Ingredients' table
CREATE TABLE Ingredients (
    IngredientID INT,
    RecipeID INT,
    Aisle VARCHAR(255),
    Image VARCHAR(255),
    Consistency VARCHAR(50),
    Name VARCHAR(255),
    OriginalDescription TEXT,
    Amount DECIMAL(10,2),
    Unit VARCHAR(50),
    FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID)
);

