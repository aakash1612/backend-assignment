# Waygood Study Abroad Platform – Backend Assignment

This project is a backend-focused MERN assignment for a study-abroad platform inspired by Waygood's student discovery and application workflow ecosystem.

The platform allows students to:
- discover universities and programs
- receive personalized recommendations
- manage study-abroad applications
- track application workflow progress

---

# Implemented Features

## 1. Authentication & Authorization

Implemented secure JWT-based authentication system with role support for students and counselors.

### Features
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected authentication middleware
- Role support for:
  - student
  - counselor

### Implemented APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

---

## 2. Advanced University & Program Discovery

Enhanced:
- `GET /api/universities`
- `GET /api/programs`

### Features Added
- filtering by:
  - country
  - intake
  - degree level
  - scholarship availability
  - tuition budget
- search functionality
- dynamic sorting
- pagination metadata
- frontend-friendly response structure

### Example Query

```http
GET /api/programs?
country=Canada&
degreeLevel=master&
minTuition=10000&
maxTuition=30000&
search=computer&
sortBy=tuitionFeeUsd&
sortOrder=asc&
page=1&
limit=10
```

---

## 3. MongoDB Aggregation Recommendation Engine

Implemented:
- `GET /api/recommendations/:studentId`

### Recommendation Scoring Factors
- preferred countries
- interested fields
- tuition budget
- preferred intake
- IELTS score

### Aggregation Pipeline Usage

The recommendation engine uses:
- `$match`
- `$addFields`
- `$cond`
- `$sort`
- `$project`

### Recommendation Response Includes
- match score
- recommendation reasons/explanations

---

## 4. Application Workflow System

Implemented:
- `POST /api/applications`
- `PATCH /api/applications/:id/status`

### Features
- duplicate application prevention
- valid workflow transition enforcement
- timeline/history tracking
- application lifecycle management

### Workflow States

```text
draft
→ submitted
→ under-review
→ offer-received
→ visa-processing
→ enrolled
```

Rejected applications terminate the workflow.

---

## 5. Performance Optimizations

### Caching

Implemented in-memory caching for:
- `GET /api/universities/popular`

Features:
- TTL-based cache expiration
- reduced repeated database queries

### MongoDB Indexes

Indexes added for:
- country
- degreeLevel
- tuitionFeeUsd
- popularScore
- application status

Text indexes added for search-heavy queries.

### Query Optimizations
- `.lean()` used for read-heavy endpoints
- pagination added to avoid loading large datasets
- aggregation pipeline reduces application-side computation

---

## 6. Testing

Implemented tests for:
- authentication flow
- application workflow
- duplicate application edge case

### Run Tests

```bash
npm test
```

---

# Architecture Notes

The backend follows a layered architecture:

```text
Routes → Controllers → Services → Models
```

---

## Design Decisions

### Authentication
- JWT middleware-based authentication
- bcrypt password hashing
- role-based user structure

### Recommendation Engine
- aggregation-based recommendation scoring
- database-side computation for scalability

### Workflow Management
- state-machine style workflow transitions
- audit timeline/history tracking

### Performance
- in-memory cache chosen for assignment simplicity
- indexes optimized for filtering and search queries

---

# Tradeoffs & Assumptions

## In-Memory Cache

### Advantages
- simple setup
- fast response times

### Limitations
- cache resets on server restart
- not distributed across multiple instances

---

## Recommendation Scoring

Recommendation weights are currently rule-based and configurable.

In production, these could be enhanced further using:
- analytics
- personalization
- ML-based recommendation systems

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Environment Variables

Create `.env` file:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/waygood-evaluation
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1d
CACHE_TTL_SECONDS=300
```

---

## 4. Seed Database

```bash
npm run seed
```

---

## 5. Start Backend Server

```bash
npm run dev
```

---

# Sample Seed Credentials

```text
aarav@example.com / Candidate123!
sara@example.com / Candidate123!
counselor@example.com / Candidate123!
```

---

# API Highlights

## Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

---

## Universities
- `GET /api/universities`
- `GET /api/universities/popular`

---

## Programs
- `GET /api/programs`

---

## Recommendations
- `GET /api/recommendations/:studentId`

---

## Applications
- `GET /api/applications`
- `POST /api/applications`
- `PATCH /api/applications/:id/status`

---

# Performance & Scalability Considerations

- MongoDB aggregation used for recommendation ranking
- compound indexes improve filtering performance
- pagination prevents large payload responses
- `.lean()` reduces Mongoose overhead
- caching minimizes repeated DB queries

---

# Future Improvements

Potential future enhancements:
- Redis-based distributed caching
- AI-powered recommendation personalization
- Dockerized deployment
- rate limiting
- request logging
- RBAC enhancements
- frontend dashboard integration