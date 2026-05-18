import { useState } from "react";
import styles from "./downloadExpenses.module.css";
type Expense = {
  _id: string;
  userId: string;
  nameOfTheExpense: string;
  category: string;
  cost: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export default function DownloadExpenses() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [yearY, setYearY] = useState("");
  const [monthM, setMonthM] = useState("Jan");
  const [yearM, setYearM] = useState("");
  const [mode, setMode] = useState("");
  const [yearlyExpenses, setYearlyExpenses] = useState<Expense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [totalY, setTotalY] = useState<number>();
  const [totalM, setTotalM] = useState<number>();
  const [messageY, setMessageY] = useState("");
  const [messageM, setMessageM] = useState("");

  const handleGetYearlyExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://spendwise-ai-2cho.onrender.com/getYearly",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ yearForYearly: yearY }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      if (data.expenses.length === 0) {
        setMessageY(`You've made no expenses in ${yearY}.`);
        return;
      }
      let total = 0;
      for (let i = 0; i < data.expenses.length; i += 1)
        total += data.expenses[i].cost;
      setYearlyExpenses(data.expenses);
      setTotalY(total);
    } catch (e) {
      console.log(e);
    }
  };
  const handleGetMonthlyExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://spendwise-ai-2cho.onrender.com/getMonthly",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            monthForMonthly: monthM,
            yearForMonthly: yearM,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      if (data.expenses.length === 0) {
        setMessageM(`You've made no expenses in ${monthM} ${yearM}.`);
        return;
      }
      let total = 0;
      for (let i = 0; i < data.expenses.length; i += 1)
        total += data.expenses[i].cost;
      setMonthlyExpenses(data.expenses);
      setTotalM(total);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={styles.downloadPage}>
      <select onChange={(e) => setMode(e.target.value)} className="no-print">
        <option value="">Select an option</option>
        <option key="yearly" value="yearly">
          Download yearly expenses
        </option>
        <option key="monthly" value="monthly">
          Download monthly expenses
        </option>
      </select>
      {mode === "yearly" && (
        <div>
          <h2 className="no-print">Download yearly expenses</h2>
          <div className={styles.form}>
            <input
              id="year"
              required
              placeholder="Year"
              type="number"
              onChange={(e) => setYearY(e.target.value)}
            ></input>
            <button onClick={handleGetYearlyExpenses} className="no-print">
              Get expenses
            </button>
          </div>
          {mode === "yearly" && yearlyExpenses.length !== 0 && (
            <div className={styles.expenseTable}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Cost (INR)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyExpenses.map((e) => (
                    <tr key={e._id}>
                      <td>{e.nameOfTheExpense}</td>
                      <td>{e.category}</td>
                      <td>{e.cost}</td>
                      <td>{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.totalPrint}>
                <h3>Total: {totalY} Rs.</h3>
                <button onClick={() => window.print()} className="no-print">
                  PRINT
                </button>
              </div>
            </div>
          )}
          {mode === "yearly" &&
            yearlyExpenses.length === 0 &&
            messageY !== "" && <p>{messageY}</p>}
        </div>
      )}
      {mode === "monthly" && (
        <div>
          <h2 className="no-print">Download monthly expenses</h2>
          <div className={styles.form}>
            <select onChange={(e) => setMonthM(e.target.value)}>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              id="year"
              required
              placeholder="Year"
              type="number"
              onChange={(e) => setYearM(e.target.value)}
            ></input>
            <button onClick={handleGetMonthlyExpenses} className="no-print">
              Get expenses
            </button>
          </div>
          {mode === "monthly" && monthlyExpenses.length !== 0 && (
            <div className={styles.expenseTable}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Cost (INR)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyExpenses.map((e) => (
                    <tr key={e._id}>
                      <td>{e.nameOfTheExpense}</td>
                      <td>{e.category}</td>
                      <td>{e.cost}</td>
                      <td>{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.totalPrint}>
                <h3>Total: {totalM} Rs.</h3>
                <button onClick={() => window.print()} className="no-print">
                  PRINT
                </button>
              </div>
            </div>
          )}
          {mode === "monthly" &&
            monthlyExpenses.length === 0 &&
            messageM !== "" && <p>{messageM}</p>}
        </div>
      )}
    </div>
  );
}
