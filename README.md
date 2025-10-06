# Aragon Backend

A robust task management system built with Node.js, TypeScript, Express, and PostgreSQL. This backend provides a complete API for managing boards and tasks with user authentication and comprehensive validation.

## 🚀 Features

- **Board Management**: Create, read, update, and delete boards
- **Task Management**: Full CRUD operations for tasks with status tracking
- **User-based Visibility**: Smart filtering based on user relationships
- **Task Status Tracking**: Pending, In Progress, and Completed states
- **Search & Filter**: Search tasks and boards with flexible filtering
- **Input Validation**: Comprehensive request validation using Joi
- **Soft Deletes**: Data integrity with audit trails
- **TypeScript**: Full type safety and modern development experience
- **Layered Architecture**: Clean separation of concerns (Controller → Service → Database)

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Development](#development)

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Validation**: Joi
- **Date Handling**: Moment.js
- **Logging**: Pino & Morgan
- **Development**: Nodemon, Concurrently

## 📁 Project Structure

```
aragon-be/
├── src/
│   ├── boards/                    # Board module
│   │   ├── controller.ts          # Board controllers
│   │   ├── db.ts                  # Board database operations
│   │   ├── helper.ts              # Board helper functions
│   │   ├── routes.ts              # Board API routes
│   │   ├── service.ts             # Board business logic
│   │   ├── validation.ts          # Board input validation
│   │   └── types/
│   │       ├── enums.ts           # Board enums
│   │       └── interface.ts       # Board TypeScript interfaces
│   ├── tasks/                     # Task module
│   │   ├── controller.ts          # Task controllers
│   │   ├── db.ts                  # Task database operations
│   │   ├── helper.ts              # Task helper functions (slug generation)
│   │   ├── routes.ts              # Task API routes
│   │   ├── service.ts             # Task business logic
│   │   ├── validation.ts          # Task input validation
│   │   └── types/
│   │       ├── enums.ts           # Task enums (TaskStatus)
│   │       └── interface.ts       # Task TypeScript interfaces
│   ├── config/
│   │   └── postgres.ts            # PostgreSQL configuration
│   ├── routes/
│   │   └── index.routes.ts        # Main route aggregator
│   ├── utils/
│   │   ├── auth.middleware.ts     # Authentication middleware (mock)
│   │   ├── custom.error.handler.ts # Custom error handling
│   │   ├── error.handler.ts       # Error handler class
│   │   └── logger.ts              # Logging configuration
│   └── index.ts                   # Application entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by BIGINT,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by BIGINT
);
```

### Boards Table
```sql
CREATE TABLE boards (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by BIGINT,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by BIGINT
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    board_id BIGINT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assignee_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by BIGINT REFERENCES users(id)
);
```

### Performance Indexes
```sql
-- Performance optimization indexes
CREATE INDEX idx_tasks_board ON tasks (board_id);
CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_assignee ON tasks (assignee_id);
CREATE INDEX idx_tasks_search_title ON tasks USING gin (title gin_trgm_ops);
CREATE INDEX idx_tasks_search_desc ON tasks USING gin (description gin_trgm_ops);
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication
All endpoints require authentication. Currently using mock authentication middleware that adds `user_id: 2` to all requests.

---

## 🏗 Board APIs

### 1. Get All Boards
**GET** `/boards`

**Request Body:**
```json
{
  "user_id": 2
}
```

**Query Parameters:**
- `search` (optional): Search in board name or description

**Response:**
```json
{
  "success": true,
  "message": "Boards fetched successfully.",
  "data": [
    {
      "id": 1,
      "name": "Project Alpha",
      "description": "Main project board",
      "created_by": { "id": 1, "name": "John Doe", "email": "john@example.com" },
      "updated_by": { "id": 1, "name": "John Doe", "email": "john@example.com" },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "task_count": 5
    }
  ]
}
```

### 2. Get Board by ID
**GET** `/boards/:id`

**Response:**
```json
{
  "success": true,
  "message": "Board fetched successfully.",
  "data": {
    "id": 1,
    "name": "Project Alpha",
    "description": "Main project board",
    "created_by": 1,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 3. Create Board
**POST** `/boards`

**Request Body:**
```json
{
  "name": "New Project Board",
  "description": "Board for new project",
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Board created successfully."
}
```

### 4. Update Board
**PATCH** `/boards/:id`

**Request Body:**
```json
{
  "name": "Updated Board Name",
  "description": "Updated description",
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Board updated successfully."
}
```

### 5. Delete Board
**DELETE** `/boards/:id`

**Request Body:**
```json
{
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Board deleted successfully."
}
```

---

## 📝 Task APIs

### 1. Get All Tasks (Grouped by Status)
**GET** `/tasks/board/:board_id`

**Query Parameters:**
- `search` (optional): Search in task title or description
- `filter_user_id` (optional): Filter by user who created/updated tasks

**Response:**
```json
{
  "success": true,
  "message": "Tasks fetched successfully.",
  "data": {
    "tasks": {
      "pending": [
        {
          "id": 1,
          "title": "Setup Database",
          "description": "Configure PostgreSQL",
          "status": "pending",
          "created_by": { "id": 1, "name": "John", "email": "john@example.com" },
          "created_at": "2024-01-01T00:00:00Z"
        }
      ],
      "in_progress": [...],
      "completed": [...]
    },
    "counts": {
      "pending": 5,
      "in_progress": 3,
      "completed": 7
    },
    "total": 15
  }
}
```

### 2. Create Task
**POST** `/tasks`

**Request Body:**
```json
{
  "board_id": 1,
  "title": "New Task",
  "description": "Task description",
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully."
}
```

### 3. Update Task
**PATCH** `/tasks/:id`

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "in_progress",
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully."
}
```

### 4. Update Task Status Only
**PATCH** `/tasks/status/:id`

**Request Body:**
```json
{
  "status": "completed",
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task status updated successfully."
}
```

### 5. Delete Task
**DELETE** `/tasks/:id`

**Request Body:**
```json
{
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully."
}
```

---

## ⚙️ Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd aragon-be
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up the database**
```bash
# Create a PostgreSQL database
createdb aragon_db

# Run the schema creation scripts
psql -d aragon_db -f schema.sql
```

4. **Configure environment variables**
```bash
cp .env.example .env.local
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aragon_db
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=4000
NODE_ENV=development

# Security (for production)
JWT_SECRET=your_jwt_secret_key
BCRYPT_ROUNDS=12
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

### Production Mode
```bash
# Build the application
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run pretty` - Format code with Prettier

## 🏗 Development

### Architecture

The application follows a **layered architecture** pattern:

1. **Controller Layer** (`controller.ts`): Handles HTTP requests/responses
2. **Service Layer** (`service.ts`): Contains business logic
3. **Database Layer** (`db.ts`): Database operations
4. **Validation Layer** (`validation.ts`): Input validation using Joi

### Key Features

#### Task Status Management
Tasks can have three statuses:
- `pending` - Initial state
- `in_progress` - Work in progress
- `completed` - Task finished

#### Smart Board Visibility
Boards are visible to users who:
- Created the board, OR
- Have tasks in the board (created or updated)

#### Automatic Slug Generation
Tasks get unique slugs generated from board name + random numbers:
- Format: `{FIRST_3_CHARS}-{4_RANDOM_DIGITS}`
- Example: "My Project" → `MYP-1234`

#### Soft Deletes
All entities use soft deletes:
- Records are marked with `deleted_at` timestamp
- Original data preserved for audit trails
- Queries automatically filter deleted records

#### Comprehensive Validation
- **Joi schemas** for all endpoints
- **Type validation** with TypeScript interfaces
- **Business rule validation** in service layer

## 🔒 Security Considerations

**Current Implementation (Development):**
- Mock authentication middleware
- No password hashing
- No JWT tokens

**Production Recommendations:**
- Implement proper JWT authentication
- Add password hashing with bcrypt
- Add rate limiting
- Implement CORS properly
- Add request sanitization
- Use environment variables for secrets

## 🧪 Testing

The project structure supports easy testing:

```bash
# Add your test framework of choice
npm install --save-dev jest @types/jest

# Example test structure
src/
├── boards/
│   ├── controller.test.ts
│   ├── service.test.ts
│   └── db.test.ts
```

## 📈 Performance Optimizations

- **Database indexes** for frequently queried fields
- **Efficient queries** with proper JOINs
- **Pagination support** (ready to implement)
- **Connection pooling** in PostgreSQL configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

---

**Built with ❤️ using Node.js, TypeScript, and PostgreSQL**