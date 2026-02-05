# Backend Architecture Design
## Civil Construction Calculator Application

---

## 1. RECOMMENDED BACKEND STACK

### **Choice: Node.js + NestJS + TypeScript**

### **Justification:**

1. **NestJS Advantages:**
   - **Enterprise-grade structure**: Built-in dependency injection, modular architecture, and clear separation of concerns
   - **TypeScript-first**: Type safety reduces bugs and improves maintainability
   - **Scalability**: Designed for large applications with growth potential
   - **Built-in features**: Validation, authentication, caching, logging out of the box
   - **Testing**: Excellent testing support with Jest integration
   - **Documentation**: Auto-generated API docs with Swagger

2. **Why not Express?**
   - Express requires manual setup for validation, DI, and structure
   - More boilerplate code for enterprise features
   - Less opinionated, leading to inconsistent patterns

3. **Why not Next.js API Routes?**
   - Next.js is optimized for full-stack React apps
   - This is a separate backend service (better separation of concerns)
   - More flexibility for future mobile app support
   - Better for microservices architecture if needed later

4. **Technology Stack:**
   - **Runtime**: Node.js 18+ (LTS)
   - **Framework**: NestJS 10+
   - **Language**: TypeScript 5+
   - **Database**: MySQL 8.0+
   - **ORM**: TypeORM (excellent MySQL support, migrations, relations)
   - **Cache**: Redis (for search indexing and frequently accessed data)
   - **Validation**: class-validator + class-transformer
   - **API Docs**: Swagger/OpenAPI
   - **Logging**: Winston + NestJS Logger
   - **Error Tracking**: Sentry (optional)

---

## 2. HIGH-LEVEL ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  React Frontend (Existing) │ Future Mobile App │ API Clients │
└────────────────────────────┬────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │
┌─────────────────────────────▼────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NestJS Application (Main Entry Point)                │  │
│  │  - CORS, Rate Limiting, Request Validation            │  │
│  │  - Authentication/Authorization (if needed)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌────────▼────────┐
│  CONTROLLERS   │  │    SERVICES       │  │   REPOSITORIES  │
│  (HTTP Layer)  │  │  (Business Logic) │  │  (Data Access)   │
│                │  │                   │  │                  │
│ - Calculator   │  │ - Calculator      │  │ - Calculator     │
│ - Category     │  │ - Category        │  │ - Category       │
│ - Search       │  │ - Search          │  │ - Search Index   │
│ - Content      │  │ - Content         │  │ - Content        │
│ - Admin        │  │ - Admin           │  │ - Admin          │
└───────┬────────┘  └─────────┬────────┘  └────────┬────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────▼─────────────────────┐
        │         DATA ACCESS LAYER                  │
        │  ┌──────────────────────────────────────┐ │
        │  │  TypeORM (ORM)                       │ │
        │  │  - Entity Models                      │ │
        │  │  - Query Builder                     │ │
        │  │  - Migrations                        │ │
        │  └──────────────────────────────────────┘ │
        └─────────────────────┬─────────────────────┘
                              │
        ┌─────────────────────▼─────────────────────┐
        │         PERSISTENCE LAYER                   │
        │  ┌──────────────┐  ┌────────────────────┐  │
        │  │   MySQL 8.0  │  │   Redis Cache      │  │
        │  │  (Primary)   │  │   (Search Index)   │  │
        │  └──────────────┘  └────────────────────┘  │
        └─────────────────────────────────────────────┘

