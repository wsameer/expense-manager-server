/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  ExpenseSubcategoryPolicy: () => import('#policies/expense_subcategory_policy'),
  ExpenseCategoryPolicy: () => import('#policies/expense_category_policy'),
  IncomeCategoryPolicy: () => import('#policies/income_category_policy'),
  AccountPolicy: () => import('#policies/account_policy'),
  TransactionPolicy: () => import('#policies/transaction_policy')
}
