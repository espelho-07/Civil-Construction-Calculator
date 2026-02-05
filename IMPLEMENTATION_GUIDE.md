# Backend Implementation Quick Start Guide

## Overview
This guide provides step-by-step instructions to implement the backend architecture for the Civil Construction Calculator application.

## Prerequisites
- Node.js 18+ (LTS)
- MySQL 8.0+
- Redis 6.0+
- npm or yarn

## Step 1: Project Setup

```bash
# Install NestJS CLI globally
npm i -g @nestjs/cli

# Create new NestJS project
nest new backend
cd backend

# Install required dependencies
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/config @nestjs/cache-manager cache-manager cache-manager-redis-store redis
npm install @nestjs/throttler @nestjs/swagger
npm install class-validator class-transformer
```

## Step 2: Database Setup

```sql
-- Create database
CREATE DATABASE civil_calculators CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Run migrations (see BACKEND_ARCHITECTURE.md for schema)
```

## Step 3: Configuration

Create `.env` file:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=civil_calculators
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Step 4: Module Structure

1. **Create Calculator Module:**
```bash
nest generate module calculator
nest generate controller calculator
nest generate service calculator
```

2. **Create Category Module:**
```bash
nest generate module category
nest generate controller category
nest generate service category
```

3. **Create Search Module:**
```bash
nest generate module search
nest generate controller search
nest generate service search
```

## Step 5: Entity Setup

Copy entity files from `backend-examples/`:
- `calculator.entity.ts`
- `category.entity.ts`
- `calculator-grade.entity.ts`
- `calculator-config.entity.ts`

## Step 6: Database Connection

In `app.module.ts`:
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') === 'development',
        logging: config.get('DB_LOGGING'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Step 7: Redis Cache Setup

```typescript
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

CacheModule.registerAsync({
  useFactory: () => ({
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: 3600,
  }),
}),
```

## Step 8: API Endpoints Implementation

Use the service examples from `backend-examples/`:
- `calculator.service.ts` - Business logic
- `search.service.ts` - Search functionality

## Step 9: Seed Data

Create seed scripts to populate initial data:
- Categories
- Calculators
- Grades
- Configs

## Step 10: Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

## Step 11: Production Deployment

1. Build application:
```bash
npm run build
```

2. Run migrations:
```bash
npm run migration:run
```

3. Start production server:
```bash
npm run start:prod
```

## Key Implementation Notes

1. **Calculator-Agnostic Design:**
   - All calculator logic stored in JSON configs
   - Frontend handles calculation logic
   - Backend only provides metadata and configs

2. **Search Strategy:**
   - Start with MySQL FULLTEXT search
   - Add Redis caching for performance
   - Scale to Elasticsearch if needed

3. **Caching Strategy:**
   - Cache calculator metadata (1 hour TTL)
   - Cache search results (24 hours TTL)
   - Cache category lists (30 minutes TTL)

4. **API Versioning:**
   - Use `/api/v1/` prefix
   - Plan for future versions

## Next Steps

1. Implement all modules following the architecture
2. Add authentication for admin endpoints
3. Set up monitoring and logging
4. Create comprehensive API documentation
5. Deploy to production environment

## Support

Refer to `BACKEND_ARCHITECTURE.md` for detailed architecture documentation.
