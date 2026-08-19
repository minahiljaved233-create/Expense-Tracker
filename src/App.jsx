import { useState } from "react"

function App() {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
 const [transactions, setTransactions] = useState(() => {
  const savedTransactions = localStorage.getItem("transactions")

  return savedTransactions
    ? JSON.parse(savedTransactions)
    : []
})
const [editingId, setEditingId] = useState(null)
  const totalExpenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((total, transaction) => total + transaction.amount, 0)

const income = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((total, transaction) => total + transaction.amount, 0)

const balance = income - totalExpenses

  function addTransaction() {
  if (description.trim() === "" || amount === "") {
    return
  }

  const updatedTransaction = {
  id: editingId ?? Date.now(),
  description: description,
  amount: Number(amount),
  type: type,
  date: new Date().toLocaleDateString(),
}
  let updatedTransactions

  if (editingId !== null) {
    updatedTransactions = transactions.map((transaction) =>
      transaction.id === editingId
        ? updatedTransaction
        : transaction
    )
  } else {
    updatedTransactions = [
      ...transactions,
      updatedTransaction,
    ]
  }

  setTransactions(updatedTransactions)

  localStorage.setItem(
    "transactions",
    JSON.stringify(updatedTransactions)
  )

  setDescription("")
  setAmount("")
  setType("expense")
  setEditingId(null)
}
  return (
    <div className="app">
      <div className="container">

        <h1>Expense Tracker</h1>
        <p>Track your income and expenses</p>

        <div className="balance-card">
          <h2>Balance</h2>
         <h3>${balance}</h3>
        </div>

        <div className="summary">
          <div>
            <h3>Income</h3>
          <p>${income}</p>
          </div>

          <div>
            <h3>Expenses</h3>
           <p>${totalExpenses}</p>
          </div>
        </div>

        <div className="expense-form">
          <h2>Add Transaction</h2>

          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
<select
  value={type}
  onChange={(e) => setType(e.target.value)}
>
  <option value="expense">Expense</option>
  <option value="income">Income</option>
</select>
      
      <button onClick={addTransaction}>
  {editingId !== null ? "Save Changes" : "Add Transaction"}
</button>

        </div>
<div className="transactions">
  <h2>Transactions</h2>
{transactions.length === 0 && (
  <p className="empty-message">
    No transactions yet. Add your first transaction!
  </p>
)}

  {transactions.map((transaction) => (
    <div className="transaction" key={transaction.id}>
     <div>
  <strong>{transaction.description}</strong>
  <small>{transaction.date}</small>
</div>
<span className={transaction.type}>
  {transaction.type === "income" ? "+" : "-"}$
  {transaction.amount}
</span>
      <button
  onClick={() => {
    setEditingId(transaction.id)
    setDescription(transaction.description)
    setAmount(transaction.amount)
    setType(transaction.type)
  }}
>
  Edit
</button>
        <button
          onClick={() => {
            setTransactions(
              transactions.filter(
                (item) => item.id !== transaction.id
              )
            )
          }}
        >
          Delete
        </button>
      
    </div>
  ))}
</div>

      </div>
    </div>
  )
}

export default App