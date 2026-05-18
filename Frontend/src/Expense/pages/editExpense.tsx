import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./editExpense.module.css";
export default function EditExpense() {
  const expID = useParams().expID;
  const [nameOfTheExpense, setNameOfTheExpense] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/fetchExpense", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            expenseId: expID,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        setNameOfTheExpense(data.expense.nameOfTheExpense);
        setCategory(data.expense.category);
        setCost(data.expense.cost);
        setDate(data.expense.date);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExpense();
  }, [expID]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/editExpense", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          expenseID: expID,
          nameOfTheExpense,
          category,
          cost,
          date,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      // alert("Expense updated successfully.");
      navigate(`/expenses/${date}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <h2 style={{ textAlign: "center", fontWeight: "450" }}>Edit Expense</h2>
      <div className={styles.editForm}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.editFormItself}
        >
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              value={date}
              id="date"
              name="date"
              onChange={(e) => setDate(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="nameOfTheExpense">Expense name</label>
            <input
              required
              type="text"
              value={nameOfTheExpense}
              id="nameOfTheExpense"
              name="nameOfTheExpense"
              onChange={(e) => setNameOfTheExpense(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
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
            <label htmlFor="cost">Cost</label>
            <input
              required
              type="number"
              value={cost}
              name="cost"
              id="cost"
              onChange={(e) => setCost(e.target.value)}
            ></input>
          </div>
          <div className={styles.updateOrCancelButtons}>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => navigate(`/expenses/${date}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
