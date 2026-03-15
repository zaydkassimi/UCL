# ⚽ UEFA Champions League Tracker

Follow the UEFA Champions League 2025/26 season in real-time — live scores, match details, and the full history of European football's greatest competition.

🌐 **Live Demo:** https://ucl-championsleague.vercel.app
💻 **GitHub:** https://github.com/zaydkassimi/UCL

---

## ✨ Features

- 🔴 **Live Scores:** Auto-refresh every 30 seconds — no reload needed
- 📅 **Match Center:** All matches organized by stage (League Phase → Round of 16 → Quarter Finals → Semi Finals → Final)
- 📋 **Match Detail:** Score timeline, half-time result, and referee info for every game
- 🏆 **Hall of Fame:** Every UCL winner since 1956, including PSG's historic 2025 title
- 🎨 **Cinematic UI:** Dark premium design with gold accents and smooth animations
- 📱 **Fully Responsive:** Optimized for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** `Next.js 14` (App Router)
- **Language:** `TypeScript`
- **Styling:** `Tailwind CSS`
- **Animations:** `Framer Motion`
- **Data Fetching:** `SWR`

### API
- **Data Source:** `football-data.org` (free tier)
- **Competition:** UEFA Champions League (`CL`)
- **Season:** 2025/26

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Free API token from [football-data.org](https://www.football-data.org)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/zaydkassimi/UCL.git
cd UCL
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root:
```
FOOTBALL_DATA_TOKEN=your_token_here
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
UCL/
├── public/
│   └── images/            # Static assets (UCL logo)
├── src/
│   ├── app/
│   │   ├── page.tsx       # Home page
│   │   ├── matches/
│   │   │   ├── page.tsx   # Match Center
│   │   │   └── [id]/      # Match detail page
│   │   ├── winners/
│   │   │   └── page.tsx   # Hall of Fame
│   │   └── api/           # API routes (proxies football-data.org)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── MatchCard.tsx
│   │   ├── WinnerCard.tsx
│   │   ├── LiveBadge.tsx
│   │   ├── TeamCrest.tsx
│   │   └── StarBackground.tsx
│   └── data/
│       └── winners.ts     # All-time UCL winners static data
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for more information.

Made with ❤️ for football fans everywhere.
