# Tapzy Guardian Mobile App

Mobile app untuk Guardian (orang tua/wali) untuk memantau dan mengelola wallet anak di sistem Tapzy.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Mobile:** Capacitor
- **Styling:** TailwindCSS v4
- **State Management:** React Query + Context API
- **Routing:** React Router v6

## Features

- Login & Register Guardian
- Dashboard dengan total saldo anak
- Lihat detail anak dan wallet
- Top-up saldo anak
- Riwayat transaksi dan deposit
- Dark/Light mode theme
- Responsive mobile-first design

## Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn
- Android Studio (untuk build Android)

### Installation

```bash
# Clone repository
git clone https://github.com/efiensi-in/tapzy-mobile-capacitor.git
cd tapzy-mobile-capacitor

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env sesuai kebutuhan
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile Build

```bash
# Add Android platform (first time only)
npx cap add android

# Sync web assets to native
npx cap sync

# Open in Android Studio
npx cap open android
```

## Project Structure

```
src/
├── api/              # API client dan endpoints
├── components/
│   ├── layout/       # Layout components (AppLayout, AuthGuard)
│   └── ui/           # Reusable UI components (Button, Input, Card, etc.)
├── contexts/         # React Context (Auth, Theme)
├── hooks/            # Custom hooks (useMembers, useWallets)
├── pages/            # Page components
│   ├── auth/         # Login, Register
│   ├── home/         # Home, Deposits
│   ├── member/       # Member detail
│   ├── settings/     # Settings
│   └── wallet/       # Wallet detail, Topup
├── types/            # TypeScript types
├── utils/            # Utility functions (storage, format)
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── router.tsx        # Route definitions
```

## Environment Variables

```
VITE_API_URL=http://127.0.0.1:8001/api/v1
```

## License

Private - Efiensi Indonesia
