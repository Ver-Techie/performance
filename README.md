# Recruitment Workflow and Productivity Management Platform

A secure, role-based productivity and performance tracking platform for IT recruiters and consultants.

## Features

- Role-based access control (Super Admin, Onshore Lead, Offshore Manager, Offshore Lead, Recruiter, Consultant)
- Daily attendance tracking (Punch-In/Punch-Out)
- Job application tracking with screenshots
- EOD Reports with detailed metrics
- Discord integration for team communication
- User and team management
- Scalable backend supporting 2K+ active users

## Tech Stack

- **Frontend**: React (Web), React Native (Mobile), Vite
- **Backend**: Node.js with Express, TypeScript
- **Authentication**: Firebase Auth (Phone OTP, Email OTP)
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage
- **Push Notifications**: Firebase Cloud Messaging
- **Calendar**: FullCalendar
- **Communication**: Discord API
- **Deployment**: Vercel (Web), Expo (Mobile), Supabase

## Project Structure

```
├── web/                  # React web application
├── mobile/              # React Native mobile application
├── backend/             # Node.js backend
├── shared/              # Shared types and utilities
└── docs/                # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Firebase account
- Supabase account
- Discord Developer account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Web
   cd web
   npm install

   # Mobile
   cd ../mobile
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in each directory
   - Configure Firebase, Supabase, and Discord credentials

4. Start development servers:
   ```bash
   # Web
   cd web
   npm run dev

   # Mobile
   cd ../mobile
   npm start

   # Backend
   cd ../backend
   npm run dev
   ```

## Role Permissions Matrix

| Feature / Role | Super Admin | Onshore Lead | Offshore Manager | Offshore Lead | Recruiter | Consultant |
|----------------|-------------|--------------|------------------|---------------|-----------|------------|
| Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Users | All Roles | ❌ | Leads, Recruiters | Consultants | ❌ | ❌ |
| View Dashboard | ✅ | Own Team | Own Team | Own Team | Own Team | Self Only |
| Attendance (Punch) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Daily Job Snapshot Upload | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| EOD Report Submission | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Progress | ✅ | Team Only | All | All | Own Cons. | Self Only |
| Discord Group Creation | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |

## Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Supabase Setup

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Initialize Supabase

```bash
supabase init
```

This will create a `.supabase` directory with a `config.toml` file.

### 4. Link to Supabase Project

```bash
supabase link --project-ref ecwduptyhamnqgcstfgz
```

### 5. Create and Apply Migrations

```bash
# Create a new migration
supabase migration new create_users_table

# Apply migrations
supabase db push
```

## Environment Variables

Create a `.env` file in the `web` directory with the following variables:

```env
VITE_SUPABASE_URL=https://ecwduptyhamnqgcstfgz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjd2R1cHR5aGFtbnFnY3N0Zmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTI2MjIsImV4cCI6MjA2MTc4ODYyMn0.fK7pncnyRXirKn1rW8wV04xRw0LzXNuWN9h79mHmM94
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Production Build

```bash
npm run build
``` # performance
