import Transaction from '#models/transaction'
import { TransactionType } from '../types/transactions.js'

export class TransactionService {
  public async updateTransactionBalance(
    transaction: Transaction,
    oldAmount: number,
    newAmount: number
  ) {
    if (oldAmount === newAmount) return

    switch (transaction.type.toString()) {
      case TransactionType.BANK_TO_BANK:
        if (!transaction.fromAccount || !transaction.toAccount) {
          throw new Error('fromAccount or toAccount not loaded for BANK_TO_BANK transaction')
        }
        await transaction.fromAccount.incrementBalance(oldAmount)
        await transaction.fromAccount.decrementBalance(newAmount)
        await transaction.toAccount.decrementBalance(oldAmount)
        await transaction.toAccount.incrementBalance(newAmount)
        break

      case TransactionType.EXPENSE:
        if (!transaction.fromAccount) {
          throw new Error('fromAccount not loaded for EXPENSE transaction')
        }
        await transaction.fromAccount.incrementBalance(oldAmount)
        await transaction.fromAccount.decrementBalance(newAmount)
        break

      case TransactionType.INCOME:
        if (!transaction.toAccount) {
          throw new Error('toAccount not loaded for INCOME transaction')
        }
        await transaction.toAccount.decrementBalance(oldAmount)
        await transaction.toAccount.incrementBalance(newAmount)
        break
    }
  }
}
