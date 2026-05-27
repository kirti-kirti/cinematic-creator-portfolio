# Cinematic Portfolio & Creator Admin Console

A premium, modern, fully responsive personal portfolio website for a creative professional (Video Editor, Photographer, Cinematic Content Creator). Built with **React.js (Vite)**, **Tailwind CSS**, and **Framer Motion**, backed by a lightweight **Express.js API**.

---

## 🎬 Core Features

1. **Cinematic Hero**: Full-screen video reel background with interactive text reveals.
2. **About & Stats**: Professional timeline story, specialties highlighting, and animated stat counters.
3. **Proficiencies**: Interactive skill panels displaying software and creative tools mastery with animated progression meters.
4. **Interactive Masonry Gallery**: Multi-category media items with support for:
   * Video embeds (YouTube / Vimeo / local)
   * High-contrast photo lightboxes
   * **Before / After grading sliders** to showcase post-production color science skills.
5. **Services & Pricing**: Elegant custom billing cards with direct action integrations mapping client budgets to contact sheets.
6. **Timeline Pipeline**: Step-by-step visual of the workflow (Discussion &rarr; Planning &rarr; Shooting &rarr; Editing &rarr; Delivery).
7. **Testimonials**: Interactive slider of reviews with verified rating indices.
8. **Contact Engine**: Form submissions with budget thresholds and **Confetti explosion animations** upon successful submit.
9. **Admin Panel (`/admin`)**: A password-protected dashboard including:
   * Interactive chart visuals (Weekly inquiry trend lines, project type breakdown slices).
   * **Client Inquiries CRUD**: Toggle read/unread, delete inquiries, and direct reply templates (WhatsApp / Email mailto).
   * **Portfolio CRUD**: Live management to add, edit, or delete gallery photos, embeds, tags, and before/after comparisons dynamically.
10. **Interactive FX**: Smooth page scrolling, custom mouse glow follower, and shutter lens loader transitions.

---

## 📂 Folder Structure

```
portfolio(Navneet)/
├── package.json               # Root monorepo npm controls
├── README.md                  # Setup and deployment details
├── backend/
│   ├── package.json           # Node server dependency details
│   ├── .env                   # Environment variables (Passcode configuration)
│   ├── server.js              # Express API endpoints
│   ├── database.js            # Promise-based JSON file-based database manager
│   └── data/
│       └── db.json            # Dynamic data store (seeded automatically)
└── frontend/
    ├── package.json           # React dependencies (Framer Motion, Tailwind, Recharts)
    ├── tailwind.config.js     # Dark cinematic design tokens & animation states
    ├── postcss.config.js
    ├── index.html             # Google fonts & SEO headers
    └── src/
        ├── App.jsx            # Routing & observer hooks
        ├── index.css          # Glassmorphism, animations, & cursor custom gradient styles
        └── components/
            ├── CursorGlow.jsx     # Pointer glow trail
            ├── LoadingScreen.jsx  # Lens-shutter transition screen
            ├── Navbar.jsx         # Frosted glass responsive sticky header
            ├── Hero.jsx           # Animated video loop cover
            ├── About.jsx          # Profile details & counter milestones
            ├── Skills.jsx         # Progression skill meters
            ├── Portfolio.jsx      # masonry grid + dialog modals + grading slider
            ├── Services.jsx       # Rates list
            ├── Timeline.jsx       # Workflow milestone timeline
            ├── Pricing.jsx        # Service comparison panels
            ├── Contact.jsx        # Feedback capture + direct WhatsApp link
            ├── AdminDashboard.jsx # Passcode protection, Charts, CRUD interface
            └── Footer.jsx         # Sticky footer & social anchors
```

---

## ⚡ Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Installation
Run the root command to install dependencies for the root, frontend, and backend packages:
```bash
npm run install:all
```

### 2. Configuration
Inside `backend/.env` you can adjust the server port and passcode:
```env
PORT=5000
ADMIN_PASSCODE=admin123
```

### 3. Launching
Start the backend server and frontend development client simultaneously with a single command:
```bash
npm run dev
```
Open your browser to: **`http://localhost:5173`**
- Main Site: `http://localhost:5173`
- Admin Console: Toggle the "Admin Panel" button in the navigation header (or use passcode `admin123`).

---

## 🚀 Production Deployment

This project is prepared to deploy as a unified static application (connecting to a serverless backend) or as a separate frontend/backend server.

### Option A: Unified deployment (Node/Express Server hosting React build)
To serve the React client directly from Express, build the frontend:
```bash
npm run build
```
And copy the generated `frontend/dist` files to a public folder in the backend, then configure Express to serve static assets via:
`app.use(express.static('../frontend/dist'));`

### Option B: Deploying separately
1. **Frontend (Vercel / Netlify / Cloudflare Pages)**:
   * Deploy the `/frontend` directory.
   * Build Command: `npm run build`
   * Output Directory: `dist`
   * Environmental variable: Set up a proxy or update API base URL to point to your live hosted backend URL.
2. **Backend (Render / Railway / Heroku)**:
   * Deploy the `/backend` directory.
   * Build Command: `npm install`
   * Start Command: `node server.js`
   * Specify `ADMIN_PASSCODE` in environment variables.

---

## 🛠️ Tech Stack & Design Inspiration
- **React 19 & Vite**: Ultra-fast hot module reloading.
- **Tailwind CSS**: Utility-first styling with custom animation states.
- **Framer Motion**: Premium animations (springs, fades, slide-ups, exits).
- **Lucide Icons**: Modern minimal vector icons.
- **Recharts**: Responsive charts showing client acquisition trends.
- **Canvas-Confetti**: Fun confetti launch animations.
