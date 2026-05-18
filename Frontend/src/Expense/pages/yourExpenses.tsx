import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
type Expense = {
  _id: string;
  nameOfTheExpense: string;
  category: string;
  cost: number;
  date: string;
};
import styles from "./yourExpenses.module.css";
import _styles from "./overlay.module.css";
import { Tag } from "lucide-react";

const numToMonth = new Map();
numToMonth.set("01", "Jan");
numToMonth.set("02", "Feb");
numToMonth.set("03", "Mar");
numToMonth.set("04", "Apr");
numToMonth.set("05", "May");
numToMonth.set("06", "Jun");
numToMonth.set("07", "Jul");
numToMonth.set("08", "Aug");
numToMonth.set("09", "Sep");
numToMonth.set("10", "Oct");
numToMonth.set("11", "Nov");
numToMonth.set("12", "Dec");
export default function YourExpenses() {
  const { date } = useParams();
  const dateArray = date!.split("-");
  const month = dateArray[1];
  const year = dateArray[0];
  const navigate = useNavigate();
  const handleNavigateToAdd = () => {
    navigate("/addExpense");
  };
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [isBudgetSet, setIsBudgetSet] = useState(false);
  const [budget, setBudget] = useState(0);
  const [total, setTotal] = useState(0);

  const [IDToDelete, setIDToDelete] = useState("");
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/deleteExpense", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          expID: IDToDelete,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      if (expenses.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setRefresh((r) => !r);
      }
      setIDToDelete("");
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/expenses?date=${date}&search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=${3}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        setExpenses(data.expenses);
        setTotalPages(data.pages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExpenses();
  }, [date, debouncedSearch, page, refresh]);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/getBudget", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            month,
            year,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          // alert(data.message);
          return;
        }
        if (!data.budget) {
          setIsBudgetSet(false);
          setBudget(0);
        }
        if (data.budget) {
          setIsBudgetSet(true);
          setBudget(data.budget.budget);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBudget();
  }, [month, year]);

  useEffect(() => {
    const fetchMonthlyTotal = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/getTotal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            month,
            year,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        setTotal(data.total);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMonthlyTotal();
  }, [expenses, month, year]);

  return (
    <div>
      {showModal && (
        <div className={_styles.overlay}>
          <div className={_styles.modal}>
            <p>Are you sure you want to delete?</p>
            <div className={styles.deleteOrCancelButtons}>
              <button onClick={handleDelete}>Yes, delete!</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <button onClick={handleNavigateToAdd} className={styles.addExpenseButton}>
        Add Expense
      </button>
      <div className={styles.expenses}>
        <div className={styles.expensesOnACertainDateText}>
          Your expenses on
          <label htmlFor="date"></label>
          <input
            onKeyDown={(e) => e.preventDefault()}
            id="date"
            name="id"
            type="date"
            value={date}
            onChange={(e) => {
              navigate(`/expenses/${e.target.value}`);
              setPage(1);
            }}
          ></input>
          are:
        </div>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></input>
        <div className={styles.listOfExpenses}>
          {expenses.map((exp) => (
            <div key={exp._id} className={styles.expenseItem}>
              <div className={styles.name_CategoryCost}>
                <p style={{ margin: 0 }}>{exp.nameOfTheExpense}</p>
                <div className={styles.categoryCost}>
                  <div className={styles.tagAndCategory}>
                    <Tag size={20} />
                    {exp.category}
                  </div>

                  <p style={{ margin: 0 }}>{exp.cost} Rs.</p>
                </div>
              </div>
              <div className={styles.editDeleteButtons}>
                <button
                  onClick={() => navigate(`/expenses/edit/${exp._id}`)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setIDToDelete(exp._id);
                    setShowModal(true);
                  }}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {expenses.length > 0 ? (
          <div className={styles.pageNavigation}>
            <button
              disabled={page === 1}
              onClick={() => setPage((pg) => pg - 1)}
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((pg) => pg + 1)}
            >
              Next
            </button>
          </div>
        ) : search !== "" ? (
          <p>No expense on this day matches your search.</p>
        ) : (
          <p>No expenditure on this day.</p>
        )}
        {isBudgetSet && total > budget ? (
          <div className={styles.exceededBudget}>
            <p>
              You have exceeded the budget for {numToMonth.get(month)} {year}
            </p>
          </div>
        ) : (
          <p></p>
        )}
        {!isBudgetSet ? (
          <div className={styles.setBudgetAdvice}>
            <p>{`Set the budget for ${numToMonth.get(month)} ${year} for expending consciously.`}</p>
          </div>
        ) : (
          <div className={styles.budgetQuote}>
            <p>
              Budget of {numToMonth.get(month)} {year}: {budget} Rs.
            </p>
          </div>
        )}
        <div className={styles.totalExpenses}>
          <p>
            Total expenses of {numToMonth.get(month)} {year}: {total} Rs.
          </p>
        </div>
      </div>
    </div>
  );
}
