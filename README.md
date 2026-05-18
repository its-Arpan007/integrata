# 🚀 Integrata — Find Your Perfect Builder Match

Integrata is a modern AI-powered builder networking platform designed for developers, hackers, designers, and startup enthusiasts to discover compatible teammates for hackathons, projects, and startups.

Built with a swipe-based matching experience inspired by modern social platforms, Integrata helps builders connect based on:

* skills
* interests
* builder personality
* project goals
* collaboration style

🌐 Live Demo: [Integrata Live App](https://integrata-one.vercel.app/?utm_source=chatgpt.com)

---

# ✨ Features

## 🔥 Builder Discovery

* Swipe-based teammate discovery
* Compatibility scoring
* Skill-based filtering
* Builder personality matching
* Interactive profile cards

## 👤 Smart Profiles

Create a detailed builder profile including:

* Tech stack
* Builder DNA
* Interests
* Goals
* Experience level
* Portfolio links
* Availability

## 🤖 AI-Powered Matching

* AI-generated profile summaries
* Smart compatibility insights
* Personalized icebreakers
* Semantic builder recommendations

## 🎨 Modern UI/UX

* Glassmorphism design
* Framer Motion animations
* Responsive layout
* Interactive onboarding
* Smooth transitions

## 🔐 Authentication

* Secure login/signup
* Session persistence
* Protected routes
* Supabase Auth integration

---

# 🛠️ Tech Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Framer Motion

## Backend & Database

* Supabase
* PostgreSQL
* Supabase Auth
* pgvector (planned)

## UI & Utilities

* Lucide Icons
* clsx
* tailwind-merge
* class-variance-authority

---

# 📂 Project Structure

```bash
src/
├── app/
│   ├── discover/
│   ├── onboarding/
│   ├── login/
│   ├── profile/
│   └── matches/
│
├── components/
│   ├── landing/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   └── utils/
│
├── providers/
├── types/
└── data/
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/integrata.git
cd integrata
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Setup Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
```

---

# 🚀 Run Locally

```bash
npm run dev
```

App will run at:

```bash
http://localhost:3000
```

---

# 🧠 Future Roadmap

* Real AI matchmaking engine
* Vector similarity search
* Real-time chat
* Team rooms
* GitHub integration
* Voice/video intros
* Hackathon discovery
* AI-generated team recommendations
* Mobile app support

---

# 📸 Screenshots

<img width="1267" height="792" alt="image" src="https://github.com/user-attachments/assets/5926de8f-101e-41d1-a62c-17556023d096" />


Modern animated landing experience with glassmorphism UI.

## Discover Builders
<img width="1267" height="792" alt="image" src="https://github.com/user-attachments/assets/79a41ab0-2be1-43ea-9afa-01e79351b703" />

Swipe and discover compatible teammates.
<img width="1267" height="792" alt="image" src="https://github.com/user-attachments/assets/41624fac-b1d3-49b4-b861-a37bfa9a1177" />

## Builder Profiles

<img width="1267" height="792" alt="image" src="https://github.com/user-attachments/assets/a7cc7752-81ca-448d-a0bb-74dd74ff9895" />


---

# 🏗️ Deployment

Deployed on [Vercel](https://vercel.com/)

Live URL:
[Integrata Production Deployment](https://integrata-one.vercel.app/)

---

# 🤝 Contributing

Contributions, ideas, and feature suggestions are welcome.

```bash
# Fork repository
# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push branch
git push origin feature/amazing-feature
```

---

# 📄 License

This project is licensed under the MIT License.

---

# 💡 Vision

Integrata aims to become the go-to platform for:

* hackathon team formation
* startup networking
* builder collaboration
* AI-powered developer matching

Helping builders find the right people faster and build amazing things together.
