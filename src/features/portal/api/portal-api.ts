import { baseApi, bff } from "@/lib/api/base-api";
import { buildQuery, fromBareArray, fromInlineEnvelope, fromMetaEnvelope } from "@/lib/api/pagination";
import { listTag, listTags, MONEY_MOVEMENT_TAGS } from "@/lib/api/tags";
import type { ApiSuccess, Paginated } from "@/types/api";
import type {
  ActiveTradeSessionResponse,
  AppNotification,
  CurrentRank,
  CycleBonus,
  RecentTrade,
  Referral,
  ReferralBonus,
  ReferralStatistics,
  ReferralTreeNode,
  Setting,
  SubmitTradeCodeResult,
  Trade,
  TradeStatistics,
} from "@/types/models";
import type { TradeStatus, TradeType } from "@/types/enums";

export interface TradeParams {
  page?: number;
  limit?: number;
  status?: TradeStatus;
  tradeType?: TradeType;
  startDate?: string;
  endDate?: string;
}

export interface ReferralBonusParams {
  page?: number;
  limit?: number;
  level?: number;
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  read?: boolean;
}

export const portalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trades: builder.query<Paginated<Trade>, TradeParams | void>({
      query: (params) => ({ url: bff("/trades/history"), params: buildQuery({ ...(params ?? {}) }) }),
      transformResponse: (response: unknown) => fromMetaEnvelope<Trade>(response),
      providesTags: (result) => listTags("Trade", result?.items),
    }),
    tradeStatistics: builder.query<TradeStatistics, void>({
      query: () => bff("/trades/stats"),
      transformResponse: (response: ApiSuccess<TradeStatistics>) => response.data,
      providesTags: ["TradeStats"],
    }),
    recentTrades: builder.query<Paginated<RecentTrade>, { limit?: number } | void>({
      query: (params) => ({ url: bff("/trades/recent"), params: params ? buildQuery({ ...params }) : undefined }),
      transformResponse: (response: unknown) => fromBareArray<RecentTrade>(response),
      providesTags: ["Trade"],
    }),
    /**
     * Live trade session — one shared code per window, valid 15 minutes.
     * Components poll this with `pollingInterval` to drive the countdown.
     */
    activeSession: builder.query<ActiveTradeSessionResponse, void>({
      query: () => bff("/trades/active-session"),
      transformResponse: (response: ApiSuccess<ActiveTradeSessionResponse>) =>
        response.data,
    }),
    /**
     * Manual trade entry — code submit. Settles instantly, so every
     * money-shaped tag must be dropped: profit moved, principal was locked
     * and returned, and the ledger gained rows.
     */
    submitTradeCode: builder.mutation<SubmitTradeCodeResult, { code: string }>({
      query: (body) => ({ url: bff("/trades/submit-code"), method: "POST", body }),
      transformResponse: (response: ApiSuccess<SubmitTradeCodeResult>) =>
        response.data,
      invalidatesTags: [
        listTag("Trade"),
        "TradeStats",
        ...MONEY_MOVEMENT_TAGS,
      ],
    }),
    directReferrals: builder.query<Paginated<Referral>, void>({
      query: () => bff("/referrals/referrals"),
      transformResponse: (response: unknown) => fromBareArray<Referral>(response),
      providesTags: (result) => listTags("Referral", result?.items),
    }),
    referralTree: builder.query<ReferralTreeNode, number | void>({
      query: (maxLevel) => ({ url: bff("/referrals/tree"), params: maxLevel ? { maxLevel } : undefined }),
      transformResponse: (response: ApiSuccess<ReferralTreeNode>) => response.data,
      providesTags: ["ReferralTree"],
    }),
    referralBonuses: builder.query<Paginated<ReferralBonus>, ReferralBonusParams | void>({
      query: (params) => ({ url: bff("/referrals/bonuses"), params: buildQuery({ ...(params ?? {}) }) }),
      transformResponse: (response: unknown) => fromMetaEnvelope<ReferralBonus>(response),
      providesTags: (result) => listTags("ReferralBonus", result?.items),
    }),
    referralStatistics: builder.query<ReferralStatistics, void>({
      query: () => bff("/referrals/statistics"),
      transformResponse: (response: ApiSuccess<ReferralStatistics>) => response.data,
      providesTags: ["ReferralStats"],
    }),
    referralLink: builder.query<string, void>({
      query: () => bff("/referrals/link"),
      transformResponse: (response: ApiSuccess<{ referralLink: string }>) =>
        response.data.referralLink,
      providesTags: ["Referral"],
    }),
    currentRank: builder.query<CurrentRank, void>({
      query: () => bff("/ranks/current"),
      transformResponse: (response: ApiSuccess<CurrentRank>) => response.data,
      providesTags: ["Rank"],
    }),
    cycleBonuses: builder.query<Paginated<CycleBonus>, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: bff("/cycle-bonuses/history"), params: buildQuery({ ...(params ?? {}) }) }),
      transformResponse: (response: unknown) => fromMetaEnvelope<CycleBonus>(response),
      providesTags: (result) => listTags("CycleBonus", result?.items),
    }),
    notifications: builder.query<Paginated<AppNotification>, NotificationParams | void>({
      query: (params) => ({ url: bff("/notifications"), params: buildQuery({ ...(params ?? {}) }) }),
      transformResponse: (response: unknown) => fromInlineEnvelope<AppNotification>(response, "notifications"),
      providesTags: (result) => listTags("Notification", result?.items),
    }),
    markNotificationRead: builder.mutation<AppNotification, string>({
      query: (id) => ({ url: bff(`/notifications/${id}/read`), method: "PUT" }),
      transformResponse: (response: ApiSuccess<AppNotification>) => response.data,
      invalidatesTags: (_result, _error, id) => [{ type: "Notification", id }, listTag("Notification"), "NotificationCount"],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: bff("/notifications/read-all"), method: "PUT" }),
      invalidatesTags: [listTag("Notification"), "NotificationCount"],
    }),
    settings: builder.query<Paginated<Setting>, void>({
      query: () => bff("/settings"),
      transformResponse: (response: unknown) => fromBareArray<Setting>(response),
      providesTags: ["Setting"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useTradesQuery,
  useTradeStatisticsQuery,
  useRecentTradesQuery,
  useActiveSessionQuery,
  useSubmitTradeCodeMutation,
  useDirectReferralsQuery,
  useReferralTreeQuery,
  useReferralBonusesQuery,
  useReferralStatisticsQuery,
  useReferralLinkQuery,
  useCurrentRankQuery,
  useCycleBonusesQuery,
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useSettingsQuery,
} = portalApi;
