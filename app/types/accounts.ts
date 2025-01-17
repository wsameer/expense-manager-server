export const AccountStatsType = ['asset', 'debt', 'total'] as const

export type AccountStatsTypeEnum = (typeof AccountStatsType)[number]

export const AccountType = ['CASH', 'CHEQUING', 'CREDIT_CARD', 'SAVINGS', 'INVESTMENTS'] as const
