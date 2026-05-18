import { useState } from "react";
import styles from "./howToSave.module.css";
import { LoaderCircle } from "lucide-react";

export default function HowToSave() {
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
  const [month, setMonth] = useState("Jan");
  const [year, setYear] = useState("");
  const [yearForYearly, setYearForYearly] = useState("");
  const [monthlyAnalysis, setMonthlyAnalysis] = useState("");
  const [yearlyAnalysis, setYearlyAnalysis] = useState("");
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [loadingYearly, setLoadingYearly] = useState(false);

  const handleAnalyzeMonthly = async () => {
    if (!year) return;
    setLoadingMonthly(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/analyzeMonthly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          year,
          month,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        setLoadingMonthly(false);
        return;
      }
      setMonthlyAnalysis(data.insights);
    } catch (err) {
      console.log(err);
    }
    setLoadingMonthly(false);
  };
  const handleAnalyzeYearly = async () => {
    if (!yearForYearly) return;
    setLoadingYearly(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/analyzeYearly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ yearForYearly }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        setLoadingYearly(false);
        return;
      }
      setYearlyAnalysis(data.insights);
    } catch (err) {
      console.log(err);
    }
    setLoadingYearly(false);
  };
  return (
    <>
      <h2 style={{ fontWeight: "400", textAlign: "center" }}>
        AI Powered Expense Insights
      </h2>
      <div className={styles.analyze}>
        <div>
          <h3
            style={{
              fontWeight: "300",
              textDecoration: "underline",
              textDecorationColor: "blue",
            }}
          >
            Analyze on a monthly basis
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              placeholder="year"
              type="number"
              onChange={(e) => setYear(e.target.value)}
              required
            ></input>
            <select onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button onClick={handleAnalyzeMonthly}>Analyze</button>
          </form>
          {loadingMonthly && <LoaderCircle className={styles.spin} />}
          {monthlyAnalysis && (
            <div className={styles.AIContent}>
              <h3>AI Insights</h3>
              <p>{monthlyAnalysis}</p>
            </div>
          )}
        </div>
        <div>
          <h3
            style={{
              fontWeight: "300",
              textDecoration: "underline",
              textDecorationColor: "blue",
            }}
          >
            Analyze on a yearly basis
          </h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              required
              placeholder="year"
              type="number"
              onChange={(e) => setYearForYearly(e.target.value)}
            ></input>
            <button onClick={handleAnalyzeYearly}>Analyze</button>
          </form>
          {loadingYearly && <LoaderCircle className={styles.spin} />}
          {yearlyAnalysis && (
            <div className={styles.AIContent}>
              <h3>AI Insights</h3>
              <p>{yearlyAnalysis}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
