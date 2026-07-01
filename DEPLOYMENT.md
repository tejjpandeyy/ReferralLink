# ReferralLink Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git
- npm/yarn

## Production Deployment

### Option 1: Heroku Deployment

#### Backend
1. Create Heroku app
```bash
heroku create referrallink-api
```

2. Add PostgreSQL addon
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. Set environment variables
```bash
heroku config:set JWT_SECRET=your_secure_secret
heroku config:set NODE_ENV=production
```

4. Deploy
```bash
git push heroku main
```

#### Frontend
1. Build the application
```bash
cd frontend
npm run build
```

2. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option 3: AWS EC2 Deployment

1. Launch EC2 instance (Ubuntu 22.04)
2. Install Node.js and PostgreSQL
3. Clone repository
4. Setup environment variables
5. Use PM2 for process management
```bash
npm install -g pm2
pm2 start npm --name "referrallink" -- start
pm2 save
pm2 startup
```

## Database Setup

1. Create PostgreSQL database
```bash
creatdb referrallink
```

2. Run migrations
```bash
npm run migrate
```

3. Seed initial data
```bash
npm run seed
```

## SSL/HTTPS

- Use Let's Encrypt for free SSL certificates
- Configure reverse proxy (Nginx/Apache)
- Enable HSTS headers

## Monitoring

- Setup PM2 monitoring
- Configure logging with Winston
- Setup error tracking (Sentry)
- Monitor database performance

## Backups

- Setup automated PostgreSQL backups
- Store backups in S3
- Test backup restoration regularly
