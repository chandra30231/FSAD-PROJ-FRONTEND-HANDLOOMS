# Handloom Marketplace Backend

This folder contains a Spring Boot backend for the handloom marketplace frontend.

## Stack

- Spring Boot `3.5.14`
- Spring Web
- Spring Data JPA
- MySQL 8+
- Java 17+

## Features Implemented

- Buyer / artisan self-registration
- Login for buyer, artisan, admin, and marketing specialist
- Admin user listing, status update, and deletion
- Public product catalog APIs
- Artisan product management APIs
- Buyer checkout and order creation
- Artisan and buyer order tracking APIs
- Marketing campaign APIs
- Platform and marketing metrics APIs
- Demo data seeding that matches the frontend demo accounts

## Project Structure

- `src/main/java/com/handloom/marketplace/controller` : REST controllers
- `src/main/java/com/handloom/marketplace/service` : business logic
- `src/main/java/com/handloom/marketplace/model` : JPA entities and enums
- `src/main/java/com/handloom/marketplace/repository` : database repositories
- `src/main/resources/application.properties` : MySQL and Spring config

## MySQL Configuration

The backend reads these environment variables:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SERVER_PORT`
- `APP_CORS_ALLOWED_ORIGINS`

Default values already point to:

```properties
jdbc:mysql://localhost:3306/handloom_marketplace?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
username=root
password=root
port=8080
```

## Start MySQL with Docker

If Docker is available on your machine:

```bash
cd backend
docker compose up -d
```

## Run the Backend

This project currently includes `pom.xml`, but Maven is not installed in the current Codex machine session, so I could not run the backend here.

On your machine, run:

```bash
cd backend
mvn spring-boot:run
```

Or package it:

```bash
cd backend
mvn clean package
java -jar target/handloom-marketplace-backend-0.0.1-SNAPSHOT.jar
```

## Base URL

```text
http://localhost:8080
```

## Important API Endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`

### Users / Admin

- `GET /api/users`
- `PATCH /api/users/{userId}/status`
- `DELETE /api/users/{userId}`

### Products

- `GET /api/products/public`
- `GET /api/products/{productId}`
- `GET /api/products/artisan/{artisanId}`
- `POST /api/products/artisan/{artisanId}`
- `PUT /api/products/artisan/{artisanId}/{productId}`
- `DELETE /api/products/artisan/{artisanId}/{productId}`

### Orders

- `GET /api/orders`
- `GET /api/orders/buyer/{buyerId}`
- `GET /api/orders/artisan/{artisanId}`
- `POST /api/orders/checkout`
- `PATCH /api/orders/{orderId}/status`

### Campaigns

- `GET /api/campaigns`
- `POST /api/campaigns`

### Metrics

- `GET /api/metrics/platform`
- `GET /api/metrics/marketing`

## Demo Accounts Seeded

- Buyer: `buyer@handlooms.com` / `buyer`
- Artisan: `raju@handlooms.com` / `artisan`
- Admin: `admin@handlooms.com` / `admin`
- Marketing: `marketing@handlooms.com` / `marketing`

## Next Integration Step

The frontend is still using local storage right now. The clean next step is to replace `src/services/platformStore.js` and `src/services/api.js` with real API calls to this backend.
