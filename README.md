🌿 FarmGuard AI
Empowering underserved farmers with AI-driven crop health diagnostics and sustainable organic remedies.

📖 Overview
FarmGuard AI is a mobile-first platform designed for small-scale and marginalized farmers who lack access to professional agronomists. Using on-device Machine Learning and the Gemini 1.5 Pro model, FarmGuard identifies plant diseases from a simple photo and provides low-cost, organic treatment recipes that can be made from common household ingredients.

🌍 The Problem & Impact
The Gap: 500 million smallholder farmers worldwide lose up to 40% of their crops to pests and disease.

The Marginalized: In underserved communities, professional help is expensive, and chemical pesticides are often unaffordable or toxic to the local ecosystem.

Our Solution: FarmGuard provides a free, "agronomist in your pocket", ensuring that even farmers with limited connectivity can save their livelihoods.

✨ Key Features
AI Disease Scanner: Snap a photo of a distressed leaf to get an instant diagnosis.

Organic Remedy Library: Step-by-step instructions for DIY remedies (e.g., Neem oil sprays, baking soda mixtures).

Savings Calculator: Track how much money you’ve saved by using organic remedies versus buying synthetic chemicals.

Impact Dashboard: A visual summary of "Crops Saved" and "Pesticides Avoided" to prove real-world impact.

User Profiles: Personalized farmer profiles with farm details, crop preferences, and farming experience.

Secure Authentication: User registration and login powered by Supabase Auth.

🛠️ Tech Stack
Frontend: React + TypeScript (Tailwind CSS)

Backend/Auth: Supabase (PostgreSQL & GoTrue Auth)

AI Engine: Google Gemini 1.5 Pro

Database: Supabase (User Profiles & Diagnosis History)

Build Tool: Vite

Icons: Lucide React

Charts: Recharts

🚀 Getting Started

## Prerequisites
- Node.js (v18+)
- A Supabase Project with Authentication enabled
- A Google AI Studio API Key (Gemini API)

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/farmguard-ai.git
cd farmguard-ai
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure your environment:**
Make a `config.ts` file with your API keys:
```typescript
import { createClient } from '@supabase/supabase-js';

export const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; 
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

4. **Set up Supabase Database:**
Create a `profiles` table in your Supabase project:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  farm_name TEXT,
  farm_size INTEGER,
  main_crop TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to `http://localhost:5173` to start using FarmGuard AI!
📊 Measurable Impact 

**Economic Resilience**: Calculated as (Avg. Crop Value * % Recovery) - Cost of Organic Remedy.

**Environmental Health**: Total liters of chemical runoff prevented by substituting synthetic pesticides with organic alternati

Accecessibility Score**: Task completion time for non-technical users (optimized for < 3 taps to diagnosis).

## 🔧 Troubleshooting

### Authentication Issues
- **Profile data not showing**: The app stores profile data locally during signup and retrieves it during login. If you signed up but see your profile details, try logging out and logging back in.
- **RLS Policy Errors**: If you see "row level security policy" errors, ensure you've set up the Supabase policies as shown in the installation steps.

### API Issues  
- **Gemini API Errors**: Ensure your `GEMINI_API_KEY` is valid and has sufficient quota.
- **Supabase Connection**: Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct.

### Development
- **TypeScript Errors**: Run `npm run build` to check for compilation errors.
- **Port Issues**: If port 5173 is busy, Vite will automatically use the next available port.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Google Gemini AI for powerful plant disease recognition
- Supabase for seamless backend infrastructure
- The global farming community for inspiring this solution