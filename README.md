# Procurement System

A full-stack production-ready procurement automation system built for Ella (Emmanuella Nana Ama Weir). This system provides a complete workflow for managing procurement requests, approvals, and purchase orders with role-based access control and audit logging.

## 🏗️ Architecture Overview

The system follows a modern three-tier architecture:

- **Frontend**: Vue 3 + Vite SPA with Pinia state management
- **Backend**: Node.js + Express REST API with JWT authentication
- **Database**: MongoDB for data persistence
- **Infrastructure**: Docker Compose for local development, GitHub Actions for CI/CD

See [System Architecture Diagram](diagrams/ella_system_architecture.mmd) for a visual representation.

## 🌟 Features

### Core Functionality
- **Request Management**: Submit, view, and track procurement requests
- **Approval Workflow**: Department heads can approve or reject requests
- **Purchase Orders**: Procurement officers can create and manage POs
- **Delivery Tracking**: Mark purchase orders as delivered
- **User Management**: Admin can manage users and roles

### Security & Compliance
- JWT-based authentication with secure token management
- Role-based access control (RBAC) with 4 roles: requester, dept_head, procurement, admin
- Comprehensive audit logging for all state changes
- Input validation with Joi
- OWASP best practices: Helmet, rate limiting, CORS protection
- Security headers and CSP policies

### Developer Experience
- OpenAPI/Swagger documentation at `/docs`
- Automated CI/CD pipeline with GitHub Actions
- Docker Compose for one-command local setup
- Hot-reload in development mode
- Comprehensive seed data for testing

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **Docker**: v20.10 or higher
- **Docker Compose**: v2.0 or higher
- **Git**: For version control

## 🚀 Quick Start with Docker Compose

The fastest way to get the system running:

```bash
# Clone the repository
git clone https://github.com/Afetorisaac/Field-Trip-Report.git
cd Field-Trip-Report

# Start all services (backend, frontend, MongoDB)
docker-compose up -d

# Wait for services to be healthy (check with)
docker-compose ps

# Seed the database with demo data
docker-compose exec backend npm run seed

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# API Documentation: http://localhost:4000/docs
```

### Demo Login Credentials

After seeding, use these credentials to log in:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@ella.com | admin123 | Full system access |
| Ella (Requester) | ella@ella.com | ella123 | Submit and view own requests |
| Dept Head | depthead@ella.com | dept123 | Approve/reject requests in department |
| Procurement | procurement@ella.com | proc123 | Create POs and mark delivered |
| John (Requester) | john.doe@ella.com | john123 | Submit and view own requests |
| IT Head | it.head@ella.com | head123 | Approve/reject IT department requests |

## 💻 Local Development Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your local MongoDB connection
# For local MongoDB: MONGODB_URI=mongodb://localhost:27017/ella_procurement

# Start development server (with hot reload)
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Seed database
npm run seed
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Manual MongoDB Setup

If not using Docker for MongoDB:

```bash
# Install MongoDB locally or use MongoDB Atlas
# Update backend/.env with your connection string

# Example for local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ella_procurement

# Example for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ella_procurement
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
# Server Configuration
PORT=4000                          # API server port
NODE_ENV=development              # development | production

# MongoDB Configuration
MONGODB_URI=mongodb://mongo:27017/ella_procurement

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d                     # Token expiration time

# CORS Configuration
CORS_ORIGIN=http://localhost:3000  # Frontend URL

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000       # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100       # Max requests per window

# Logging
LOG_LEVEL=info                    # error | warn | info | debug
```

### Frontend Environment Variables

The frontend uses Vite environment variables. Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:4000/api
```

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:4000/api`
- **Documentation**: `http://localhost:4000/docs` (Swagger UI)

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Request Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/requests` | Create new request | Yes | All |
| GET | `/api/requests` | List requests | Yes | All |
| GET | `/api/requests/:id` | Get request details | Yes | All |
| POST | `/api/requests/:id/approve` | Approve request | Yes | dept_head, admin |
| POST | `/api/requests/:id/reject` | Reject request | Yes | dept_head, admin |

### Purchase Order Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/requests/:id/create-po` | Create PO | Yes | procurement, admin |
| GET | `/api/po` | List POs | Yes | procurement, admin |
| GET | `/api/po/:id` | Get PO details | Yes | procurement, admin |
| POST | `/api/po/:id/mark-delivered` | Mark delivered | Yes | procurement, admin |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/users` | List all users | Yes | admin |
| GET | `/api/users/:id` | Get user details | Yes | admin |
| PUT | `/api/users/:id` | Update user | Yes | admin |
| DELETE | `/api/users/:id` | Deactivate user | Yes | admin |

### API Request Examples

#### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ella@ella.com",
    "password": "ella123"
  }'
```

