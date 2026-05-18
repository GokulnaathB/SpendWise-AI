import { useState } from "react";
import ExpenseChart from "../components/barChart";
import styles from "./dashboard.module.css";

type mWT = {
  month: string;
  total: number;
};
export default function Dashboard() {
  const [year, setYear] = useState("");
  const [monthWiseTotal, setMonthWiseTotal] = useState<mWT[]>([]);
  const handleVisualize = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          year: year.toString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      setMonthWiseTotal(data.monthWiseTotal);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className={styles.dashboard}>
        <h1>Dashboard</h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.dashboardForm}
        >
          <input
            required
            placeholder="Year"
            type="number"
            onChange={(e) => setYear(e.target.value)}
          ></input>
          <button onClick={handleVisualize}>Visualize</button>
        </form>
      </div>
      <div>
        {monthWiseTotal.length > 0 ? (
          <ExpenseChart data={monthWiseTotal} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
