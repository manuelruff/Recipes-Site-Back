# Recipe Site Backend

This is the backend for the Recipe Site, designed to provide the server-side functionality and API endpoints required by the frontend application. It handles user authentication, recipe management, and database operations.

---

## Features

- **User Authentication**: Secure login and registration.
- **Recipe Management**: Create, update, delete, and retrieve recipes.
- **Search Functionality**: Search for recipes by name or ingredients.
- **Database Integration**: Stores user and recipe data in a relational database.
- **RESTful API**: Provides endpoints for frontend communication.

---

## Technologies Used

- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Configuration**: dotenv
- **API Documentation**: Swagger

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manuelruff/Recipes-Site-Back
   cd Recipes-Site-Back
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database (not mendatory):
   
   Navigate to the `sql_scripts` folder and execute the provided scripts in your PostgreSQL instance to create the required tables and seed data.

4. Start the server:
   ```bash
   npm start
   ```

---


## Environment Variables

The project uses environment variables to configure the API base URL. Ensure the `.env` file is correctly set up:

```env
   PORT=3000
   DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
   JWT_SECRET=<your-secret-key>
   ```
Currently i left a .env in the project with some API keys so you can use, they are all limited so if one stops working you can use the next one

---

## API Endpoints

you can see description on all endpoints in the api.yaml

---

## Notes on Database

The backend requires a PostgreSQL database. Refer to the `sql_scripts` folder for the SQL files to create the necessary tables and seed data. Update the `.env` file with the correct `DATABASE_URL` to connect to your instance.

---

The frontend for this application can be found at: [Recipes-Site-Front](https://github.com/manuelruff/Recipes-Site-Front).