#### Create Request (with token)
```bash
curl -X POST http://localhost:4000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Office Supplies",
    "description": "Need office supplies for Q1",
    "items": [
      {
        "name": "Pens",
        "quantity": 100,
        "estimatedPrice": 0.5,
        "unit": "pcs"
      }
    ],
    "priority": "medium"
  }'
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
```

### Frontend Tests
```bash
cd frontend
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
```

### Integration Testing with Docker
```bash
# Start services
docker-compose up -d

# Run backend tests in container
docker-compose exec backend npm test

# Run frontend tests in container
docker-compose exec frontend npm test
```

## 🔐 Security Considerations

### Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Use environment-specific MongoDB credentials
- [ ] Enable HTTPS/TLS for all connections
- [ ] Configure proper CORS origins
- [ ] Review and adjust rate limiting settings
- [ ] Enable MongoDB authentication
- [ ] Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategies
- [ ] Review and update security headers
- [ ] Implement API versioning
- [ ] Add request/response logging
- [ ] Set up error tracking (Sentry, etc.)

### Security Features Implemented

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Rate limiting to prevent abuse
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Audit logging for accountability
- ✅ MongoDB injection prevention
- ✅ XSS protection

## 📊 Database Schema

### Collections

1. **users**: User accounts with roles and authentication
2. **requests**: Procurement requests with items and status
3. **purchaseorders**: Purchase orders linked to requests
4. **auditlogs**: Audit trail of all system changes

See the models in `backend/src/models/` for detailed schema definitions.

## 🔄 Procurement Workflow

1. **Submit Request**: Requester creates a procurement request with items
2. **Department Approval**: Department head reviews and approves/rejects
3. **Create PO**: Procurement officer creates purchase order for approved requests
4. **Delivery**: Procurement marks PO as delivered
5. **Audit Trail**: All actions are logged for compliance

See [Sequence Diagram](diagrams/ella_sequence.mmd) for detailed workflow.

## 🛠️ CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push and pull request:

- **Backend CI**:
  - Lint checking
  - Unit tests
  - Build verification

- **Frontend CI**:
  - Lint checking
  - Unit tests
  - Production build

- **Docker Build**:
  - Build backend Docker image
  - Build frontend Docker image

## 📁 Project Structure

```
.
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, audit
│   │   ├── config/          # Configuration files
│   │   └── index.js         # Main application file
│   ├── seed/                # Database seeding scripts
│   ├── tests/               # Unit tests
│   ├── swagger.yaml         # OpenAPI specification
│   ├── Dockerfile           # Backend container
│   └── package.json
├── frontend/                # Vue 3 + Vite SPA
│   ├── src/
│   │   ├── views/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── router/          # Vue Router configuration
│   │   ├── store/           # Pinia store
│   │   ├── api/             # API client
│   │   ├── App.vue          # Root component
│   │   └── main.js          # Application entry
│   ├── tests/               # Unit tests
│   ├── Dockerfile           # Frontend container
│   ├── nginx.conf           # Nginx configuration
│   └── package.json
├── diagrams/                # Mermaid architecture diagrams
│   ├── ella_system_architecture.mmd
│   ├── ella_sequence.mmd
│   └── ella_use_case.mmd
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI pipeline
├── docker-compose.yml       # Multi-container setup
└── README.md               # This file
```

## 🚢 Production Deployment

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment-Specific Configuration

Create separate compose files for different environments:
- `docker-compose.yml` - Development
- `docker-compose.prod.yml` - Production
- `docker-compose.test.yml` - Testing

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check MongoDB connection
docker-compose logs mongo

# Check backend logs
docker-compose logs backend

# Restart services
docker-compose restart
```

**Frontend can't connect to backend:**
```bash
# Verify backend is running
curl http://localhost:4000/health

# Check network connectivity
docker-compose exec frontend ping backend

# Check CORS settings in backend/.env
```

**Database connection errors:**
```bash
# Ensure MongoDB is running
docker-compose ps mongo

# Check MongoDB health
docker-compose exec mongo mongosh --eval "db.runCommand({ ping: 1 })"

# Reset MongoDB data (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ella (Emmanuella Nana Ama Weir)** - System Specification
- **Development Team** - Implementation

## 🙏 Acknowledgments

- Report 1 specification for system requirements
- Node.js and Vue.js communities
- MongoDB documentation and best practices
- OWASP security guidelines

## 📞 Support

For issues, questions, or contributions:
- Create an issue in the GitHub repository
- Check the [API Documentation](http://localhost:4000/docs) when running locally
- Review the [diagrams](diagrams/) for system understanding

---

**Note**: This is a production-ready system designed for procurement automation. Always use proper security measures, change default secrets, and follow security best practices when deploying to production environments.
