<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# TesloDB API

## Project Setup Steps

1. Clone the repository
```bash
git clone <repository-url>
cd back-teslo-shop
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# Copy the environment variables template file
cp .env.template .env

# Edit the .env file with your environment variables
# Make sure to configure:
# - DATABASE_URL
# - JWT_SECRET
# - Other required variables
```

4. Start the database
```bash
# Start the database using Docker
docker-compose up -d
```

5. Start the development server
```bash
# Start the server in development mode
yarn start:dev
```

## Additional Notes
- Make sure you have Docker installed and running on your system
- The server will start by default at http://localhost:3000
- To stop the database: `docker-compose down`

## Database Seeding

To populate the database with initial data, you can use the seed command:

```bash
# Execute the seed command to populate the database with initial data
yarn seed
```

This will:
1. Delete all existing products in the database
2. Insert the initial set of products defined in the seed data
3. Return a success message when completed

Note: Make sure your database is running and properly configured before executing the seed command.

## Project Overview

TesloDB API is a RESTful API built with NestJS that manages a product catalog for an e-commerce store. The API provides endpoints to manage products with features like pagination, image handling, and data validation.

### Features
- Product management (CRUD operations)
- Image handling for products
- Pagination support
- Data validation
- PostgreSQL database integration
- Docker support for database
- Seed data for initial product population

### Available Endpoints

All endpoints are prefixed with `/api`

#### Products Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/products` | Get all products | Query params: `limit` (number), `offset` (number) |
| GET | `/products/:id` | Get a product by ID or slug | `id`: UUID or slug string |
| POST | `/products` | Create a new product | Body: Product data (title, price, description, etc.) |
| PATCH | `/products/:id` | Update a product | `id`: UUID, Body: Product data to update |
| DELETE | `/products/:id` | Delete a product | `id`: UUID |

#### Seed Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/seed` | Populate the database with initial product data |

### Product Data Structure

Products include the following fields:
- `title`: Product name (unique)
- `price`: Product price (positive number)
- `description`: Product description (optional)
- `slug`: URL-friendly identifier (auto-generated from title)
- `stock`: Available quantity
- `sizes`: Available sizes array
- `gender`: Product gender ('men', 'women', 'kid', 'unisex')
- `tags`: Product tags array
- `images`: Array of image URLs

### Data Validation
- All endpoints include input validation
- Product creation/updates require valid data types
- Gender field is restricted to specific values
- Prices must be positive numbers
- Required fields are enforced
