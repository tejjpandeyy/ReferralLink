# ReferralLink - SaaS URL Shortener with Referral Tracking

A modern, production-ready SaaS application for creating short links with referral tracking, QR codes, and comprehensive analytics.

## 🎯 Core Features

- **URL Shortener with Referral Tracking**: Create multiple referral links for the same destination URL
- **QR Code Generation**: Generate and download QR codes for each referral link
- **Analytics Dashboard**: Track clicks, unique visitors, and referral performance
- **Real-time Analytics**: View detailed metrics with charts and statistics
- **User Authentication**: Secure email/password login
- **Responsive Design**: Modern, minimalistic SaaS UI with Tailwind CSS

## 📋 Tech Stack

### Frontend
- React 18+
- Tailwind CSS
- Recharts (for analytics)
- Axios (API client)

### Backend
- Node.js
- Express.js
- PostgreSQL
- QRCode package

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tejjpandeyy/ReferralLink.git
cd ReferralLink
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## 📁 Project Structure

```
ReferralLink/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── migrations/
│   ├── seeds/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Links
- `GET /api/links` - Get all links
- `POST /api/links` - Create new link
- `GET /api/links/:id` - Get link details
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link

### Analytics
- `GET /api/analytics/links/:id` - Get link analytics
- `GET /api/analytics/overview` - Get overall analytics

### Redirect
- `GET /:referralCode` - Redirect and track click

## 📊 Database Schema

See `backend/migrations/` for complete schema.

### Tables
- `users` - User accounts
- `links` - Shortened links
- `clicks` - Click tracking

## 🎨 UI Pages

- **Login** - Authentication
- **Dashboard** - Overview with metrics
- **Create Link** - New referral link form
- **Analytics** - Detailed analytics with charts
- **Settings** - User settings

## 📈 Analytics Features

- Total clicks per link
- Unique visitor tracking
- Daily click statistics
- Referral distribution
- Device and browser information
- Last visited timestamp

## 🔐 Security

- Password hashing with bcrypt
- JWT authentication
- Input validation
- SQL injection prevention
- Rate limiting

## 🔑 Environment Variables

See `.env.example` files in backend and frontend directories.

## 🚢 Deployment

See `DEPLOYMENT.md` for comprehensive deployment guides.

## 📄 License

MIT
