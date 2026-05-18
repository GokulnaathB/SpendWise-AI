import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Auth/pages/login";

import ProtectedRoute from "./Expense/components/protectionWrapper";
import AddExpense from "./Expense/pages/addExpense";
import YourExpenses from "./Expense/pages/yourExpenses";
import EditExpense from "./Expense/pages/editExpense";
import PostLoginLayout from "./PostLogin/PostLoginLayout";
import Budgeting from "./Expense/pages/budgeting";
import Dashboard from "./Expense/pages/dashboard";
import HowToSave from "./Expense/pages/howToSave";
import DownloadExpenses from "./Expense/pages/downloadExpenses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PostLoginLayout />}>
          <Route
            path="/expenses/:date"
            element={
              <ProtectedRoute>
                <YourExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addExpense"
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/edit/:expID"
            element={
              <ProtectedRoute>
                <EditExpense />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/budgeting"
            element={
              <ProtectedRoute>
                <Budgeting />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/howToSave"
            element={
              <ProtectedRoute>
                <HowToSave />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/downloadExpenses"
            element={
              <ProtectedRoute>
                <DownloadExpenses />
              </ProtectedRoute>
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
