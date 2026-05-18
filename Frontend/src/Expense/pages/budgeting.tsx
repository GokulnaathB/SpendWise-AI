import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./budgeting.module.css";

export default function Budgeting() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("Jan");
  const [budget, setBudget] = useState("");
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
  const monthToNumMap = new Map();
  monthToNumMap.set("Jan", "01");
  monthToNumMap.set("Feb", "02");
  monthToNumMap.set("Mar", "03");
  monthToNumMap.set("Apr", "04");
  monthToNumMap.set("May", "05");
  monthToNumMap.set("Jun", "06");
  monthToNumMap.set("Jul", "07");
  monthToNumMap.set("Aug", "08");
  monthToNumMap.set("Sep", "09");
  monthToNumMap.set("Oct", "10");
  monthToNumMap.set("Nov", "11");
  monthToNumMap.set("Dec", "12");
  const navigate = useNavigate();
  const handleSetBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/addBudget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          year: year.toString(),
          month: monthToNumMap.get(month),
          budget,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      alert(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/updateBudget", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          year: year.toString(),
          month: monthToNumMap.get(month),
          budget,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      alert(data.message);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <h2 style={{ textAlign: "center" }}>Stay Budgeted, Stay Stress-Free!</h2>
      <div className={styles.budgetPage}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.budgetForm}
        >
          <div>
            <input
              required
              placeholder="Year"
              type="number"
              onChange={(e) => setYear(e.target.value)}
            ></input>
          </div>
          <div>
            <select onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              required
              placeholder="Budget (INR)"
              type="number"
              onChange={(e) => setBudget(e.target.value)}
            ></input>
          </div>
          <div className={styles.setBudgetAndUpdateBudget}>
            <button onClick={handleSetBudget}>Set Budget</button>
            <button onClick={handleUpdateBudget}>Update Budget</button>
          </div>
        </form>
        <button
          onClick={() =>
            navigate(`/expenses/${new Date().toLocaleDateString("en-CA")}`)
          }
          className={styles.cancelBudgeting}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
