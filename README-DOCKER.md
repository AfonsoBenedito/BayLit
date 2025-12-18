# BayLit Docker Setup

This project has been configured to run entirely in Docker Compose without external dependencies like AWS, Google OAuth, or MongoDB Atlas.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Initialize the database:**
   
   The database should automatically initialize when you first start the containers. However, if you need to manually initialize:
   
   ```bash
   # Comprehensive initialization (recommended - does everything)
   # This initializes admin user, categories, subcategories, attributes, and products
   docker-compose exec backend node db/init-all.js
   
   # Or initialize separately:
   # Initialize admin user (optional)
   docker-compose exec backend node db/init-db.js
   
   # Initialize categories with placeholder images (data URIs)
   docker-compose exec backend node db/init-categories.js
   
   # Initialize mock products (required for products to show in categories)
   docker-compose exec backend node db/init-products.js
   ```
   
   **Note:** After `docker compose down -v`, the database is wiped. The containers will automatically reinitialize on startup, but if products don't appear, run `docker-compose exec backend node db/init-all.js` manually.

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Services

- **MongoDB**: Database running on port 27017
- **Backend**: Node.js API running on port 8080
- **Frontend**: React app served by Nginx on port 3000

## Default Credentials

- MongoDB:
  - Username: `admin`
  - Password: `admin123`
  - Database: `Baylit`

- Admin User (if initialized):
  - Username: `admin`
  - Password: `admin123`

## Changes Made for Docker

1. **Removed External Dependencies:**
   - Google OAuth authentication (disabled)
   - AWS SES email service (replaced with console logging)
   - AWS S3 file storage (replaced with local file storage)
   - MongoDB Atlas (replaced with local MongoDB)
   - Stripe payments (mocked)

2. **File Storage:**
   - Files are now stored locally in `Back-End/uploads/`
   - Served via Express static file serving

3. **Email Service:**
   - Emails are logged to console instead of being sent
   - Check backend logs to see email content

4. **Database:**
   - Local MongoDB instance
   - Automatic initialization on first run

## Development

To rebuild after code changes:
```bash
docker-compose up -d --build
```

To view logs:
```bash
docker-compose logs -f
```

To stop all services:
```bash
docker-compose down
```

To remove all data (including database):
```bash
docker-compose down -v
```

## Notes

- Google OAuth routes return 503 errors (service unavailable)
- Email verification links use `http://localhost:3000` instead of production URLs
- File uploads are stored in the `uploads` directory and served at `/uploads/*`
- All external service calls have been mocked or disabled
- Categories include placeholder images from placeholder.com service
- The `init-all.js` script initializes admin user, categories with images, subcategories, and attributes

