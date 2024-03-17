CREATE TABLE cookalicious.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE, 
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100),
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    telephonenumber VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET search_path TO cookalicious


-- Table for recipes
CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE recipe_ingredients (
    recipe_id INT REFERENCES recipes(recipe_id),
    ingredient_id INT REFERENCES ingredients(ingredient_id),
    quantity NUMERIC,
    unit VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE recipe_categories (
    recipe_id INT REFERENCES recipes(recipe_id),
    category_id INT REFERENCES categories(category_id),
    PRIMARY KEY (recipe_id, category_id)
);


// Without foreign keys for testing purposes


-- Table for users
CREATE TABLE cookalicious.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE, 
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100),
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    telephonenumber VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET search_path TO cookalicious;

-- Table for recipes
CREATE TABLE cookalicious.recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for ingredients
CREATE TABLE cookalicious.ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Table for mapping recipes to ingredients
CREATE TABLE cookalicious.recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity NUMERIC,
    unit VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- Table for categories
CREATE TABLE cookalicious.categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Table for mapping recipes to categories
CREATE TABLE cookalicious.recipe_categories (
    recipe_id INT,
    category_id INT,
    PRIMARY KEY (recipe_id, category_id)
);

