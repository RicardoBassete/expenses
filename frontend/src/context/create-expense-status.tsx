import { createContext, useState, useContext, ReactNode } from 'react'

type Expense = {
  title: string
  amount: string
  date: string
}

type ExpenseContextType = {
  newExpense: Expense | null
  setNewExpense: (expense: Expense | null) => void
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

type ExpenseProviderProps = {
  children: ReactNode
}

export function CreateExpenseStatusProvider({ children }: ExpenseProviderProps) {
  const [newExpense, setNewExpense] = useState<Expense | null>(null)

  const value = {
    newExpense,
    setNewExpense,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export function useCreateExpenseStatus() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error('useCreateExpenseStatus must be used within an ExpenseProvider')
  }
  return context
}
