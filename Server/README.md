# Travel Agency Backend

A production-grade backend API for a travel agency built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Tour Management** - CRUD operations for tours with advanced filtering and search
- **Booking System** - Complete booking management with availability tracking
- **Review System** - User reviews and ratings for tours
- **Security** - Helmet, CORS, rate limiting, input validation
- **Error Handling** - Comprehensive error handling middleware
- **Logging** - Morgan logging with different levels for dev/prod
- **Database** - MongoDB with Mongoose ODM
- **Validation** - Joi schema validation for all inputs
- **API Documentation** - RESTful API with consistent response format

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit
- **Password Hashing**: bcryptjs
- **Logging**: Morgan
- **Environment**: dotenv

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

5. Update the environment variables in `.env`

6. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

See `.env.example` for all required environment variables.

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user

### Users (Admin only)

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/profile` - Update profile
- `PUT /api/v1/users/change-password` - Change password
- `DELETE /api/v1/users/:id` - Delete user

### Tours

- `GET /api/v1/tours` - Get all tours (public)
- `GET /api/v1/tours/featured` - Get featured tours (public)
- `GET /api/v1/tours/:id` - Get single tour (public)
- `POST /api/v1/tours` - Create tour (admin)
- `PUT /api/v1/tours/:id` - Update tour (admin)
- `DELETE /api/v1/tours/:id` - Delete tour (admin)

### Bookings

- `GET /api/v1/bookings/user/me` - Get user bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/:id` - Get single booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Delete booking
- `GET /api/v1/bookings` - Get all bookings (admin)

## Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... }, // for list endpoints
  "message": "..." // for non-data responses
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes per IP)
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention (MongoDB)
- XSS protection

## Database Models

- **User**: User accounts with authentication
- **Tour**: Tour packages with details, pricing, availability
- **Booking**: Tour bookings with participant info
- **Review**: User reviews and ratings

## Error Handling

The API includes comprehensive error handling:

- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Server errors

All errors are logged and returned in a consistent format.

## Development

### Project Structure

```
src/
├── app.js              # Express app configuration
├── index.js            # Server entry point
├── config/
│   └── database.js     # Database connection
├── controllers/        # Route controllers
├── models/            # Mongoose models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── DTOs/              # Data validation schemas
└── services/          # Business logic services
```

### Code Quality

- ESLint for code linting
- Consistent code formatting
- Input validation on all endpoints
- Error handling in all controllers
- Security best practices

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set strong JWT secrets
4. Configure proper CORS origins
5. Use a process manager like PM2
6. Set up monitoring and logging
7. Configure SSL/TLS

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Create descriptive commit messages

## License

ISC
