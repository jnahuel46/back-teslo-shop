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

## Authentication System

### Overview
The authentication system is implemented using JWT (JSON Web Tokens) with Passport.js strategy. The system includes:

- User registration
- User login
- JWT token validation
- Protected routes
- User role management

### Authentication Flow

1. **Registration Process**
   - Endpoint: `POST /auth/register`
   - Validates user data (email, password, etc.)
   - Hashes password using bcrypt
   - Creates new user in database
   - Returns user data (excluding password)

2. **Login Process**
   - Endpoint: `POST /auth/login`
   - Validates credentials
   - Generates JWT token
   - Returns token and user data

3. **JWT Strategy Implementation**
   - Uses `@nestjs/passport` and `passport-jwt`
   - Validates tokens from Authorization header
   - Verifies user existence and active status
   - Attaches user to request object

4. **Protected Routes**
   - Uses `@Auth()` decorator for route protection
   - Validates JWT token on each request
   - Provides user context through `@GetUser()` decorator

### Key Components

#### JWT Strategy (`src/auth/strategies/jwt.strategy.ts`)
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Validates JWT tokens and retrieves user
  // Uses user ID for validation
  // Checks user active status
}
```

#### GetUser Decorator (`src/auth/decorators/get-user.decorator.ts`)
```typescript
export const GetUser = createParamDecorator(
  // Extracts user from request
  // Can return full user object or specific properties
  // Throws error if user not found
);
```

### Environment Variables
Required environment variables for authentication:
```env
JWT_SECRET=your_jwt_secret_key
```

### Usage Examples

1. **Protecting Routes**
```typescript
@Controller('users')
export class UsersController {
  @Get('profile')
  @Auth()
  getProfile(@GetUser() user: User) {
    return user;
  }
}
```

2. **Getting Specific User Data**
```typescript
@Get('email')
@Auth()
getEmail(@GetUser('email') email: string) {
  return email;
}
```

### Security Features

- Password hashing with bcrypt
- JWT token validation
- User active status verification
- Protected routes with authentication guard
- Environment variable configuration

## Database

### User Entity
- Email (unique)
- Password (hashed)
- Full name
- Active status
- Roles
- Created/Updated timestamps

## API Endpoints

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/check-status` - Verify authentication status

### Protected Endpoints
- `GET /users/profile` - Get user profile
- Other endpoints requiring authentication

## Development

### Prerequisites
- Node.js
- PostgreSQL
- NestJS CLI

### Installation
```bash
npm install
```

### Running the Application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Project Structure
```
src/
├── auth/
│   ├── decorators/
│   │   └── get-user.decorator.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── dto/
│   ├── entities/
│   └── auth.service.ts
├── users/
└── ...
```

## Future Improvements
- [ ] Add refresh token mechanism
- [ ] Implement password reset functionality
- [ ] Add rate limiting for auth endpoints
- [ ] Implement 2FA
- [ ] Add session management

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Swagger Documentation (API Docs)

The API includes interactive documentation automatically generated with Swagger. You can access the graphical interface to explore and test the API endpoints.

- **Documentation URL:**
  
  [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

- **Features:**
  - View all available endpoints
  - Interactive testing for each endpoint (JWT token required for protected routes)
  - Data models and request/response examples
å