// for transactions data
const allTransactions = [
  { id: 1,  name: "Grocery Shopping",     date: "2026-03-22 10:30 AM", category: "Food & Dining",  wallet: "Cash",   amount: -125.50 },
  { id: 2,  name: "Salary",               date: "2026-03-20 09:00 AM", category: "Income",         wallet: "Bank",   amount: 5700    },
  { id: 3,  name: "Uber Ride",            date: "2026-03-19 06:45 PM", category: "Transportation", wallet: "eSewa",  amount: -15.75  },
  { id: 4,  name: "Netflix Subscription", date: "2026-03-18 12:00 PM", category: "Entertainment",  wallet: "Bank",   amount: -12.99  },
  { id: 5,  name: "Freelance Project",    date: "2026-03-17 03:30 PM", category: "Income",         wallet: "Bank",   amount: 850     },
  { id: 6,  name: "Restaurant Dinner",    date: "2026-03-16 08:15 PM", category: "Food & Dining",  wallet: "Khalti", amount: -68.25  },
  { id: 7,  name: "Electricity Bill",     date: "2026-03-15 11:00 AM", category: "Bills",          wallet: "Bank",   amount: -45.00  },
  { id: 8,  name: "Online Course",        date: "2026-03-14 02:00 PM", category: "Education",      wallet: "eSewa",  amount: -29.99  },
  { id: 9,  name: "Freelance Design",     date: "2026-03-12 10:00 AM", category: "Income",         wallet: "Bank",   amount: 400     },
  { id: 10, name: "Gym Membership",       date: "2026-03-10 08:00 AM", category: "Health",         wallet: "Bank",   amount: -35.00  },
  { id: 11, name: "Coffee Shop",          date: "2026-03-09 09:30 AM", category: "Food & Dining",  wallet: "Cash",   amount: -8.50   },
  { id: 12, name: "Amazon Purchase",      date: "2026-03-07 05:00 PM", category: "Shopping",       wallet: "Bank",   amount: -92.00  },
]; 

function TransactionList() {
  const transactionItems = allTransactions.map((item) => (
    <li key={item.id}>
      <div className="type">
        <div className="type-info">
          <p className="para">{item.name}</p>
          <p className="type-category">{item.date}</p>
        </div>
      </div>

      <div className="category">
        <p>{item.category}</p>
        <p>{item.wallet}</p>
      </div>

      <span className={`list-amount ${item.amount > 0 ? "positive" : ""}`}>
        {item.amount}
      </span>
    </li>
  ));

  return (
    <div className="last-div">
      <p className="recent-transactions">Recent Transactions</p>
      <ul className="transaction-items">{transactionItems}</ul>
    </div>
  );
}

export default TransactionList;