Additional Services:
┌─────────────────────────────────────────────────────────┐
│  - Background Jobs (Bull Queue) for search indexing    │
│  - File Storage (if needed for calculator configs)     │
│  - Monitoring & Logging (Winston, Sentry)               │
│  - Health Checks & Metrics                             │
└─────────────────────────────────────────────────────────┘
```

---

## 3. DETAILED FOLDER STRUCTURE

```
backend/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   │
│   ├── common/                          # Shared utilities
│   │   ├── decorators/                  # Custom decorators
│   │   ├── filters/                     # Exception filters
│   │   ├── guards/                      # Auth guards
│   │   ├── interceptors/                # Request/response interceptors
│   │   ├── pipes/                       # Validation pipes
│   │   ├── constants/                   # App constants
│   │   └── utils/                       # Helper functions
│   │
│   ├── config/                          # Configuration
│   │   ├── database.config.ts           # MySQL config
│   │   ├── redis.config.ts              # Redis config
│   │   ├── app.config.ts                # App settings
│   │   └── validation.config.ts         # Validation rules
│   │
│   ├── modules/
│   │   ├── calculator/                   # Calculator module
│   │   │   ├── calculator.module.ts
│   │   │   ├── calculator.controller.ts
│   │   │   ├── calculator.service.ts
│   │   │   ├── calculator.repository.ts
│   │   │   ├── entities/
│   │   │   │   ├── calculator.entity.ts
│   │   │   │   ├── calculator-grade.entity.ts
│   │   │   │   └── calculator-config.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-calculator.dto.ts
│   │   │   │   ├── update-calculator.dto.ts
│   │   │   │   └── calculator-response.dto.ts
│   │   │   └── interfaces/
│   │   │       └── calculator.interface.ts
│   │   │
│   │   ├── category/                    # Category module
│   │   │   ├── category.module.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   ├── category.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── category.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── search/                      # Search module
│   │   │   ├── search.module.ts
│   │   │   ├── search.controller.ts
│   │   │   ├── search.service.ts
│   │   │   ├── search-index.service.ts  # Redis-based indexing
│   │   │   └── dto/
│   │   │
│   │   ├── content/                     # Content module
│   │   │   ├── content.module.ts
│   │   │   ├── content.controller.ts
│   │   │   ├── content.service.ts
│   │   │   ├── entities/
│   │   │   │   └── calculator-content.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── admin/                       # Admin module (optional)
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── dto/
│   │   │
│   │   └── health/                      # Health check module
│   │       ├── health.module.ts
│   │       └── health.controller.ts
│   │
│   ├── database/
│   │   ├── migrations/                  # TypeORM migrations
│   │   ├── seeds/                        # Seed data
│   │   └── factories/                    # Test data factories
│   │
│   └── types/                           # TypeScript types
│       └── index.ts
│
├── test/                                # E2E and unit tests
│   ├── e2e/
│   └── unit/
│
├── .env.example                         # Environment template
├── .env                                 # Environment variables (gitignored)
├── .eslintrc.js                         # ESLint config
├── .prettierrc                          # Prettier config
├── nest-cli.json                        # NestJS CLI config
├── package.json
├── tsconfig.json                        # TypeScript config
├── tsconfig.build.json
└── README.md
```

---

## 4. MYSQL DATABASE SCHEMA

### **Database: `civil_calculators`**

### **Tables:**

#### **1. `categories`**
```sql
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    parent_id INT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id),
    INDEX idx_active_order (is_active, display_order),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **2. `calculators`**
