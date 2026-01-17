# EquiSport Server

A Node.js/Express backend server for the EquiSport application with MongoDB integration.

## 📁 Project Structure

```
ph-assignment-10-server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection setup
│   │   └── cors.js      # CORS configuration
│   ├── controllers/     # Business logic layer
│   │   ├── equipmentController.js
│   │   ├── categoryController.js
│   │   ├── reviewController.js
│   │   └── blogController.js
│   ├── routes/          # API route definitions
│   │   ├── equipmentRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── blogRoutes.js
│   ├── middleware/      # Custom middleware (future use)
│   └── app.js           # Express app configuration
├── data/                # Sample data and schemas
├── index.js             # Application entry point
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel deployment config
└── .env                 # Environment variables (not in git)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   DB_USER=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   PORT=3000
   ```

### Running the Application

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Equipment Routes

- `GET /equipments` - Get all equipment
- `GET /equipments/filter?email=` - Filter equipment by user email
- `GET /equipments/for-home` - Get limited equipment for home page
- `GET /equipments/sorted` - Get sorted equipment by rating and price
- `GET /equipments/search?q=` - Search equipment by name or category
- `GET /equipments/discounted` - Get discounted equipment
- `GET /equipments/category/:category` - Get equipment by category
- `GET /equipments/:id` - Get equipment by ID
- `POST /equipments` - Create new equipment
- `PUT /equipments/:id` - Update equipment
- `DELETE /equipments/:id` - Delete equipment

### Category Routes

- `GET /categories` - Get all categories with product count

### Review Routes

- `GET /reviews` - Get latest reviews for carousel

### Blog Routes

- `GET /blog-posts` - Get all blog posts
- `GET /blog-posts/:id` - Get blog post by ID

## 🏗️ Architecture

The application follows a **layered architecture** pattern:

- **Routes Layer**: Defines API endpoints and maps them to controllers
- **Controller Layer**: Contains business logic and handles requests/responses
- **Config Layer**: Manages database connections and app configuration
- **Middleware Layer**: (Ready for future custom middleware)

## 🛠️ Technologies

- **Express.js** - Web framework
- **MongoDB** - Database
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## 📦 Deployment

The application is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration.

To deploy:

```bash
vercel
```

## 🔒 Environment Variables

| Variable      | Description                 |
| ------------- | --------------------------- |
| `DB_USER`     | MongoDB Atlas username      |
| `DB_PASSWORD` | MongoDB Atlas password      |
| `PORT`        | Server port (default: 3000) |

## 📝 Notes

- The MongoDB connection is configured for serverless environments (connection pooling is handled by MongoDB driver)
- All routes include proper error handling
- Route ordering is important (specific routes before parameterized routes)
