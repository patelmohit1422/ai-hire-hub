# AI Smart Interview & Hiring System

An AI-powered hiring platform built as a semester project. It helps recruiters post jobs, screen candidates using AI, conduct automated interviews, and make data-driven hiring decisions.

---

## Problem Statement

Hiring is slow and biased. Recruiters spend hours reading resumes and conducting interviews manually. There's no standard way to compare candidates fairly. This project tries to solve that by using AI to automate resume screening, generate interview questions, and score candidates based on their skills and responses.

---

## Features

- AI-generated interview questions based on job description and resume
- Resume scoring — matches candidate skills against job requirements
- Role-based dashboards for Admin, Recruiter, and Candidate
- Side-by-side candidate comparison for recruiters
- Configurable scoring weights (resume vs interview)
- Dark mode and light mode support
- Fully responsive — works on mobile, tablet, and desktop
- Secure authentication with Supabase Auth

---

## User Roles

### Admin
- Manage all users in the system
- Configure scoring rules and weights
- View platform-wide analytics
- Add new users manually

### Recruiter
- Post and manage job listings
- Review candidate applications
- Compare shortlisted candidates side by side
- Make hiring decisions (accept / reject)

### Candidate
- Browse and apply to open jobs
- Take AI-powered interviews
- View scores and feedback
- Track application progress

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, TypeScript, Vite        |
| Styling     | Tailwind CSS, shadcn/ui           |
| Backend     | Supabase (Auth, Database, Edge Functions) |
| AI          | OpenAI API (via Edge Functions)    |
| Animations  | Framer Motion                     |
| Charts      | Recharts                          |
| Routing     | React Router v6                   |

---

## Database Tables

| Table             | Purpose                                      |
|-------------------|----------------------------------------------|
| `profiles`        | Stores user profile info (name, email, etc.) |
| `user_roles`      | Maps users to roles (admin, recruiter, candidate) |
| `jobs`            | Job listings posted by recruiters            |
| `applications`    | Tracks which candidate applied to which job  |
| `interviews`      | Stores interview questions and candidate answers |
| `scores`          | Resume score, interview score, total score   |
| `system_settings` | Platform-level config like scoring weights   |

---

## Screenshots

> Replace these placeholders with actual screenshots before submission.

### Landing Page
![Landing Page](./screenshots/landing.png)

### Auth Page (Login / Signup)
![Auth Page](./screenshots/auth.png)

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)

### Recruiter Dashboard
![Recruiter Dashboard](./screenshots/recruiter-dashboard.png)

### Candidate Dashboard
![Candidate Dashboard](./screenshots/candidate-dashboard.png)

### Interview Page
![Interview Page](./screenshots/interview.png)

### Results Page
![Results Page](./screenshots/results.png)

### Pricing Page
![Pricing Page](./screenshots/pricing.png)

---

## Demo

- **Live Demo:** [Add your deployed URL here]
- **Demo Video:** [Add YouTube or Google Drive link here]

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or above)
- npm or bun
- A Supabase project (free tier works)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-smart-interview-system.git
   cd ai-smart-interview-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Run the SQL migrations from the `supabase/migrations/` folder
   - This will create all the required tables and policies

5. **Deploy edge functions** (optional, for AI features)
   ```bash
   supabase functions deploy generate-questions
   supabase functions deploy calculate-scores
   supabase functions deploy admin-add-user
   ```

---

## How to Run

```bash
# start the dev server
npm run dev
```

The app will open at `http://localhost:5173`

To build for production:
```bash
npm run build
```

---

## Folder Structure

```
├── public/                  # static assets
├── src/
│   ├── components/          # reusable UI components
│   │   └── ui/              # shadcn/ui base components
│   ├── hooks/               # custom React hooks (auth, toast, etc.)
│   ├── integrations/        # Supabase client setup and types
│   ├── lib/                 # utility functions
│   ├── pages/
│   │   ├── admin/           # admin panel pages
│   │   ├── recruiter/       # recruiter panel pages
│   │   └── candidate/       # candidate panel pages
│   ├── App.tsx              # main app with routing
│   ├── main.tsx             # entry point
│   └── index.css            # global styles and design tokens
├── supabase/
│   ├── functions/           # edge functions (AI scoring, auth, etc.)
│   └── migrations/          # database schema migrations
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## Future Improvements

- Video-based interviews with webcam recording
- Better AI scoring with more detailed feedback
- Email notifications for application status updates
- Improved resume parsing (extract skills automatically from PDF)
- Analytics dashboard with more charts and filters
- Multi-language support
- Export candidate reports as PDF
- Integration with calendar for scheduling interviews

---

## Author

- **Name:** [Your Name]
- **University:** [Your University Name]
- **Program:** [Your Program, e.g., BS Computer Science]
- **Semester:** [e.g., 6th Semester]
- **GitHub:** [https://github.com/your-username](https://github.com/your-username)
- **Email:** [your-email@example.com]

---

> This project was built as part of a semester project. It is meant for learning purposes and demonstrates how AI can be used in the hiring process.