```sql
CREATE TABLE calculators (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category_id INT UNSIGNED NOT NULL,
    calculator_type ENUM('sieve_analysis', 'quantity_estimator', 'test_calculator', 'other') NOT NULL,
    is_blending_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_type (calculator_type),
    INDEX idx_active_order (is_active, display_order),
    FULLTEXT idx_search (name, description),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **3. `calculator_grades`**
```sql
CREATE TABLE calculator_grades (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    calculator_id INT UNSIGNED NOT NULL,
    grade_slug VARCHAR(100) NOT NULL,
    grade_name VARCHAR(255) NOT NULL,
    grade_number VARCHAR(20),
    description TEXT,
    display_order INT DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_calc_grade (calculator_id, grade_slug),
    INDEX idx_calculator (calculator_id),
    INDEX idx_order (display_order),
    FOREIGN KEY (calculator_id) REFERENCES calculators(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **4. `calculator_configs`**
```sql
CREATE TABLE calculator_configs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    calculator_id INT UNSIGNED NOT NULL,
    grade_id INT UNSIGNED NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value JSON NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_calculator (calculator_id),
    INDEX idx_grade (grade_id),
    INDEX idx_key (config_key),
    FOREIGN KEY (calculator_id) REFERENCES calculators(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES calculator_grades(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Example `config_value` JSON for Sieve Analysis:**
```json
{
  "sieves": [
    {"size": "75 mm", "min": 100, "max": 100},
    {"size": "53 mm", "min": 80, "max": 100},
    {"size": "26.5 mm", "min": 55, "max": 90}
  ],
  "specification": "MORTH Table 400-1",
  "notes": "For coarse graded granular sub-base materials"
}
```

#### **5. `calculator_content`**
```sql
CREATE TABLE calculator_content (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    calculator_id INT UNSIGNED NOT NULL,
    grade_id INT UNSIGNED NULL,
    content_type ENUM('theory', 'apparatus', 'procedure', 'notes', 'formula', 'other') NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_calculator (calculator_id),
    INDEX idx_grade (grade_id),
    INDEX idx_type (content_type),
    INDEX idx_order (display_order),
    FOREIGN KEY (calculator_id) REFERENCES calculators(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES calculator_grades(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **6. `search_index`** (Optional - can use Redis instead)
```sql
CREATE TABLE search_index (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    calculator_id INT UNSIGNED NOT NULL,
    searchable_text TEXT NOT NULL,
    keywords JSON,
    weight INT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_calculator (calculator_id),
    FULLTEXT idx_fulltext (searchable_text),
    FOREIGN KEY (calculator_id) REFERENCES calculators(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **7. `calculator_analytics`** (Optional - for future analytics)
```sql
CREATE TABLE calculator_analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    calculator_id INT UNSIGNED NOT NULL,
    grade_id INT UNSIGNED NULL,
    event_type ENUM('view', 'calculation', 'share', 'download') NOT NULL,
    user_ip VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_calculator (calculator_id),
    INDEX idx_grade (grade_id),
    INDEX idx_event (event_type),
    INDEX idx_created (created_at),
    FOREIGN KEY (calculator_id) REFERENCES calculators(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES calculator_grades(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Example Seed Data:**

```sql
-- Categories
INSERT INTO categories (slug, name, icon, color, display_order) VALUES
('sieve-analysis', 'Sieve Analysis', 'fa-filter', 'blue', 1),
('quantity-estimator', 'Quantity Estimator', 'fa-calculator', 'green', 2),
('concrete-technology', 'Concrete Technology', 'fa-cubes', 'orange', 3),
('soil-test', 'Soil Test', 'fa-vial', 'amber', 4),
('road-construction', 'Road Construction', 'fa-road', 'red', 5),
('environment', 'Environment', 'fa-flask', 'teal', 6),
('solar', 'Solar', 'fa-solar-panel', 'yellow', 7),
('blending-aggregates', 'Blending of Aggregates', 'fa-blender', 'purple', 8);

-- Calculator Example
INSERT INTO calculators (slug, name, description, icon, category_id, calculator_type, is_blending_enabled) VALUES
('gsb-grading', 'GSB Grading Calculator', 'Granular Sub-Base Grading Analysis', 'fa-filter', 1, 'sieve_analysis', TRUE);

-- Grades
INSERT INTO calculator_grades (calculator_id, grade_slug, grade_name, grade_number, description, is_default) VALUES
(1, 'grade-1', 'Grade I', '1', 'For coarse graded granular sub-base materials (Grading I)', TRUE),
(1, 'grade-2', 'Grade II', '2', 'For coarse graded granular sub-base materials (Grading II)', FALSE);

-- Config Example
INSERT INTO calculator_configs (calculator_id, grade_id, config_key, config_value) VALUES
(1, 1, 'sieve_limits', '{"sieves": [{"size": "75 mm", "min": 100, "max": 100}, {"size": "53 mm", "min": 80, "max": 100}]}');
```

---

## 5. API ENDPOINTS DESIGN

### **Base URL**: `/api/v1`

### **Endpoints:**

#### **A. Calculator Endpoints**

```
GET    /api/v1/calculators
       Query: ?category=slug&type=sieve_analysis&page=1&limit=20
       Response: { data: Calculator[], meta: PaginationMeta }

GET    /api/v1/calculators/:slug
       Response: { data: CalculatorDetail }

GET    /api/v1/calculators/:slug/grades
       Response: { data: Grade[] }

GET    /api/v1/calculators/:slug/grades/:gradeSlug
       Response: { data: GradeDetail }

GET    /api/v1/calculators/:slug/config
       Query: ?grade=grade-1
       Response: { data: CalculatorConfig }

POST   /api/v1/calculators/:slug/calculate
       Body: { inputs: {}, grade?: string }
       Response: { data: CalculationResult }
```

#### **B. Category Endpoints**

```
GET    /api/v1/categories
       Response: { data: Category[] }

GET    /api/v1/categories/:slug
       Response: { data: CategoryDetail }

GET    /api/v1/categories/:slug/calculators
       Response: { data: Calculator[] }
```

#### **C. Search Endpoints**

```
GET    /api/v1/search
       Query: ?q=gsb&category=sieve-analysis&limit=10
       Response: { data: SearchResult[], meta: SearchMeta }

GET    /api/v1/search/suggestions
       Query: ?q=gsb&limit=5
       Response: { data: string[] }
```

#### **D. Content Endpoints**

```
GET    /api/v1/calculators/:slug/content
       Query: ?grade=grade-1&type=theory
       Response: { data: Content[] }
```

#### **E. Admin Endpoints** (Protected)

```
POST   /api/v1/admin/calculators
PUT    /api/v1/admin/calculators/:id
DELETE /api/v1/admin/calculators/:id

POST   /api/v1/admin/categories
PUT    /api/v1/admin/categories/:id

POST   /api/v1/admin/search/reindex
       Response: { message: "Reindexing started" }
```

#### **F. Health Check**

```
GET    /api/v1/health
       Response: { status: "ok", database: "connected", redis: "connected" }
```

### **Request/Response Examples:**

#### **Example 1: Get All Calculators**
```http
GET /api/v1/calculators?category=sieve-analysis&page=1&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "gsb-grading",
      "name": "GSB Grading Calculator",
      "description": "Granular Sub-Base Grading Analysis",
      "icon": "fa-filter",
      "category": {
        "slug": "sieve-analysis",
        "name": "Sieve Analysis"
      },
      "calculatorType": "sieve_analysis",
      "isBlendingEnabled": true,
      "grades": [
        {
          "slug": "grade-1",
          "name": "Grade I",
          "isDefault": true
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### **Example 2: Get Calculator Config**
```http
GET /api/v1/calculators/gsb-grading/config?grade=grade-1
```

**Response:**
```json
{
  "data": {
    "calculatorId": 1,
    "gradeId": 1,
    "config": {
      "sieves": [
        {
          "size": "75 mm",
          "min": 100,
          "max": 100
        },
        {
          "size": "53 mm",
          "min": 80,
          "max": 100
        }
      ],
      "specification": "MORTH Table 400-1"
    }
  }
}
```

#### **Example 3: Search**
```http
GET /api/v1/search?q=gsb&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "calculator": {
        "slug": "gsb-grading",
        "name": "GSB Grading Calculator",
        "category": "Sieve Analysis"
      },
      "relevance": 0.95,
      "matchedFields": ["name", "description"]
    }
  ],
  "meta": {
    "query": "gsb",
    "total": 6,
    "limit": 10
  }
}
```

---

## 6. SECURITY CONSIDERATIONS

### **1. Input Validation**
- Use `class-validator` with DTOs for all inputs
- Sanitize user inputs to prevent XSS
- Validate JSON schemas for calculator configs
- Rate limit API endpoints

### **2. SQL Injection Protection**
- Use TypeORM parameterized queries (built-in)
- Never use raw SQL with user input
- Validate all database inputs

### **3. Rate Limiting**
```typescript
// Using @nestjs/throttler
@Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
```

### **4. CORS Configuration**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
```

### **5. Environment Variables**
- Never commit `.env` files
- Use `@nestjs/config` for configuration
- Validate environment variables on startup

### **6. Authentication/Authorization** (For Admin)
- JWT-based authentication
- Role-based access control (RBAC)
- Protected admin endpoints

### **7. Data Sanitization**
- Sanitize all text inputs
- Validate JSON structures
- Escape special characters in responses

### **8. HTTPS Only**
- Enforce HTTPS in production
- Secure cookie settings
- HSTS headers

---

## 7. SCALABILITY & FUTURE-PROOFING

### **1. Caching Strategy**

#### **Redis Cache Layers:**
```typescript
// Layer 1: Calculator Metadata (TTL: 1 hour)
cache.set(`calculator:${slug}`, data, 3600);

// Layer 2: Search Index (TTL: 24 hours)
cache.set(`search:index`, indexData, 86400);

// Layer 3: Category Lists (TTL: 30 minutes)
cache.set(`category:${slug}:calculators`, data, 1800);
```

#### **Cache Invalidation:**
- Invalidate on calculator updates
- Background job to refresh cache periodically
- Cache warming on application startup

### **2. Database Optimization**

#### **Indexes:**
- All foreign keys indexed
- Composite indexes for common queries
- Full-text indexes for search
- Regular index maintenance

#### **Query Optimization:**
- Use eager loading for related data
- Pagination for all list endpoints
- Select only required fields
- Connection pooling

### **3. Search Scalability**

#### **Redis-Based Search Index:**
```typescript
// Store searchable data in Redis sorted sets
// Key: "search:index"
// Score: relevance weight
// Value: calculator ID
```

#### **Full-Text Search Options:**
1. **MySQL FULLTEXT** (for small-medium datasets)
2. **Redis Search** (for fast in-memory search)
3. **Elasticsearch** (for large-scale, advanced search - future)

### **4. Background Jobs**

#### **Bull Queue for Async Tasks:**
```typescript
// Search index rebuilding
@Process('rebuild-search-index')
async rebuildSearchIndex() { ... }

// Cache warming
@Process('warm-cache')
async warmCache() { ... }
```

### **5. Horizontal Scaling**

#### **Stateless Design:**
- No session storage in application
- All state in database/Redis
- Load balancer ready

#### **Database Read Replicas:**
- Master for writes
- Replicas for reads
- Automatic failover

### **6. Monitoring & Observability**

#### **Metrics:**
- Request/response times
- Database query performance
- Cache hit rates
- Error rates

#### **Logging:**
- Structured logging with Winston
- Log levels: error, warn, info, debug
- Centralized log aggregation (ELK stack optional)

#### **Health Checks:**
- Database connectivity
- Redis connectivity
- External service status

### **7. API Versioning**
- URL-based versioning: `/api/v1/`
- Backward compatibility
- Deprecation strategy

### **8. Mobile App Support**
- RESTful API design
- JSON responses
- Pagination support
- Rate limiting per client

### **9. Extensibility**

#### **Calculator Plugin System:**
```typescript
// Abstract calculator interface
interface CalculatorEngine {
  calculate(inputs: any, config: any): CalculationResult;
  validate(inputs: any): ValidationResult;
}

// Register new calculator types
@Injectable()
class SieveAnalysisEngine implements CalculatorEngine { ... }
```

### **10. Performance Targets**
- API response time: < 200ms (p95)
- Search response time: < 100ms (p95)
- Database query time: < 50ms (p95)
- Cache hit rate: > 80%

---

## 8. DEPLOYMENT & DEVOPS

### **1. Environment Setup**

#### **Development:**
```bash
npm install
cp .env.example .env
# Configure database, Redis
npm run migration:run
npm run seed
npm run start:dev
```

#### **Production:**
```bash
npm ci --production
npm run build
npm run migration:run
npm run start:prod
```

### **2. Docker Support** (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### **3. Database Migrations**

```typescript
// TypeORM migrations
npm run migration:generate -- -n CreateCalculatorsTable
npm run migration:run
npm run migration:revert
```

### **4. Seed Data**

```typescript
// Seed scripts
npm run seed:categories
npm run seed:calculators
npm run seed:all
```

### **5. CI/CD Pipeline**

```yaml
# Example GitHub Actions
- Run tests
- Build application
- Run migrations
- Deploy to staging
- Run E2E tests
- Deploy to production
```

---

## 9. TESTING STRATEGY

### **Unit Tests:**
- Service layer logic
- Repository methods
- Utility functions

### **Integration Tests:**
- API endpoints
- Database operations
- Cache operations

### **E2E Tests:**
- Complete user flows
- Calculator calculations
- Search functionality

---

## 10. IMPLEMENTATION PRIORITY

### **Phase 1: Core (Week 1-2)**
1. Database schema setup
2. Basic CRUD for calculators
3. Category management
4. Simple search (MySQL FULLTEXT)

### **Phase 2: Enhanced (Week 3-4)**
1. Redis integration
2. Advanced search
3. Calculator configs
4. Content management

### **Phase 3: Optimization (Week 5-6)**
1. Caching strategy
2. Performance optimization
3. Background jobs
4. Monitoring

### **Phase 4: Admin & Polish (Week 7-8)**
1. Admin endpoints
2. Analytics
3. Documentation
4. Production deployment

---

## CONCLUSION

This architecture provides:
- ✅ **Scalability**: Handles growth from hundreds to millions of requests
- ✅ **Maintainability**: Clean code structure, TypeScript safety
- ✅ **Extensibility**: Easy to add new calculators without schema changes
- ✅ **Performance**: Caching, indexing, optimized queries
- ✅ **Security**: Input validation, rate limiting, SQL injection protection
- ✅ **Production-Ready**: Monitoring, logging, health checks, migrations

The design is calculator-agnostic, allowing new calculator types to be added through configuration rather than code changes.
