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
        await transaction.fromAccount.incrementBalance(oldAmount)
        await transaction.fromAccount.decrementBalance(newAmount)
        await transaction.toAccount.decrementBalance(oldAmount)
        await transaction.toAccount.incrementBalance(newAmount)
        break

      case TransactionType.EXPENSE:
        await transaction.fromAccount.incrementBalance(oldAmount)
        await transaction.fromAccount.decrementBalance(newAmount)
        break

      case TransactionType.INCOME:
        await transaction.fromAccount.decrementBalance(oldAmount)
        await transaction.fromAccount.incrementBalance(newAmount)
        break
    }
  }
}
