# Tapzy Mobile App - Development Brief

## Overview
Mobile app untuk **Guardian (orang tua/wali)** untuk memantau dan mengelola wallet anak di sistem Tapzy.

**Tech Stack:** Capacitor + React + TypeScript

---

## API Information

### Base URL
```
Development: http://127.0.0.1:8001/api/v1
Production: https://api.tapzy.id/v1 (TBD)
```

### Authentication
- **Type:** JWT Bearer Token
- **Header:** `Authorization: Bearer {token}`
- **Token Refresh:** `POST /auth/refresh`

### Response Format
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }  // validation errors
}
```

---

## API Endpoints

### 1. Authentication

#### Login Guardian
```
POST /auth/guardian/login
Content-Type: application/json

Request:
{
  "email": "string",
  "password": "string",
  "device_name": "string|null"
}

Response (200):
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": { "id": "uuid", "name": "string", "email": "string" },
    "guardian": {
      "id": "uuid",
      "nik": "string",
      "phone": "string",
      "is_verified": boolean,
      "approved_members_count": number,
      "pending_claims_count": number
    },
    "token": "jwt_token",
    "token_type": "Bearer"
  }
}
```

#### Register Guardian
```
POST /auth/guardian/register
Content-Type: application/json

Request:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "phone": "string",
  "nik": "string|null"
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "guardian",
    "guardian": { ... },
    "member": null
  }
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer {token}
```

#### Refresh Token
```
POST /auth/refresh
Authorization: Bearer {token}

