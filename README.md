# HireAI - AI-Powered Hiring Platform

## About

HireAI is an AI-powered hiring platform built as a semester project. It automates resume screening, conducts AI-assisted interviews, and provides data-driven candidate scoring to help recruiters make better hiring decisions.

## Features

- **AI Interview System** - Generates role-specific questions from resume + job data
- **Resume Scoring** - Matches candidate skills against job requirements
- **Role-Based Dashboards** - Admin, Recruiter, and Candidate panels
- **Candidate Comparison** - Side-by-side evaluation of shortlisted candidates
- **Scoring Configuration** - Adjustable resume vs interview weightage

## Tech Stack

- React + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Supabase (auth, database, edge functions)
- Framer Motion (animations)

## Getting Started

```sh
# install dependencies
npm install

# start dev server
npm run dev
```

## Project Structure

```
src/
  components/     # reusable UI components
  pages/
    admin/        # admin dashboard pages
    recruiter/    # recruiter dashboard pages
    candidate/    # candidate dashboard pages
  hooks/          # custom React hooks
  integrations/   # supabase client setup
  lib/            # utility functions
supabase/
  functions/      # edge functions (auth, scoring, questions)
  migrations/     # database schema migrations
```

## Roles

- **Admin** - Manage users, configure scoring rules, view analytics
- **Recruiter** - Post jobs, review candidates, make hiring decisions
- **Candidate** - Apply to jobs, take AI interviews, view results
