// Base API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Guardian {
  id: string;
  nik: string | null;
  phone: string | null;
  is_verified: boolean;
  phone_verified_at: string | null;
  approved_members_count?: number;
  pending_claims_count?: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

export interface LoginResponse {
  user: User;
  guardian: Guardian;
  token: string;
  token_type: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  nik?: string;
}

export interface AuthMeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  guardian: Guardian | null;
  member: null;
}

export interface RefreshTokenResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  sector_type?: string;
}

// Member Types
export interface MemberPermissions {
  is_primary: boolean;
  can_topup: boolean;
  can_view_transactions: boolean;
  can_set_limits: boolean;
}

export interface Member {
  id: string;
  member_number: string;
  name: string;
  photo_url?: string | null;
  birth_date?: string;
  gender?: 'male' | 'female';
  grade?: string;
  class_name?: string;
  is_active?: boolean;
  organization: Organization;
  wallets?: Wallet[];
  claim_status?: string;
  relationship?: 'parent' | 'guardian' | 'other';
  permissions: MemberPermissions;
}

export interface MembersResponse {
  members: Member[];
  count: number;
}

export interface ClaimMemberRequest {
  nisn: string;
  name: string;
  relationship: 'parent' | 'guardian' | 'other';
}

// Wallet Types
export interface SpendingLimitWallet {
  id: string;
  wallet_type: string;
  wallet_type_label: string;
  wallet_name: string;
}

export interface SpendingLimit {
  id: string;
  wallet_id: string;
  wallet: SpendingLimitWallet;
  set_by_type: string;
  limit_name: string;
  daily_limit: string;
  per_transaction_limit: string;
  allowed_start_time: string | null;
  allowed_end_time: string | null;
  effective_from: string | null;
  effective_until: string | null;
  apply_on: 'all_days' | 'weekdays' | 'weekends' | 'specific_dates';
  specific_dates: string[] | null;
  priority: number;
  allowed_categories: string[] | null;
  blocked_categories: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Simple spending limit for wallet list response (backward compat)
export interface SimpleSpendingLimit {
  id: string;
  limit_type: 'daily' | 'weekly' | 'monthly' | 'per_transaction';
  amount: string;
  is_active: boolean;
}

export interface Wallet {
  id: string;
  wallet_type: 'main' | 'savings' | 'meal_allowance' | 'transport';
  wallet_type_label: string;
  balance: string;
  pending_balance: string;
  total_balance: string;
  currency: string;
  is_primary: boolean;
  is_active: boolean;
  is_frozen: boolean;
  frozen_reason: string | null;
  status_label: string;
  spending_limits?: SpendingLimit[];
}

export interface WalletsResponse {
  member: Pick<Member, 'id' | 'name' | 'member_number'>;
  wallets: Wallet[];
  total_balance: string;
}

export interface TopupRequest {
  amount: number;
  password: string;
  notes?: string;
}

export interface TopupResponse {
  wallet: {
    id: string;
    wallet_type: string;
    balance_before: string;
    amount_added: string;
    balance_after: string;
  };
  member: Pick<Member, 'id' | 'name'>;
}

// Transaction Types
export interface TransactionItem {
  id: string;
  product: { id: string; name: string; sku?: string };
  quantity: number;
  unit_price: string;
  subtotal: string;
  discount: string;
  total: string;
}

export interface Transaction {
  id: string;
  transaction_code: string;
  transaction_type: 'purchase' | 'topup' | 'transfer' | 'payment' | 'deposit' | null;
  transaction_type_label?: string;
  amount: string;
  subtotal?: string;
  discount?: string;
  tax?: string;
  total?: string;
  status: 'completed' | 'pending' | 'failed';
  status_label?: string;
  notes?: string | null;
  wallet: Pick<Wallet, 'id' | 'wallet_type' | 'wallet_type_label'>;
  tenant?: { id: string; name: string };
  items?: TransactionItem[];
  created_at: string;
  updated_at?: string;
}

export interface TransactionsResponse {
  member: Pick<Member, 'id' | 'name' | 'member_number'>;
  transactions: Transaction[];
  pagination: PaginationMeta;
}

// Deposit Types
export interface Deposit {
  id: string;
  deposit_code: string;
  amount: string;
  payment_method: 'cash' | 'transfer' | 'ewallet';
  payment_method_label: string;
  status: 'completed' | 'pending';
  status_label: string;
  processed_at: string | null;
  created_at: string;
  member: Pick<Member, 'id' | 'name' | 'member_number'>;
  wallet: Pick<Wallet, 'id' | 'wallet_type' | 'wallet_type_label'>;
}

export interface DepositsResponse {
  deposits: Deposit[];
  pagination: PaginationMeta;
}

// Spending Limit Types
export interface SpendingLimitsResponse {
  member: Pick<Member, 'id' | 'name' | 'member_number'>;
  spending_limits: SpendingLimit[];
  count: number;
}

export interface CreateSpendingLimitRequest {
  wallet_id: string;
  limit_name?: string;
  daily_limit?: number;
  per_transaction_limit?: number;
  allowed_start_time?: string;
  allowed_end_time?: string;
  effective_from?: string;
  effective_until?: string;
  apply_on?: 'all_days' | 'weekdays' | 'weekends' | 'specific_dates';
  specific_dates?: string[];
  priority?: number;
  allowed_categories?: string[];
  blocked_categories?: string[];
  is_active?: boolean;
}

export interface UpdateSpendingLimitRequest {
  limit_name?: string;
  daily_limit?: number;
  per_transaction_limit?: number;
  allowed_start_time?: string;
  allowed_end_time?: string;
  effective_from?: string;
  effective_until?: string;
  apply_on?: 'all_days' | 'weekdays' | 'weekends' | 'specific_dates';
  specific_dates?: string[];
  priority?: number;
  allowed_categories?: string[];
  blocked_categories?: string[];
  is_active?: boolean;
}
