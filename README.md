# DuckLoad Web Frontend

PUP Student Guidance System Capstone - React + Vite Frontend

## Setup Instructions

### Prerequisites
- Node.js v22+ installed
- npm v10+

### Installation

```bash
# From the web/ directory
npm install
```

### Running Development Server

```bash
# Start the React dev server (runs on http://localhost:5173)
npm run dev
```

### Building for Production

```bash
npm run build
```

### Running Linter

```bash
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable UI components (shadcn/ui)
├── features/         # Feature modules (pds, appointments, etc.)
├── pages/            # Page components (Login, StudentForm, etc.)
├── routes/           # Route definitions
├── context/          # React Context (AuthContext)
├── hooks/            # Custom React hooks
├── services/         # API services
├── config/           # Configuration files
├── assets/           # Images and icons
├── lib/              # Utilities and helpers
├── App.tsx           # Main app component
└── main.jsx          # Entry point
```

## Tech Stack

- **React** 18.2.0 - UI library
- **Vite** ^5.0.0 - Build tool
- **React Router** 6.18.0 - Routing
- **Tailwind CSS** 3.3.0 - Styling
- **shadcn/ui** - Component library
- **Axios** - HTTP client

## Environment Variables

Create a `.env` file in the web directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Notes

- Backend API runs on port 8000 (see `/api` directory)
- Mock authentication uses localStorage for testing
- Default test credentials: email: `student`, password: `password`