Response:
{
  "token": "new_jwt_token",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

### 2. Guardian Profile

#### Get Profile
```
GET /guardian/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "user": { "id", "name", "email" },
    "guardian": { "id", "nik", "phone", "is_verified", ... }
  }
}
```

---

### 3. Members (Anak)

#### List Members
```
GET /guardian/members
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "uuid",
        "member_number": "string",
        "name": "string",
        "organization": { "id", "name" },
        "wallets": [...],
        "claim_status": "approved",
        "relationship": "parent|guardian|other",
        "permissions": {
          "is_primary": boolean,
          "can_topup": boolean,
          "can_view_transactions": boolean,
          "can_set_limits": boolean
        }
      }
    ],
    "count": number
  }
}
```

#### Get Member Detail
```
GET /guardian/members/{memberId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "member_number": "string",
    "name": "string",
    "photo_url": "string|null",
    "birth_date": "YYYY-MM-DD",
    "gender": "male|female",
    "grade": "string",
    "class_name": "string",
    "is_active": boolean,
    "organization": { "id", "name", "sector_type" },
    "permissions": { ... },
    "wallets": [...]
  }
}
```

#### Claim Member (Daftarkan Anak)
```
POST /guardian/claim
Authorization: Bearer {token}

Request:
{
  "nisn": "string",
  "name": "string",  // untuk verifikasi
  "relationship": "parent|guardian|other"
}

Response (201):
{
  "success": true,
  "message": "Claim berhasil diajukan",
  "data": {
    "claim_status": "pending",
    "member": { ... }
  }
}
```

---

### 4. Wallets

#### Get Member Wallets
```
GET /guardian/members/{memberId}/wallets
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "member": { "id", "name", "member_number" },
    "wallets": [
      {
        "id": "uuid",
        "wallet_type": "main|savings|meal_allowance|transport",
        "wallet_type_label": "Dompet Utama",
        "balance": "150000.00",
        "pending_balance": "0.00",
        "total_balance": "150000.00",
        "currency": "IDR",
        "is_primary": boolean,
        "is_active": boolean,
        "is_frozen": boolean,
        "frozen_reason": "string|null",
        "status_label": "Aktif",
        "spending_limits": [...]
      }
    ],
    "total_balance": "150000.00"
  }
}
```

#### Top-up Wallet
```
POST /guardian/members/{memberId}/wallets/{walletId}/topup
Authorization: Bearer {token}

Request:
{
  "amount": number,        // min: 1000, max: 10000000
  "password": "string",    // guardian password for verification
  "notes": "string|null"
}

Response (200):
{
  "success": true,
  "message": "Top-up berhasil",
  "data": {
    "wallet": {
      "id": "uuid",
      "wallet_type": "main",
      "balance_before": "100000.00",
      "amount_added": "50000.00",
      "balance_after": "150000.00"
    },
    "member": { "id", "name" }
  }
}
```

---

### 5. Transactions

#### Get Member Transactions
```
GET /guardian/members/{memberId}/transactions
Authorization: Bearer {token}

Query params:
- per_page: number (default: 15)
- wallet_id: uuid (optional filter)
- page: number

Response:
{
  "success": true,
  "data": {
    "member": { "id", "name", "member_number" },
    "transactions": [
      {
        "id": "uuid",
        "transaction_code": "TRX-xxxxx",
        "transaction_type": "purchase|topup|transfer",
        "amount": "25000.00",
        "status": "completed|pending|failed",
        "wallet": { "id", "wallet_type", "wallet_type_label" },
        "tenant": { "id", "name" },
        "items": [
          {
            "product": { "id", "name" },
            "quantity": 2,
            "unit_price": "5000.00",
            "total": "10000.00"
          }
        ],
        "created_at": "2025-12-11T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 15,
      "total": 67
    }
  }
}
```

#### Get Deposit History
```
GET /guardian/deposits
Authorization: Bearer {token}

Query params:
- per_page: number (default: 15)
- page: number

Response:
{
  "success": true,
  "data": {
    "deposits": [
      {
        "id": "uuid",
        "deposit_code": "DEP-xxxxx",
        "amount": "50000.00",
        "payment_method": "cash|transfer|ewallet",
        "payment_method_label": "Tunai",
        "status": "completed|pending",
        "status_label": "Berhasil",
        "processed_at": "2025-12-11T10:30:00Z",
        "created_at": "2025-12-11T10:30:00Z",
        "member": { "id", "name", "member_number" },
        "wallet": { "id", "wallet_type", "wallet_type_label" }
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 6. Spending Limits

#### List Spending Limits
```
GET /guardian/members/{memberId}/spending-limits
Authorization: Bearer {token}
```

#### Create Spending Limit
```
POST /guardian/members/{memberId}/spending-limits
Authorization: Bearer {token}

Request:
{
  "wallet_id": "uuid",
  "limit_type": "daily|weekly|monthly|per_transaction",
  "amount": number,
  "is_active": boolean
}
```

#### Update Spending Limit
```
PUT /guardian/members/{memberId}/spending-limits/{limitId}
Authorization: Bearer {token}
```

#### Delete Spending Limit
```
DELETE /guardian/members/{memberId}/spending-limits/{limitId}
Authorization: Bearer {token}
```

---

## App Screens (Suggested)

### Auth Flow
1. **Splash Screen** - Logo + loading
2. **Login Screen** - Email, password, login button, register link
3. **Register Screen** - Name, email, phone, password, NIK (optional)

### Main Flow (After Login)
4. **Home/Dashboard**
   - Guardian name
   - Quick summary: total balance semua anak
   - List anak dengan balance masing-masing
   - Recent transactions

5. **Member Detail**
   - Foto & info anak
   - List wallets dengan balance
   - Quick top-up button
   - Transaction history button
   - Spending limits button

6. **Wallet Detail**
   - Balance besar
   - Top-up button
   - Transaction list untuk wallet ini
   - Spending limits untuk wallet ini

7. **Top-up Screen**
   - Select wallet (if multiple)
   - Input amount (preset: 10k, 25k, 50k, 100k)
   - Password confirmation
   - Confirm button

8. **Transaction History**
   - Filter by wallet
   - List transactions dengan infinite scroll
   - Transaction detail modal

9. **Deposit History**
   - List semua top-up yang pernah dilakukan

10. **Spending Limits**
    - List current limits
    - Add/edit/delete limits

11. **Profile/Settings**
    - Guardian info
    - Change password
    - Logout

---

## Suggested Project Structure

```
tapzy-mobile/
├── src/
│   ├── api/
│   │   ├── client.ts         # Axios instance + interceptors
│   │   ├── auth.ts           # Auth API calls
│   │   ├── guardian.ts       # Guardian API calls
│   │   ├── members.ts        # Members API calls
│   │   └── types.ts          # API response types
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx   # Auth state management
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── pages/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── member/
│   │   ├── wallet/
│   │   └── settings/
│   ├── utils/
│   │   ├── storage.ts        # Capacitor Preferences
│   │   └── format.ts         # Currency, date formatters
│   ├── App.tsx
│   └── main.tsx
├── android/                   # Capacitor Android
├── ios/                       # Capacitor iOS (optional)
├── capacitor.config.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## Key Libraries

```json
{
  "dependencies": {
    "@capacitor/core": "^6.x",
    "@capacitor/android": "^6.x",
    "@capacitor/preferences": "^6.x",    // Token storage
    "@capacitor/splash-screen": "^6.x",
    "@capacitor/status-bar": "^6.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "@tanstack/react-query": "^5.x",     // API state management
    "tailwindcss": "^3.x"                // Styling
  }
}
```

---

## Notes

1. **Password verification** required for top-up (security)
2. **JWT token** expires, implement refresh token flow
3. **Offline support** not required for MVP
4. **Push notifications** can be added later (Laravel Reverb ready)
5. **Fingerprint in app** NOT needed - registration done at school hardware

---

## Getting Started Command

```bash
cd /home/rahmat/js-project/tapzy-mobile
claude

# Then say:
# "Setup Capacitor + React + TypeScript project untuk Tapzy Guardian mobile app.
#  Brief ada di /home/rahmat/laravel-project/peezy/docs/MOBILE_APP_BRIEF.md"
```
