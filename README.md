# 🌟 FaceGuard AI

AI-powered skin analysis and personalized skincare routine generator

## 🚀 Features

- **AI Skin Analysis** - Advanced skin type and issue detection using OpenAI Vision
- **Personalized Recommendations** - Custom product, diet, and lifestyle suggestions
- **Weekly Progress Tracking** - Monitor skin improvements over time
- **Safety Warnings** - Prevents harmful ingredient combinations
- **User Authentication** - Secure JWT-based auth system
- **Comprehensive Database** - Track all scans and recommendations

## 📋 Tech Stack

**Backend:**
- Node.js + Express
- OpenAI Vision API (GPT-4 Vision)
- Supabase (PostgreSQL)
- JWT Authentication
- Multer (File uploads)

**Frontend:** (Coming soon)
- React.js
- Tailwind CSS
- Axios
- Chart.js

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))

### 2. Clone Repository

```bash
git clone https://github.com/abhinavtapaskar-afk/FaceGuardAI.git
cd FaceGuardAI
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Supabase Database

1. Create a new project on Supabase
2. Go to SQL Editor
3. Copy and paste the contents of `backend/database/schema.sql`
4. Run the SQL script
5. Get your Supabase URL and anon key from Project Settings > API

### 5. Configure Environment Variables

Edit `config.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 6. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

**POST** `/api/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Skin Scan

**POST** `/api/scan` (requires auth)
- Upload: `photo` (multipart/form-data)
- Returns: Skin analysis + recommendations

**GET** `/api/scan/:scanId` (requires auth)
- Get specific scan details

**GET** `/api/scan` (requires auth)
- Get user's scan history

### User Profile

**GET** `/api/user/profile` (requires auth)
- Get user profile

### Progress Tracking

**POST** `/api/progress` (requires auth)
```json
{
  "scanId": "uuid",
  "acneSeverity": 3,
  "oilinessLevel": 4,
  "redness": 2,
  "darkSpots": 3,
  "texture": 2,
  "notes": "Skin improving"
}
```

**GET** `/api/progress?weeks=4` (requires auth)
- Get weekly progress history

## 🔐 Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 Project Structure

```
FaceGuardAI/
├── ai_engine/
│   ├── skinAnalyzer.js          # OpenAI Vision integration
│   └── recommendationEngine.js  # Product recommendation logic
├── backend/
│   ├── config/
│   │   └── database.js          # Supabase configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── auth.js              # Signup/Login
│   │   ├── scan.js              # Skin analysis
│   │   ├── user.js              # User profile
│   │   └── progress.js          # Weekly tracking
│   └── database/
│       └── schema.sql           # Database schema
├── uploads/                     # Uploaded images
├── app.js                       # Main server
├── package.json
└── config.env                   # Environment variables
```

## 🎯 How It Works

1. **User uploads selfie** → Sent to `/api/scan`
2. **AI analyzes image** → OpenAI Vision detects skin type & issues
3. **Generate recommendations** → Custom products, diet, lifestyle tips
4. **Save to database** → Scan + recommendations stored
5. **Track progress** → Weekly comparisons and improvements

## 🧪 Testing

Test the API using:
- Postman
- Thunder Client (VS Code)
- cURL

Example cURL:
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Scan (replace TOKEN)
curl -X POST http://localhost:3000/api/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/selfie.jpg"
```

## 🚀 Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect Railway/Render to repo
3. Add environment variables
4. Deploy!

### Frontend (Vercel)

Coming soon...

## 📝 Next Steps

- [ ] Build React frontend
- [ ] Add mobile app (React Native)
- [ ] Implement push notifications
- [ ] Add social features
- [ ] Product marketplace integration

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT License

## 👨‍💻 Author

**Abhinav Tapaskar**
- GitHub: [@abhinavtapaskar-afk](https://github.com/abhinavtapaskar-afk)

---

**Built with ❤️ using AI**
