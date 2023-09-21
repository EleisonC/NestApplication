<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ride-Sharing API with NestJS

This project is a simplified version of a ride-sharing API built using NestJS. It includes features like user registration, ride requests, driver availability management, and authentication using JWT.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [Docker](https://www.docker.com/) (if you want to run the application using Docker)
- [PostgreSQL](https://www.postgresql.org/) (if you want to run the database locally)

## Database Setup

1. Create a PostgreSQL database with the following configurations:

   - Database name: `ride_sharing_db`
   - User: `postgres`
   - Password: `postgres`

   You can adjust these settings in the `.env` file if needed.

2. Ensure that the PostgreSQL service is running.

## Environment Configuration

1. Create a `.env` file in the root directory of the project based on the `.env.example` file.

2. Set the following environment variables in the `.env` file:

   ```
    DATABASE_NAME=ride_sharing_db
    HOST=localhost # remember to change this to the name of the docker container if using docker compose
    PORT=5432
    DATABASE_USER=postgres
    DATABASE_PASS=postgres
    JWT_SECRET=your-secret-key
   ```

   Replace `your-secret-key` with a strong secret key for JWT authentication.
   Replace `localhost` with your psql container name.(When using docker)

## Running the Application Locally

1. Install project dependencies:

   ```bash
   npm install
   ```

2. Start the application:

   ```bash
   npm run start:dev
   ```

   The application will be accessible at `http://localhost:3000`.

## Running the Application Using Docker

1. Ensure Docker is installed and the Docker daemon is running.

2. Build the Docker image:

   ```bash
   docker build -t ride-sharing-app .
   ```

3. Start the application using Docker Compose:

   ```bash
   docker-compose up
   ```

4. Incase of database connection issues, ensure the HOST variable in the .env file is set to the name  of the container running the postgress image check using 
    ```bash 
    docker ps
    ```

   The application will be accessible at `http://localhost:3000`.

## API Endpoints

- User registration: `/auth/register` (POST)
- User login: `/auth/login` (POST)
- Create a refresh token: `/auth/refresh` (POST)
- Create driver profile: `/drivers/register` (POST)
- Get my driver profile: `/drivers/profile` (POST)
- Delete my driver profile: `/drivers/profile/delete` (DELETE)
- Get my driver requests: `/ride-request/driver/requests` (GET)
- Get my ongoing driver requests: `/ride-request/driver/ongoing/requests` (GET)
- Get my consumer requests: `/ride-request/consumer/requests` (GET)
- Get my ongoing consumer requests: `/ride-request/consumer/ongoing/requests` (GET)
- Create a ride request: `/ride-request/create` (POST)
- List all ride requests: `/ride-requests` (GET)
- Accept a ride request: `/ride-request/driver/accept/request/:id` (PATCH)
- Complete a ride request: `/ride-request/driver/complete/request/:id` (PATCH)
- Cancel a ride request consumer: `/ride-request/consumer/cancel/request/:id` (PATCH)
- Cancel a ride request driver: `/ride-request/driver/cancel/request/:id` (PATCH)
- Toggle driver availability: `/drivers/profile/availability` (POST)

Please refer to the API code for more details on each endpoint.

## Security

- Passwords are securely hashed and stored in the database.
- JWT-based authentication is used for secure user authentication.
