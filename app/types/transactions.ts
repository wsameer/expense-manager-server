export const TransactionType = {
  BANK_TO_BANK: 'bank_to_bank',
  EXPENSE: 'expense',
  INCOME: 'income',
} as const

// Create a type from the values
export type TransactionType = (typeof TransactionType)[keyof Pick<
  typeof TransactionType,
  'BANK_TO_BANK' | 'EXPENSE' | 'INCOME'
>]
