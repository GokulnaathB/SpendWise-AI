import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./addExpense.module.css";

export default function AddExpense() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [nameOfTheExpense, setNameOfTheExpense] = useState("");
  const [category, setCategory] = useState("food");
  const [cost, setCost] = useState("");

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/expenses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          nameOfTheExpense,
          category,
          cost,
          date: selectedDate,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error);
        console.log(data.error);
        return;
      }
      // alert(data.message);
      navigate(`/expenses/${selectedDate}`);
    } catch (err) {
      console.log(`${err}`);
      alert("Couldn't add expense, please try again later.");
    }
  };
  return (
    <>
      <div className={styles.title}>Add New Expense</div>
      <div className={styles.addExpense}>
        <div>
          <label htmlFor="date">Date </label>
          <input
            onKeyDown={(e) => e.preventDefault()}
            type="date"
            name="date"
            id="date"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <form onSubmit={(e) => e.preventDefault()} className={styles.addForm}>
          <div>
            <label htmlFor="nameOfTheExpense">Expense (description)</label>
            <input
              required
              type="text"
              id="nameOfTheExpense"
              name="nameOfTheExpense"
              onChange={(e) => setNameOfTheExpense(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="groceries">Groceries</option>
              <option value="bills/emis">{"Bills / EMIs"}</option>
              <option value="entertainment">Entertainment</option>
              <option value="medical">Medical</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>
          <div>
            <label htmlFor="cost">Cost (INR)</label>
            <input
              required
              type="number"
              id="cost"
              name="cost"
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <div className={styles.addOrCancel}>
            <button onClick={handleAdd}>+ Add Expense</button>
            <button
              onClick={() =>
                navigate(`/expenses/${new Date().toLocaleDateString("en-CA")}`)
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
