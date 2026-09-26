// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type GovIdType = "AADHAAR" | "PAN" | "PASSPORT" | "DRIVING_LICENSE" | "VOTER_ID";
export type RankLevel = "LV1" | "LV2" | "LV3" | "LV4" | "LV5" | "LV6" | "LV7";

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  role: UserRole;
  referralCode: string;
  sponsorId?: string;
  walletAddress?: string;
  rank: RankLevel;
  autoTradeStatus: boolean;
  status: UserStatus;
  isContentCreator: boolean;
  emailVerified: boolean;
  govIdType?: GovIdType;
  govIdUrl?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Wallet Types
// ============================================================================

export type WalletType =
  | "PRINCIPAL"
  | "DEPOSIT_BONUS"
  | "REFERRAL"
  | "TRADING_PROFIT"
  | "RANK_BONUS"
  | "POOL_BONUS"
  | "ADMIN_COMMISSION";

export interface Wallet {
  id: string;
  userId: string;
  type: WalletType;
  balance: string;
  totalCredit: string;
  totalDebit: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletSummary {
  principal?: WalletInfo;
  depositBonus?: WalletInfo;
  referral?: WalletInfo;
  tradingProfit?: WalletInfo;
  rankBonus?: WalletInfo;
  poolBonus?: WalletInfo;
  adminCommission?: WalletInfo;
  totalBalance: string;
}

export interface WalletInfo {
  balance: string;
  totalCredit: string;
  totalDebit: string;
}

// ============================================================================
// Deposit Types
// ============================================================================

export type DepositStatus = "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";

export interface Deposit {
  id: string;
  userId: string;
  amount: string;
  transactionHash: string;
  senderAddress: string;
  receiverAddress: string;
  tokenContract: string;
  network: string;
  blockNumber?: string;
  confirmations: number;
  requiredConfirmations: number;
  status: DepositStatus;
  bonusAmount: string;
  verifiedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// ============================================================================
// Withdrawal Types
// ============================================================================

export type WithdrawalStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED";
export type WithdrawalWalletType = WalletType;

export interface Withdrawal {
  id: string;
  userId: string;
  walletType: WithdrawalWalletType;
  amount: string;
  fee: string;
  penalty: string;
  netAmount: string;
  destinationAddress: string;
  transactionHash?: string;
  network: string;
  gasFee?: string;
  status: WithdrawalStatus;
  adminId?: string;
  processedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// ============================================================================
// Trade Types
// ============================================================================

export type TradeStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type TradeType = "MORNING" | "EVENING";

export interface Trade {
  id: string;
  userId: string;
  tradeAmount: string;
  profit: string;
  commission: string;
  status: TradeStatus;
  entryTime: string;
  exitTime?: string;
  settlementTime?: string;
  tradeType: TradeType;
  profitPercentage?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// ============================================================================
// Referral Types
// ============================================================================

export interface Referral {
  id: string;
  userId: string;
  sponsorId?: string;
  level: number;
  directDepositAmount: string;
  teamDepositAmount: string;
  directReferralCount: number;
  teamSize: number;
  totalBonusEarned: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralBonus {
  id: string;
  referralId: string;
  userId: string;
  depositId: string;
  depositAmount: string;
  bonusPercentage: string;
  bonusAmount: string;
  level: number;
  status: DepositStatus;
  creditedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Rank Types
// ============================================================================

export interface Rank {
  id: string;
  userId: string;
  level: RankLevel;
  directReferrals: number;
  teamSize: number;
  directLv1Count: number;
  requirements?: Record<string, unknown>;
  achievedAt: string;
  totalRankBonusEarned: string;
  totalCycleBonusEarned: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "TRADE"
  | "REFERRAL"
  | "RANK"
  | "CYCLE_BONUS"
  | "POOL_BONUS"
  | "SYSTEM"
  | "SECURITY";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

// ============================================================================
// Ledger Types
// ============================================================================

export type LedgerType =
  | "DEPOSIT"
  | "DEPOSIT_BONUS"
  | "WITHDRAWAL"
  | "WITHDRAWAL_FEE"
  | "PENALTY"
  | "REFUND"
  | "TRADE_ENTRY"
  | "TRADE_EXIT"
  | "TRADE_PROFIT"
  | "ADMIN_COMMISSION"
  | "REFERRAL_BONUS"
  | "RANK_BONUS"
  | "CYCLE_BONUS"
  | "POOL_BONUS"
  | "COMPOUND_TRANSFER";

export interface Ledger {
  id: string;
  userId: string;
  walletId: string;
  type: LedgerType;
  referenceId?: string;
  referenceType?: string;
  beforeBalance: string;
  afterBalance: string;
  credit: string;
  debit: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardData {
  user: User;
  wallets: WalletSummary;
  stats: {
    totalDeposits: string;
    totalWithdrawals: string;
    totalTrades: number;
    totalProfit: string;
    totalReferralBonus: string;
    activeReferrals: number;
  };
  recentTrades: Trade[];
  recentDeposits: Deposit[];
}

// ============================================================================
// Admin Types
// ============================================================================

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: string;
  totalWithdrawals: string;
  totalTrades: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalTradingVolume: string;
  totalProfitDistributed: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  role: UserRole;
  referralCode: string;
  rank: RankLevel;
  status: UserStatus;
  autoTradeStatus: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

// ============================================================================
// Content Types
// ============================================================================

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}
